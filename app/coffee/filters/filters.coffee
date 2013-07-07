angular.module("AppFilters", []).filter("groupByLetter", ->
  (incomingData, fieldName) ->
    if _.isNothing(incomingData)
      return []
    else return incomingData  if not (angular.isArray(incomingData) or angular.isObject(incomingData)) or typeof fieldName isnt "string" or (incomingData[0] and incomingData[0].letter)
    firstLetter = undefined
    value = undefined
    groupedByValue = {}
    groupedByLetter = {}
    finalList = []
    _.forEach incomingData, (item) ->
      value = item[fieldName]
      if typeof value is "undefined"
        return incomingData
      else value = String(value)  if typeof value isnt "string"
      value = value.trim()
      (groupedByValue[value] = groupedByValue[value] or []).push item

    _.forEach Object.keys(groupedByValue).sort(), (value) ->
      firstLetter = value.charAt(0).toUpperCase()
      groupedByLetter[firstLetter] = (groupedByLetter[firstLetter] or []).concat(groupedByValue[value])

    _.forEach Object.keys(groupedByLetter).sort(), (letter) ->
      finalList.push
        letter: letter
        group: groupedByLetter[letter]


    finalList
).filter("unGroupByLetter", ->
  (incomingData) ->
    if _.isNothing(incomingData)
      return []
    else return incomingData  if not angular.isArray(incomingData) or incomingData.length is 0
    if incomingData[0].letter
      flatArray = []
      i = 0
      len = incomingData.length

      while i < len
        groups = incomingData[i].group
        a = 0

        while a < groups.length
          flatArray.push groups[a]
          a++
        i++
      flatArray
    else
      incomingData
).filter("groupByCategory", ->
  (incomingData, categoryList) ->
    if _.isNothing(incomingData)
      return []
    else return incomingData  if not angular.isArray(incomingData) or not angular.isObject(incomingData) or not (incomingData[0] and angular.isDefined(incomingData[0].category))
    groupedByCategory = {}
    finalList = []
    _.forEach categoryList, (category) ->
      _.forEach incomingData, (item) ->
        if item.category is category
          groupedCategory = groupedByCategory[category]
          if groupedCategory
            groupedCategory.group.push item
          else
            groupedByCategory[category] = group: [item]


    _.forEach Object.keys(groupedByCategory), (category) ->
      finalList.push
        category: category
        group: groupedByCategory[category].group


    finalList
).filter("sortByProp", ->
  (incomingData, fieldName) ->
    if _.isNothing(incomingData)
      return []
    else return incomingData  if not (angular.isArray(incomingData) or angular.isObject(incomingData)) or typeof fieldName isnt "string"
    _.sortBy incomingData, (item) ->
      value = item[fieldName]
      if _.isString(value) then value.toLowerCase() else value

).filter("stripHTML", ->
  (content) ->
    Teseda.util.stripHTML content
).filter("totalWithText", ["$filter", ($filter) ->
  (total, text, blankTextForZero) ->
    if total is 0 and blankTextForZero
      ""
    else
      if text is ""
        total
      else
        pluralizedText = ((if total isnt 1 then text + "s" else text))
        (if (total > 0) then (total + " " + pluralizedText) else text)
]).filter("fileSize", ->
  (bytes) ->
    if _.isNothing(bytes) or _.isNull(bytes) or bytes is 'null'
      return '0 Bytes'
    byteString = ""
    switch true
      when (bytes < Math.pow(2, 10))
        byteString = bytes + " Bytes"
      when (bytes >= Math.pow(2, 10) and bytes < Math.pow(2, 20))
        byteString = Math.round(bytes / Math.pow(2, 10)) + " KB"
      when (bytes >= Math.pow(2, 20) and bytes < Math.pow(2, 30))
        byteString = Math.round((bytes / Math.pow(2, 20)) * 10) / 10 + " MB"
      when (bytes > Math.pow(2, 30))
        byteString = Math.round((bytes / Math.pow(2, 30)) * 100) / 100 + " GB"
    byteString
).filter("fileNameFromUrl", ->
  (url) ->
    # this removes the anchor at the end, if there is one
    url = url.substring(0, (if (url.indexOf("#") is -1) then url.length else url.indexOf("#")))
    # this removes the query after the file name, if there is one
    url = url.substring(0, (if (url.indexOf("?") is -1) then url.length else url.indexOf("?")))
    # this removes everything before the last slash in the path
    url = url.substring(url.lastIndexOf("/") + 1, url.length)
    url
).filter("booleanText", ->
  (bool, trueText, falseText) ->
    (if bool then trueText else falseText)
).filter("truncate", ->
  (text, length, end) ->
    return  if text is `undefined` or not text?
    length = 10  if isNaN(length)
    end = "..."  if end is `undefined`
    if text.length <= length or text.length - end.length <= length
      text
    else
      String(text).substring(0, length - end.length) + end
).filter("momentAgo", ->
  (datetime, format) ->
    if datetime
      if format
        moment(datetime, format).fromNow()
      else
        moment(datetime, "YYYYMMDDThhmmssZ").fromNow()
).filter("tel", ->
  (tel) ->
    return ""  unless tel
    value = tel.toString().trim().replace(/^\+/, "")
    return tel  if value.match(/[^0-9]/)
    country = undefined
    city = undefined
    number = undefined
    switch value.length
      when 10 # +1PPP####### -> C (PPP) ###-####
        country = 1
        city = value.slice(0, 3)
        number = value.slice(3)
      when 11 # +CPPP####### -> CCC (PP) ###-####
        country = value[0]
        city = value.slice(1, 4)
        number = value.slice(4)
      when 12 # +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3)
        city = value.slice(3, 5)
        number = value.slice(5)
      else
        return tel
    country = ""  if country is 1
    number = number.slice(0, 3) + "-" + number.slice(3)
    (country + " (" + city + ") " + number).trim()
).filter("fileExtFromMime", ->
  (input) ->
    output = ''
    if input
      if _.isString input
        output = input.split('/')
      else if _.isObject input
        useMimeOnly = if input.type is 'file_asset' then true else false
        mimeValue = (input.mimetype or input.mime_type)
        correctType = if useMimeOnly then mimeValue else (input.type or mimeValue)
        output = (correctType or '').split('/')
      return if output.length > 1 then output[1] else output[0]

    output
).filter("shorten", ->
  # shorten text
  # default mode is like os x, trim the string in the middle and trim in either side
  # if you add the "mode" parameter you can use "truncate" to trim the string at the end
  (input, length, parameters) ->

    return '' if _.isNothing(input) or _.isNull(input)

    input = input.toString()
    parameters = {} unless parameters
    ellipsis = "&hellip;"
    if parameters.mode is "truncate"
      input = input.substr(0, length) + ellipsis
    else
      if input.length >= length
        split = Math.ceil length / 2
        input = input.substr(0, split) + ellipsis + input.substr(input.length - split)
      else
        input

).filter("breakToBr", ->
  (input) ->

    return '' if _.isNothing(input) or _.isNull(input)

    input.replace(/\n/g, '<br/>').replace(/\r/g, '<br/><br/>')
).filter("breakToSpan", ->
  (input) ->

    return '' if _.isNothing(input) or _.isNull(input)

    input.replace(/\n/g, '<span class="br"></span>').replace(/\r/g, '<span class="br"></span><span class="br"></span>')
)
