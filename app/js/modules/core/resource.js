/*
  Resource
  standard api resource wrapper
*/
angular.module('Resource', ["Logger", "StaticText", "Modal", "RestApi"]).factory("ResourceService", [
  'LogService', '$rootScope', '$q', 'ModalService', 'RestApiService', function(log, $rootScope, $q, modalService, RestApiService) {
    var api, closeOnSuccessOptions, getHelperForOptions, logId, resolver, setupResource;

    logId = "ResourceService";
    setupResource = function(options) {
      api.allowNew = options.allowNew;
      api.id = options.id;
      api.type = options.type;
      api.propertyKeys = options.propertyKeys;
      api.containsFiles = options.containsFiles;
      api.view = options.view;
      api.projectId = api.getProjectId(options);
      api.resourceId = options.resourceId;
      api.resourceEdit = _.clone(options.resourceEdit, true);
      api.valueFormatter = options.valueFormatter;
      api.placeholder = options.placeholder;
      api.custom = options.custom;
      return api.ignoreDelete = options.ignoreDelete;
    };
    closeOnSuccessOptions = function(options) {
      if (!_.isNothing(options.closeOnSuccess)) {
        return api.closeOnSuccess = options.closeOnSuccess;
      } else {
        return api.closeOnSuccess = true;
      }
    };
    getHelperForOptions = function(options) {
      return api.registry[options.apiId || api.defaultApiId];
    };
    resolver = function(service, defer, crudType, result, id, dataType) {
      return service.post(crudType, result, id, dataType).then(function(data) {
        var componentTypesToPublicize, options;

        componentTypesToPublicize = ['contact', 'about', 'gallery'];
        if (crudType === 'save' && _.contains(componentTypesToPublicize, dataType)) {
          log("---- TEMPORARILY: SETTING COMPONENT " + dataType + " TO 'PUBLIC'");
          options = {
            type: 'asset',
            id: data.id,
            data: {
              visibility: 'public'
            }
          };
          return api.update(options).then(function() {
            return defer.resolve(data);
          });
        } else {
          return defer.resolve(data);
        }
      }, function(data) {
        return defer.reject(data);
      });
    };
    api = {};
    api.crudApi = ['get', 'save', 'update', 'delete'];
    api.getProjectId = function(options) {
      return options.projectId || ($rootScope.isAuthenticated && $rootScope.currentProject ? $rootScope.currentProject.id : 0);
    };
    api.closeOnSuccess = true;
    api.layoutUrl = function(name) {
      return "views/editing/layouts/" + (name ? name : 'default') + ".html";
    };
    api.viewUrl = function(name) {
      return "views/editing/" + (name ? name : 'name') + ".html";
    };
    api.openView = function(options) {
      setupResource(options);
      modalService.open(api.layoutUrl(options.layout), options.title, options.modalClassName);
      return $rootScope.safeApply();
    };
    api.closeView = function(canceled) {
      return modalService.close(canceled);
    };
    api.can = function(id, type) {
      switch (type) {
        case 'account':
          return $rootScope.currentUser && $rootScope.currentUser.id === id;
        default:
          return $rootScope.isCurrentUserProject(id);
      }
    };
    api.confirmDelete = function(message) {
      var confirmMsg;

      confirmMsg = "Are you sure you want to delete?";
      if (message) {
        confirmMsg = message;
      }
      return $rootScope.confirm(confirmMsg);
    };
    api.events = {
      ready: "resource:ready",
      error: "resource:error",
      preventDefault: "resource:preventDefault"
    };
    api.get = function(options) {
      var apiHelper, crudType, defer, service;

      apiHelper = getHelperForOptions(options);
      service = apiHelper.getServiceForType(options.type);
      defer = $q.defer();
      crudType = 'get';
      service.pre(crudType, options).then(function(apiOptions) {
        if (apiOptions) {
          RestApiService.get(apiOptions).then(function(result) {
            return resolver(service, defer, crudType, result, options.id);
          }, function(result) {
            return resolver(service, defer, crudType, result, options.id);
          });
          return $rootScope.safeApply();
        }
      });
      return defer.promise;
    };
    api.save = function(options) {
      var apiHelper, crudType, defer, service;

      apiHelper = getHelperForOptions(options);
      service = apiHelper.getServiceForType(options.type);
      defer = $q.defer();
      crudType = 'save';
      service.pre(crudType, options).then(function(apiOptions) {
        if (apiOptions) {
          RestApiService.save(apiOptions).then(function(result) {
            return resolver(service, defer, crudType, result, options.id, options.type);
          }, function(result) {
            return resolver(service, defer, crudType, result, options.id, options.type);
          });
          return $rootScope.safeApply();
        }
      });
      return defer.promise;
    };
    api.update = function(options) {
      var apiHelper, crudType, defer, service;

      apiHelper = getHelperForOptions(options);
      service = apiHelper.getServiceForType(options.type);
      defer = $q.defer();
      crudType = 'update';
      service.pre(crudType, options).then(function(apiOptions) {
        if (apiOptions) {
          RestApiService.update(apiOptions).then(function(result) {
            return resolver(service, defer, crudType, result, options.id, options.type);
          }, function(result) {
            return resolver(service, defer, crudType, result, options.id, options.type);
          });
          return $rootScope.safeApply();
        }
      });
      return defer.promise;
    };
    api["delete"] = function(options) {
      var apiHelper, crudType, dataType, defer, service;

      apiHelper = getHelperForOptions(options);
      service = apiHelper.getServiceForType(options.type);
      if (options.data) {
        dataType = options.data.type;
      }
      defer = $q.defer();
      crudType = 'delete';
      service.pre(crudType, options).then(function(apiOptions) {
        if (apiOptions) {
          RestApiService["delete"](apiOptions).then(function(result) {
            return resolver(service, defer, crudType, result, options.id, dataType);
          }, function(result) {
            return resolver(service, defer, crudType, result, options.id, dataType);
          });
          return $rootScope.safeApply();
        }
      });
      return defer.promise;
    };
    api.registry = {};
    api.register = function(apiHelper, apiId, resources, isDefault) {
      api.registry[apiId] = apiHelper;
      if (isDefault) {
        api.defaultApiId = apiId;
      }
      _.forEach(resources, function(resource) {
        var event;

        event = {};
        _.forEach(api.crudApi, function(crud) {
          return event[crud] = "resource:" + apiId + ":" + resource + ":" + crud;
        });
        return api.events[resource] = event;
      });
      return $rootScope.$broadcast(api.events.ready);
    };
    return api;
  }
]).controller('ResourceEditCtrl', [
  'LogService', '$scope', '$rootScope', '$filter', '$timeout', '$http', '$q', 'ResourceService', function(log, s, $rootScope, $filter, $timeout, $http, $q, rs) {
    var c, cnt, commitData, considerResourceId, erroneousIndices, files, logId, setResourceEdit, setupAddressEdit, specialCaseTypes, updateBtnText;

    logId = 'ResourceEditCtrl';
    files = [];
    s.editing = false;
    updateBtnText = function() {
      return s.btnText = s.editing ? 'Update' : 'Save';
    };
    setResourceEdit = function(value, field) {
      if (_.isNothing(field)) {
        s.resourceEdit = value;
      } else {
        s.resourceEdit = {};
        s.resourceEdit[field] = value;
      }
      return s.editing = !_.isEmpty(s.resourceEdit);
    };
    considerResourceId = function(options) {
      if (s.resourceId) {
        return _.extend(options, {
          resourceId: s.resourceId,
          assetGroupId: s.resourceId
        });
      }
    };
    commitData = function(data) {
      var options;

      if (s.editing) {
        options = {
          type: s.type,
          data: data,
          id: s.id,
          projectId: s.projectId
        };
        considerResourceId(options);
        rs.update(options).then(function() {
          return rs.closeView();
        });
      } else {
        options = {
          type: s.type,
          data: data,
          projectId: s.projectId
        };
        if (s.type === 'wrap') {
          _.extend(options, {
            accountId: $rootScope.currentUser.id
          });
        }
        if (s.type === 'tag') {
          options.data = {
            tag: data
          };
        }
        considerResourceId(options);
        rs.save(options).then(function() {
          $rootScope.$broadcast(Teseda.scope.events.project.sharedUpdate);
          return rs.closeView();
        });
      }
      return $rootScope.safeApply();
    };
    s.save = function(preventDefault) {
      var data, defer;

      data = {};
      if (preventDefault) {
        defer = $q.defer();
        defer.promise.then(function(additions) {
          if (additions) {
            _.extend(data, additions);
          }
          return commitData(data);
        });
        return $rootScope.$broadcast(rs.events.preventDefault, {
          projectId: s.projectId,
          type: s.type,
          editing: s.editing,
          custom: s.custom,
          resourceEdit: s.resourceEdit,
          propertyKeys: s.propertyKeys,
          files: files,
          defer: defer
        });
      } else {
        if (s.propertyKeys) {
          _.forEach(s.propertyKeys, function(key) {
            if (_.isString(s.resourceEdit)) {
              return data[key] = s.resourceEdit;
            } else {
              return data[key] = s.resourceEdit[key];
            }
          });
        } else {
          data = s.resourceEdit;
        }
        if (s.valueFormatter && _.isString(data)) {
          data = s.valueFormatter(data);
        }
        return commitData(data);
      }
    };
    s.cancel = function() {
      return rs.closeView(true);
    };
    s.allowNew = s.allowNew || rs.allowNew;
    s.id = s.id || rs.id;
    s.type = s.type || rs.type;
    s.propertyKeys = s.propertyKeys || rs.propertyKeys;
    s.containsFiles = s.containsFiles || rs.containsFiles;
    s.projectId = s.projectId || rs.projectId;
    s.resourceId = s.resourceId || rs.resourceId;
    s.custom = s.custom || rs.custom;
    s.ignoreDelete = s.ignoreDelete || rs.ignoreDelete;
    s.valueFormatter = s.valueFormatter || rs.valueFormatter;
    s.placeholder = (s.placeholder || rs.placeholder) || '';
    s.view = rs.viewUrl(s.view || rs.view);
    setResourceEdit(rs.resourceEdit || '');
    updateBtnText();
    if (s.containsFiles && _.isObject(s.resourceEdit)) {
      _.forEach(s.propertyKeys, function(key) {
        var fileId, value;

        value = s.resourceEdit[key];
        if (_.isObject(value)) {
          fileId = value.id;
          if (fileId) {
            return files.push(fileId);
          }
        } else if (_.isNumber(value)) {
          return files.push(value);
        }
      });
    }
    specialCaseTypes = ['contact', 'location'];
    if (_.contains(specialCaseTypes, s.type) && s.resourceEdit.name) {
      s.resourceEdit = _.clone(s.resourceEdit, true);
      setupAddressEdit = function(group) {
        var customData, data;

        data = {
          id: group.id,
          label: "Address",
          types: Teseda.contacts.defaultTypes(),
          defaultType: Teseda.contacts.address.defaultType,
          title: group.name
        };
        if (s.custom) {
          customData = s.custom[group.id];
          if (customData) {
            data.address = customData.Address ? customData.Address.value : '';
            data.city = customData.City ? customData.City.value : '';
            data.state = customData.State ? customData.State.value : '';
            data.zip = customData.Zip ? customData.Zip.value : '';
          }
        } else {
          _.forEach(group.data, function(addressData) {
            return data[addressData.name.toLowerCase()] = addressData.value ? addressData.value : '';
          });
        }
        if (_.isNothing(s.resourceEdit.contacts)) {
          s.resourceEdit.contacts = [];
        }
        return s.resourceEdit.contacts.push(data);
      };
      if (s.type === 'contact') {
        s.resourceEdit.contacts = s.resourceEdit.data;
        cnt = 0;
        erroneousIndices = [];
        while (cnt < s.resourceEdit.contacts.length) {
          c = s.resourceEdit.contacts[cnt];
          if (_.isNothing(c.name)) {
            erroneousIndices.push(cnt);
          }
          cnt++;
        }
        _.forEach(erroneousIndices, function(index) {
          var errorContact;

          errorContact = s.resourceEdit.contacts[index];
          if (!_.isNothing(errorContact)) {
            return s.resourceEdit.contacts.splice(index, 1);
          }
        });
        _.forEach(s.resourceEdit.contacts, function(contact) {
          var labelParts;

          labelParts = contact.name.split(' ');
          contact.defaultType = labelParts[0];
          contact.label = labelParts.length > 1 ? labelParts[1] : labelParts[0];
          if (contact.label === "Phone") {
            return contact.types = Teseda.contacts.phone.types;
          }
        });
        if (s.custom && s.resourceEdit.tags && s.resourceEdit.tags.length) {
          _.forEach(s.resourceEdit.tags, function(addrGroup) {
            return setupAddressEdit(addrGroup);
          });
        }
      } else if (s.type === 'location') {
        setupAddressEdit(s.resourceEdit);
      }
    }
    s.$on(Teseda.scope.events.project.imageSelect, function(e, result) {
      log(result);
      if (_.isObject(s.resourceEdit)) {
        if (result.projectId === s.resourceEdit.id) {
          $(result.previewSelector).css({
            'background-image': "url(" + result.url + ")"
          });
          return files = [result.image.id];
        }
      }
    });
    s.$on(Teseda.scope.events.site.imageCropped, function(e, result) {
      var fieldModel;

      fieldModel = s.resourceEdit[result.info.field];
      if (_.isString(fieldModel)) {
        s.resourceEdit[result.info.field].url = result.info.url;
      } else {
        fieldModel.url = result.info.url;
      }
      $('.upload-file-preview').css({
        'background-image': "url(" + result.info.url + ")"
      });
      return $rootScope.safeApply();
    });
    s.resetFiles = function() {
      return files = [];
    };
    $timeout(function() {
      return $('.modal input, .modal textarea').first().focus();
    }, 200);
    return log("init() with type: " + s.type, logId);
  }
]).controller("ResourceImageManagerCtrl", [
  "LogService", "$scope", "$rootScope", "$filter", "$timeout", "FilePickerService", function(log, s, $rootScope, $filter, $timeout, fp) {
    if (_.isNothing(s.model) || s.model === '') {
      s.model = {};
    }
    if (_.isNothing(s.model[s.modelProperty])) {
      s.model[s.modelProperty] = [];
    }
    s.collection = s.model[s.modelProperty];
    s.limit = 12;
    s.sortableOptions = {
      update: function(e, ui) {
        var i, newSlideOrder, slide, slideId, _results;

        i = 0;
        newSlideOrder = [];
        $('.image-preview-slider .image[data-id]').each(function() {
          return newSlideOrder.push(+$(this).attr('data-id'));
        });
        _results = [];
        while (i < newSlideOrder.length) {
          slideId = newSlideOrder[i];
          slide = _.find(s.collection, function(item) {
            return item.id.toString() === slideId;
          });
          if (slide) {
            slide.slide_order = i;
          }
          _results.push(i++);
        }
        return _results;
      }
    };
    s.generatingPreviews = false;
    s.removeImage = function(image) {
      var fpImageIndex, localImageIndex;

      if (image.url) {
        fpImageIndex = _.indexOf(_.pluck(fp.filesUploading, 'id'), image.id);
        if (fpImageIndex > -1) {
          fp.filesUploading.splice(fpImageIndex, 1);
        }
      } else {
        if (_.isNothing(s.model.removeCollection)) {
          s.model.removeCollection = [];
        }
        s.model.removeCollection.push(image.id);
      }
      localImageIndex = _.indexOf(_.pluck(s.collection, 'id'), image.id);
      if (localImageIndex > -1) {
        return s.collection.splice(localImageIndex, 1);
      }
    };
    return s.$on(Teseda.scope.events.infiniteScroll.needMore, function(e, id) {
      if (id === 'ResourceImageManagerCtrl') {
        if (s.limit <= s.collection.length) {
          s.limit += s.collection.length % 4 + s.limit;
        }
        return s.$on(Teseda.scope.events.infiniteScroll.loadFinished);
      }
    });
  }
]).directive("resourceImageManager", function() {
  return {
    restrict: "A",
    replace: true,
    controller: 'ResourceImageManagerCtrl',
    scope: {
      model: '=resourceImageManager',
      modelProperty: '@'
    },
    templateUrl: 'template/components/image-manager.html'
  };
}).directive("resourceEdit", [
  'LogService', '$rootScope', '$controller', 'ResourceService', 'FilePickerService', function(log, $rootScope, $controller, rs, fp) {
    var link;

    link = function(scope, element, attrs) {
      var init, killWatcher;

      init = function() {
        var openView;

        if ((!$rootScope.isAuthenticated && scope.allowNew) || rs.can(scope.canId, scope.type)) {
          if (scope.properties) {
            scope.propertyKeys = scope.properties.split(',');
          }
          if (scope.action === 'delete') {
            return element.bind('click', function(e) {
              var options;

              e.stopPropagation();
              options = {
                id: scope.id,
                data: scope.resourceEdit,
                projectId: scope.canId,
                type: scope.type
              };
              return $rootScope.safeApply(function() {
                return rs["delete"](options);
              });
            });
          } else {
            openView = function(e) {
              var options;

              if (!_.isNothing(e)) {
                e.stopPropagation();
                if ($(e.target).data('resource-edit') === '') {
                  rs.resourceEdit = '';
                }
              }
              fp.resetFileStatus();
              options = {
                allowNew: scope.allowNew,
                id: scope.id,
                type: scope.type,
                projectId: scope.canId,
                propertyKeys: scope.propertyKeys,
                containsFiles: scope.containsFiles,
                placeholder: scope.placeholder,
                resourceEdit: scope.resourceEdit,
                resourceId: scope.id,
                ignoreDelete: scope.ignoreDelete,
                modalClassName: scope.modalClassName,
                custom: scope.custom,
                layout: scope.layout,
                valueFormatter: scope.valueFormatter,
                view: scope.view,
                title: scope.title || 'Edit'
              };
              return rs.openView(options);
            };
            if (!attrs.ngClick) {
              element.bind('click', function(e) {
                return openView(e);
              });
            }
            return scope.edit = function(e) {
              return openView(e);
            };
          }
        } else {
          return element.remove();
        }
      };
      if (!$rootScope.isAuthenticated || scope.canId) {
        return init();
      } else {
        return killWatcher = scope.$watch('canId', function(value) {
          if (value) {
            killWatcher();
            return init();
          }
        });
      }
    };
    return {
      restrict: 'A',
      scope: {
        action: '@',
        allowNew: '@',
        id: '=',
        canId: '=',
        modalClassName: '@?',
        ignoreDelete: '@?',
        custom: '=?',
        layout: '@',
        placeholder: '@',
        properties: '@',
        containsFiles: '@',
        resourceEdit: '=?',
        title: '@',
        type: '@',
        valueFormatter: '=?',
        view: '@'
      },
      link: link
    };
  }
]);
