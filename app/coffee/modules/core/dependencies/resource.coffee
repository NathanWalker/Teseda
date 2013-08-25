###
  Resource
  standard api resource wrapper
###

angular.module('Resource', ["Logger", "StaticText", "Modal", "RestApi"])
  .factory("ResourceService", ['LogService', '$rootScope', '$q', 'ModalService', 'RestApiService', (log, $rootScope, $q, modalService, RestApiService) ->
    logId = "ResourceService"

    setupResource = (options) ->
      api.allowNew = options.allowNew
      api.id = options.id
      api.type = options.type
      api.propertyKeys = options.propertyKeys
      api.containsFiles = options.containsFiles
      api.view = options.view
      api.projectId = api.getProjectId options
      api.resourceId = options.resourceId
      api.resourceEdit = _.clone(options.resourceEdit, true)
      api.valueFormatter = options.valueFormatter
      api.placeholder = options.placeholder
      api.custom = options.custom
      api.ignoreDelete = options.ignoreDelete

    closeOnSuccessOptions = (options) ->
      if not _.isNothing(options.closeOnSuccess)
        api.closeOnSuccess = options.closeOnSuccess
      else
        api.closeOnSuccess = true

    getHelperForOptions = (options) ->
      api.registry[options.apiId or api.defaultApiId]

    resolver = (service, defer, crudType, result, id, dataType) ->
      service.post(crudType, result, id, dataType).then (data) ->
        # temporary: assign 'public' to all component types until privacy controls are stable in UI
        componentTypesToPublicize = ['contact', 'about', 'gallery']
        if crudType is 'save' and _.contains(componentTypesToPublicize, dataType)
          log("---- TEMPORARILY: SETTING COMPONENT #{dataType} TO 'PUBLIC'")
          options =
            type:'asset'
            id:data.id
            data:
              visibility:'public'

          api.update(options).then () ->
            defer.resolve(data)
        else
          defer.resolve(data)
      , (data) ->
        defer.reject(data)

    api = {}

    api.crudApi = ['get', 'save', 'update', 'delete']

    api.getProjectId = (options) ->
      options.projectId or (if $rootScope.isAuthenticated and $rootScope.currentProject then $rootScope.currentProject.id else 0)

    api.closeOnSuccess = true

    api.layoutUrl = (name) ->
      "views/editing/layouts/#{if name then name else 'default'}.html"

    api.viewUrl = (name) ->
      "views/editing/#{if name then name else 'name'}.html"

    api.openView = (options) ->
      setupResource options
      modalService.open(api.layoutUrl(options.layout), options.title, options.modalClassName)
      $rootScope.safeApply()

    api.closeView = (canceled) ->
      modalService.close(canceled)

    api.can = (id, type) ->
      switch type
        when 'account' then $rootScope.currentUser and $rootScope.currentUser.id is id
        else $rootScope.isCurrentUserProject(id)

    api.confirmDelete = (message) ->
      confirmMsg = "Are you sure you want to delete?"
      if message
        confirmMsg = message
      $rootScope.confirm(confirmMsg)

    api.events =
      ready:"resource:ready"
      error:"resource:error"
      preventDefault:"resource:preventDefault"

    api.get = (options) ->
      apiHelper = getHelperForOptions(options)
      service = apiHelper.getServiceForType(options.type)
      defer = $q.defer()
      crudType = 'get'
      service.pre(crudType, options).then (apiOptions) ->
        if apiOptions
          RestApiService.get(apiOptions).then (result) ->
            resolver(service, defer, crudType, result, options.id)
          , (result) ->
            resolver(service, defer, crudType, result, options.id)
          $rootScope.safeApply()
      defer.promise

    api.save = (options) ->
      apiHelper = getHelperForOptions(options)
      service = apiHelper.getServiceForType(options.type)
      defer = $q.defer()
      crudType = 'save'
      service.pre(crudType, options).then (apiOptions) ->
        if apiOptions
          RestApiService.save(apiOptions).then (result) ->
            resolver(service, defer, crudType, result, options.id, options.type)
          , (result) ->
            resolver(service, defer, crudType, result, options.id, options.type)
          $rootScope.safeApply()
      defer.promise

    api.update = (options) ->
      apiHelper = getHelperForOptions(options)
      service = apiHelper.getServiceForType(options.type)
      defer = $q.defer()
      crudType = 'update'
      service.pre(crudType, options).then (apiOptions) ->
        if apiOptions
          RestApiService.update(apiOptions).then (result) ->
            resolver(service, defer, crudType, result, options.id, options.type)
          , (result) ->
            resolver(service, defer, crudType, result, options.id, options.type)
          $rootScope.safeApply()
      defer.promise

    api.delete = (options) ->
      apiHelper = getHelperForOptions(options)
      service = apiHelper.getServiceForType(options.type)
      dataType = options.data.type if options.data
      defer = $q.defer()
      crudType = 'delete'
      service.pre(crudType, options).then (apiOptions) ->
        if apiOptions
          RestApiService.delete(apiOptions).then (result) ->
            # this uses 'dataType' because confirms are conditional on data type not necessarily options type
            resolver(service, defer, crudType, result, options.id, dataType)
          , (result) ->
            resolver(service, defer, crudType, result, options.id, dataType)
          $rootScope.safeApply()
      defer.promise

    # provide a registry for other apis to take advantage of resource service
    api.registry = {}
    api.register = (apiHelper, apiId, resources, isDefault) ->
      api.registry[apiId] = apiHelper

      if isDefault
        # make specified api the default
        api.defaultApiId = apiId

      # generate standard events for this api
      _.forEach resources, (resource) ->
        event = {}
        _.forEach api.crudApi, (crud) ->
          event[crud] = "resource:#{apiId}:#{resource}:#{crud}"

        api.events[resource] = event

      # notify that all events are now setup
      $rootScope.$broadcast api.events.ready

    api

  ])

  .controller('ResourceEditCtrl', ['LogService', '$scope', '$rootScope', '$filter', '$timeout', '$http', '$q', 'ResourceService', (log, s, $rootScope, $filter, $timeout, $http, $q, rs) ->
    logId = 'ResourceEditCtrl'
    files = [] # files container for any file uploads that may have been uploaded in the view
    s.editing = false

    updateBtnText = () ->
      s.btnText = if s.editing then 'Update' else 'Save'

    setResourceEdit = (value, field) ->
      if _.isNothing(field)
        s.resourceEdit = value
      else
        s.resourceEdit = {}
        s.resourceEdit[field] = value
      s.editing = not _.isEmpty s.resourceEdit

    considerResourceId = (options) ->
      _.extend options, { resourceId: s.resourceId, assetGroupId: s.resourceId } if s.resourceId

    commitData = (data) ->
      if s.editing
        options =
          type: s.type
          data: data
          id: s.id
          projectId: s.projectId
        considerResourceId(options)
        rs.update(options).then () ->
          rs.closeView()
      else
        options =
          type: s.type
          data: data
          projectId: s.projectId
        if s.type is 'wrap'
          # need to add accountId
          _.extend(options, {accountId: $rootScope.currentUser.id})
        if s.type is 'tag'
          # db wants a tag key
          options.data =
            tag: data
        considerResourceId(options)
        rs.save(options).then () ->
          $rootScope.$broadcast Teseda.scope.events.project.sharedUpdate
          rs.closeView()
      $rootScope.safeApply()

    s.save = (preventDefault) ->

      data = {}

      if preventDefault

        # custom data preparation
        defer = $q.defer()
        defer.promise.then (additions) ->
          if additions
            # some additions are needed to add or modify on the model
            _.extend(data, additions)
          commitData(data)
        $rootScope.$broadcast rs.events.preventDefault,
          projectId:s.projectId
          type:s.type
          editing: s.editing
          custom: s.custom
          resourceEdit:s.resourceEdit
          propertyKeys: s.propertyKeys
          files:files
          defer:defer
      else

        # use propertyKeys configuration
        if s.propertyKeys
          _.forEach s.propertyKeys, (key) ->
            if _.isString(s.resourceEdit)
              data[key] = s.resourceEdit
            else
              data[key] = s.resourceEdit[key]
        else
          data = s.resourceEdit

        if s.valueFormatter and _.isString(data)
          # if a value needs to be formatted a particular way, use valueFormatter
          # for nesting tag support
          data = s.valueFormatter(data)

        commitData(data)

    s.cancel = () ->
      rs.closeView(true)

    s.allowNew = s.allowNew or rs.allowNew
    s.id = s.id or rs.id
    s.type = s.type or rs.type
    s.propertyKeys = s.propertyKeys or rs.propertyKeys
    s.containsFiles = s.containsFiles or rs.containsFiles
    s.projectId = s.projectId or rs.projectId
    s.resourceId = s.resourceId or rs.resourceId
    s.custom = s.custom or rs.custom
    s.ignoreDelete = s.ignoreDelete or rs.ignoreDelete
    s.valueFormatter = s.valueFormatter or rs.valueFormatter
    s.placeholder = (s.placeholder or rs.placeholder) or ''
    s.view = rs.viewUrl(s.view or rs.view)
    setResourceEdit(rs.resourceEdit or '') # for edit view displays
    updateBtnText()

    # handle potential files
    # can only work when resourceEdit is an object and propertyKeys are specified
    if s.containsFiles and _.isObject(s.resourceEdit)
      _.forEach s.propertyKeys, (key) ->
        value = s.resourceEdit[key]
        if _.isObject(value)
          # always look for an id when working with existing files
          fileId = value.id
          if fileId
            files.push(fileId)
        else if _.isNumber(value)
          # we have a direct id to a file asset
          files.push(value)


    # special cases should be handled here
    specialCaseTypes = ['contact', 'location']
    if _.contains(specialCaseTypes, s.type) and s.resourceEdit.name
      # editing contact info
      s.resourceEdit = _.clone(s.resourceEdit, true)

      setupAddressEdit = (group) ->
        data =
          id:group.id
          label:"Address"
          types: Teseda.contacts.defaultTypes()
          defaultType: Teseda.contacts.address.defaultType
          title:group.name

        if s.custom
          # contact address edit
          customData = s.custom[group.id]
          if customData
            data.address = if customData.Address then customData.Address.value else ''
            data.city = if customData.City then customData.City.value else ''
            data.state = if customData.State then customData.State.value else ''
            data.zip = if customData.Zip then customData.Zip.value else ''
        else
          # location edit
          _.forEach group.data, (addressData) ->
            data[addressData.name.toLowerCase()] = if addressData.value then addressData.value else ''

        s.resourceEdit.contacts = [] if _.isNothing(s.resourceEdit.contacts)
        s.resourceEdit.contacts.push data

      if s.type is 'contact'
        s.resourceEdit.contacts = s.resourceEdit.data

        # TEMPORARY HACK - remove when better unit testing is implemented around adding of contacts
        # right now, somehow blank contacts get created - been trying to find the particular condition
        # this will at least allow a user to remove the bad contact group if it exists (mainly for johns presentation)
        # strip erroneous null contact names
        cnt = 0
        erroneousIndices = []
        while cnt < s.resourceEdit.contacts.length
          c = s.resourceEdit.contacts[cnt]
          if _.isNothing(c.name)
            # we have an erroneous contact error - name should never be nothing
            erroneousIndices.push(cnt)
          cnt++
        # now remove erroneous contacts if they exist
        _.forEach erroneousIndices, (index) ->
          # make sure its actually there
          errorContact = s.resourceEdit.contacts[index]
          unless _.isNothing(errorContact)
            s.resourceEdit.contacts.splice(index, 1)
        # END TEMPORARY HACK

        # add labels
        _.forEach s.resourceEdit.contacts, (contact) ->
          labelParts = contact.name.split(' ')
          contact.defaultType = labelParts[0]
          contact.label = if labelParts.length > 1 then labelParts[1] else labelParts[0]
          if contact.label is "Phone"
            contact.types = Teseda.contacts.phone.types

        # handle address data for contacts
        if s.custom and s.resourceEdit.tags and s.resourceEdit.tags.length
          # address groups
          _.forEach s.resourceEdit.tags, (addrGroup) ->
            setupAddressEdit(addrGroup)

      else if s.type is 'location'
        setupAddressEdit(s.resourceEdit)

    s.$on Teseda.scope.events.project.imageSelect, (e, result) ->
      log(result)
      if _.isObject(s.resourceEdit)
        if result.projectId is s.resourceEdit.id
          $(result.previewSelector).css
            'background-image':"url(#{result.url})"

          # put existing id in files collection, always replace
          files = [result.image.id]

    s.$on Teseda.scope.events.site.imageCropped, (e, result) ->
      fieldModel = s.resourceEdit[result.info.field]
      if _.isString(fieldModel)
        s.resourceEdit[result.info.field].url = result.info.url
      else
        fieldModel.url = result.info.url

      $('.upload-file-preview').css
        'background-image':"url(#{result.info.url})"
      $rootScope.safeApply()

    s.resetFiles = () ->
      files = []

    # always autofocus on first input field
    $timeout ->
      $('.modal input, .modal textarea').first().focus()
    , 200

    log "init() with type: #{s.type}", logId
  ])

  .controller("ResourceImageManagerCtrl", ["LogService", "$scope", "$rootScope", "$filter", "$timeout", "FilePickerService", (log, s, $rootScope, $filter, $timeout, fp) ->

    # initialize model if needed
    if _.isNothing(s.model) or s.model is ''
      s.model = {}

    # initialize model property if needed
    if _.isNothing(s.model[s.modelProperty])
      s.model[s.modelProperty] = []

    s.collection = s.model[s.modelProperty]
    s.limit = 12

    s.sortableOptions =
      update: (e, ui) ->
        i = 0
        newSlideOrder = []
        # I know, dom manipulation is bad here - I hopefully will have time to refactor into directive later
        $('.image-preview-slider .image[data-id]').each ->
            newSlideOrder.push(+$(this).attr('data-id'))
        while i < newSlideOrder.length
          slideId = newSlideOrder[i]
          slide = _.find s.collection, (item) ->
            item.id.toString() is slideId
          if slide
            slide.slide_order = i
          i++

    s.generatingPreviews = false

    s.removeImage = (image) ->
      if image.url
        # was a new file, remove from filepicker uploading collection
        fpImageIndex = _.indexOf(_.pluck(fp.filesUploading, 'id'), image.id)
        if fpImageIndex > -1
          fp.filesUploading.splice(fpImageIndex, 1)
      else
        # add to a removal collection on the model
        if _.isNothing(s.model.removeCollection)
          s.model.removeCollection = []
        s.model.removeCollection.push(image.id)

      localImageIndex = _.indexOf(_.pluck(s.collection, 'id'), image.id)
      if localImageIndex > -1
        s.collection.splice(localImageIndex, 1)

     s.$on Teseda.scope.events.infiniteScroll.needMore, (e, id) ->
      if id is 'ResourceImageManagerCtrl'
        if s.limit <= s.collection.length
          s.limit += s.collection.length%4 + s.limit
        s.$on Teseda.scope.events.infiniteScroll.loadFinished
  ])

  .directive("resourceImageManager", () ->
    restrict:"A"
    replace:true
    controller:'ResourceImageManagerCtrl'
    scope:
      model:'=resourceImageManager'
      modelProperty:'@'
    templateUrl:'template/components/image-manager.html'
  )

  .directive("resourceEdit", ['LogService', '$rootScope', '$controller', 'ResourceService', 'FilePickerService', (log, $rootScope, $controller, rs, fp) ->
    link = (scope, element, attrs) ->
      init = () ->
        if (not $rootScope.isAuthenticated and scope.allowNew) or rs.can(scope.canId, scope.type)
          # authorized to edit
          scope.propertyKeys = scope.properties.split(',') if scope.properties

          if scope.action is 'delete'
            element.bind 'click', (e) ->
              e.stopPropagation()
              options =
                id: scope.id
                data: scope.resourceEdit
                projectId: scope.canId
                type: scope.type
              $rootScope.safeApply ->
                rs.delete(options)

          else
            # default is 'edit' action

            openView = (e) ->
              unless _.isNothing(e)
                e.stopPropagation()
                if $(e.target).data('resource-edit') is ''
                  # reset service value when blank
                  rs.resourceEdit = ''

              # always reset file status as resource editing may independently upload files in isolation
              fp.resetFileStatus()

              options =
                allowNew: scope.allowNew
                id: scope.id
                type: scope.type
                projectId: scope.canId
                propertyKeys: scope.propertyKeys
                containsFiles: scope.containsFiles
                placeholder: scope.placeholder
                resourceEdit: scope.resourceEdit
                resourceId: scope.id
                ignoreDelete: scope.ignoreDelete
                modalClassName: scope.modalClassName
                custom: scope.custom
                layout: scope.layout
                valueFormatter: scope.valueFormatter
                view: scope.view
                title: scope.title or 'Edit'
              rs.openView(options)

            unless attrs.ngClick
              # manual click bind when no ngClick is declared
              element.bind 'click', (e) ->
                openView(e)

            # directive allows optional usage of scope binding (in case other functions need to be called before edit fires
            scope.edit = (e) ->
              openView(e)

        else
          # not authorized, remove edit ability
          element.remove()

      if not $rootScope.isAuthenticated or scope.canId
        init()
      else
        killWatcher = scope.$watch 'canId', (value) ->
          if value
            killWatcher()
            init()


    restrict: 'A'
    scope:
      action:'@'
      allowNew:'@'
      id:'='
      canId:'='
      modalClassName:'@?'
      ignoreDelete:'@?'
      custom:'=?'
      layout:'@'
      placeholder:'@'
      properties:'@'
      containsFiles:'@'
      resourceEdit:'=?'
      title:'@'
      type:'@'
      valueFormatter:'=?'
      view:'@'
    link: link
  ])

