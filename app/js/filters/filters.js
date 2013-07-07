angular.module("AppFilters", []).filter("groupByLetter", function() {
  return function(incomingData, fieldName) {
    var finalList, firstLetter, groupedByLetter, groupedByValue, value;

    if (_.isNothing(incomingData)) {
      return [];
    } else {
      if (!(angular.isArray(incomingData) || angular.isObject(incomingData)) || typeof fieldName !== "string" || (incomingData[0] && incomingData[0].letter)) {
        return incomingData;
      }
    }
    firstLetter = void 0;
    value = void 0;
    groupedByValue = {};
    groupedByLetter = {};
    finalList = [];
    _.forEach(incomingData, function(item) {
      value = item[fieldName];
      if (typeof value === "undefined") {
        return incomingData;
      } else {
        if (typeof value !== "string") {
          value = String(value);
        }
      }
      value = value.trim();
      return (groupedByValue[value] = groupedByValue[value] || []).push(item);
    });
    _.forEach(Object.keys(groupedByValue).sort(), function(value) {
      firstLetter = value.charAt(0).toUpperCase();
      return groupedByLetter[firstLetter] = (groupedByLetter[firstLetter] || []).concat(groupedByValue[value]);
    });
    _.forEach(Object.keys(groupedByLetter).sort(), function(letter) {
      return finalList.push({
        letter: letter,
        group: groupedByLetter[letter]
      });
    });
    return finalList;
  };
}).filter("unGroupByLetter", function() {
  return function(incomingData) {
    var a, flatArray, groups, i, len;

    if (_.isNothing(incomingData)) {
      return [];
    } else {
      if (!angular.isArray(incomingData) || incomingData.length === 0) {
        return incomingData;
      }
    }
    if (incomingData[0].letter) {
      flatArray = [];
      i = 0;
      len = incomingData.length;
      while (i < len) {
        groups = incomingData[i].group;
        a = 0;
        while (a < groups.length) {
          flatArray.push(groups[a]);
          a++;
        }
        i++;
      }
      return flatArray;
    } else {
      return incomingData;
    }
  };
}).filter("groupByCategory", function() {
  return function(incomingData, categoryList) {
    var finalList, groupedByCategory;

    if (_.isNothing(incomingData)) {
      return [];
    } else {
      if (!angular.isArray(incomingData) || !angular.isObject(incomingData) || !(incomingData[0] && angular.isDefined(incomingData[0].category))) {
        return incomingData;
      }
    }
    groupedByCategory = {};
    finalList = [];
    _.forEach(categoryList, function(category) {
      return _.forEach(incomingData, function(item) {
        var groupedCategory;

        if (item.category === category) {
          groupedCategory = groupedByCategory[category];
          if (groupedCategory) {
            return groupedCategory.group.push(item);
          } else {
            return groupedByCategory[category] = {
              group: [item]
            };
          }
        }
      });
    });
    _.forEach(Object.keys(groupedByCategory), function(category) {
      return finalList.push({
        category: category,
        group: groupedByCategory[category].group
      });
    });
    return finalList;
  };
}).filter("sortByProp", function() {
  return function(incomingData, fieldName) {
    if (_.isNothing(incomingData)) {
      return [];
    } else {
      if (!(angular.isArray(incomingData) || angular.isObject(incomingData)) || typeof fieldName !== "string") {
        return incomingData;
      }
    }
    return _.sortBy(incomingData, function(item) {
      var value;

      value = item[fieldName];
      if (_.isString(value)) {
        return value.toLowerCase();
      } else {
        return value;
      }
    });
  };
}).filter("stripHTML", function() {
  return function(content) {
    return Teseda.util.stripHTML(content);
  };
}).filter("totalWithText", [
  "$filter", function($filter) {
    return function(total, text, blankTextForZero) {
      var pluralizedText;

      if (total === 0 && blankTextForZero) {
        return "";
      } else {
        if (text === "") {
          return total;
        } else {
          pluralizedText = (total !== 1 ? text + "s" : text);
          if (total > 0) {
            return total + " " + pluralizedText;
          } else {
            return text;
          }
        }
      }
    };
  }
]).filter("fileSize", function() {
  return function(bytes) {
    var byteString;

    if (_.isNothing(bytes) || _.isNull(bytes) || bytes === 'null') {
      return '0 Bytes';
    }
    byteString = "";
    switch (true) {
      case bytes < Math.pow(2, 10):
        byteString = bytes + " Bytes";
        break;
      case bytes >= Math.pow(2, 10) && bytes < Math.pow(2, 20):
        byteString = Math.round(bytes / Math.pow(2, 10)) + " KB";
        break;
      case bytes >= Math.pow(2, 20) && bytes < Math.pow(2, 30):
        byteString = Math.round((bytes / Math.pow(2, 20)) * 10) / 10 + " MB";
        break;
      case bytes > Math.pow(2, 30):
        byteString = Math.round((bytes / Math.pow(2, 30)) * 100) / 100 + " GB";
    }
    return byteString;
  };
}).filter("fileNameFromUrl", function() {
  return function(url) {
    url = url.substring(0, (url.indexOf("#") === -1 ? url.length : url.indexOf("#")));
    url = url.substring(0, (url.indexOf("?") === -1 ? url.length : url.indexOf("?")));
    url = url.substring(url.lastIndexOf("/") + 1, url.length);
    return url;
  };
}).filter("booleanText", function() {
  return function(bool, trueText, falseText) {
    if (bool) {
      return trueText;
    } else {
      return falseText;
    }
  };
}).filter("truncate", function() {
  return function(text, length, end) {
    if (text === undefined || (text == null)) {
      return;
    }
    if (isNaN(length)) {
      length = 10;
    }
    if (end === undefined) {
      end = "...";
    }
    if (text.length <= length || text.length - end.length <= length) {
      return text;
    } else {
      return String(text).substring(0, length - end.length) + end;
    }
  };
}).filter("momentAgo", function() {
  return function(datetime, format) {
    if (datetime) {
      if (format) {
        return moment(datetime, format).fromNow();
      } else {
        return moment(datetime, "YYYYMMDDThhmmssZ").fromNow();
      }
    }
  };
}).filter("tel", function() {
  return function(tel) {
    var city, country, number, value;

    if (!tel) {
      return "";
    }
    value = tel.toString().trim().replace(/^\+/, "");
    if (value.match(/[^0-9]/)) {
      return tel;
    }
    country = void 0;
    city = void 0;
    number = void 0;
    switch (value.length) {
      case 10:
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;
      case 11:
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;
      case 12:
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;
      default:
        return tel;
    }
    if (country === 1) {
      country = "";
    }
    number = number.slice(0, 3) + "-" + number.slice(3);
    return (country + " (" + city + ") " + number).trim();
  };
}).filter("fileExtFromMime", function() {
  return function(input) {
    var correctType, mimeValue, output, useMimeOnly;

    output = '';
    if (input) {
      if (_.isString(input)) {
        output = input.split('/');
      } else if (_.isObject(input)) {
        useMimeOnly = input.type === 'file_asset' ? true : false;
        mimeValue = input.mimetype || input.mime_type;
        correctType = useMimeOnly ? mimeValue : input.type || mimeValue;
        output = (correctType || '').split('/');
      }
      if (output.length > 1) {
        return output[1];
      } else {
        return output[0];
      }
    }
    return output;
  };
}).filter("shorten", function() {
  return function(input, length, parameters) {
    var ellipsis, split;

    if (_.isNothing(input) || _.isNull(input)) {
      return '';
    }
    input = input.toString();
    if (!parameters) {
      parameters = {};
    }
    ellipsis = "&hellip;";
    if (parameters.mode === "truncate") {
      return input = input.substr(0, length) + ellipsis;
    } else {
      if (input.length >= length) {
        split = Math.ceil(length / 2);
        return input = input.substr(0, split) + ellipsis + input.substr(input.length - split);
      } else {
        return input;
      }
    }
  };
}).filter("breakToBr", function() {
  return function(input) {
    if (_.isNothing(input) || _.isNull(input)) {
      return '';
    }
    return input.replace(/\n/g, '<br/>').replace(/\r/g, '<br/><br/>');
  };
}).filter("breakToSpan", function() {
  return function(input) {
    if (_.isNothing(input) || _.isNull(input)) {
      return '';
    }
    return input.replace(/\n/g, '<span class="br"></span>').replace(/\r/g, '<span class="br"></span><span class="br"></span>');
  };
});
