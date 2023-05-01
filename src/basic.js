angular
    .module('basic', [])
    .filter('ucFirst', function () {
        "use strict";
        return function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
    })
    .filter('lcFirst', function () {
        "use strict";
        return function (string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        };
    })
    .filter('parseInt', function () {
        "use strict";
        return function (string) {
            return parseInt(string);
        };
    })
    .filter('escape', function () {
        "use strict";
        return window.escape;
    })
    .filter('trim', function () {
        "use strict";
        return function (string) {
            return string.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
    })
    .factory('convert', function () {
        "use strict";
        return {
            toArray: function (object, withKeys) {
                var key,
                    list = [];
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        if (withKeys || false) {
                            list[key] = object[key];
                        } else {
                            list.push(object[key]);
                        }
                    }
                }
                return list;
            }
        };
    })
    .factory('string', function () {
        "use strict";
        return {
            lastPosition: function (string, element, offset) {
                var i, lastPosition = string.lastIndexOf(element);
                for (i = 0; i < offset || 0; i++) {
                    lastPosition = string.lastIndexOf(element, lastPosition - 1);
                }
                return lastPosition;
            }
        };
    })
    .factory('array', function () {
        "use strict";
        return {
            in: function (needle, haystack) {
                var i, length = haystack.length;
                for (i = 0; i < length; i++) {
                    if (haystack[i] === needle) {
                        return true;
                    }
                }
                return false;
            }
        };
    })
    .factory('url', function ($location, string) {
        "use strict";
        return {
            parse: function (url) {
                var parser = document.createElement('a'),
                    queryObject = {},
                    queries,
                    split,
                    i;
                parser.href = url || $location.absUrl();
                queries = parser.search.replace(/^\?/, '').split('&');
                for (i = 0; i < queries.length; i++) {
                    split = queries[i].split('=');
                    queryObject[split[0]] = split[1];
                }
                return {
                    url: parser.href,
                    protocol: parser.protocol,
                    host: parser.host,
                    port: parser.port,
                    path: parser.pathname,
                    query: parser.search,
                    hash: parser.hash,
                    queryObject: queryObject
                };
            },
            requestMethod: function (method, offset, full) {
                var offset = offset || 0,
                    path = this.parse().path,
                    resultPath = full || false ? this.parse().path + this.parse().query : path,
                    lastNode = string.lastPosition(path, '/', offset),
                    lastMethod = string.lastPosition(path, '.', offset);
                return resultPath.replace(resultPath.substring(lastMethod + 1, lastNode), method);
            }
        };
    })
    .factory('element', function () {
        "use strict";
        return {
            getByName: function (name, tag, context) {
                var allElements = (context || document).getElementsByTagName(tag || '*'),
                    allElementsLen = allElements.length,
                    curElement,
                    i,
                    results = [];
                for (i = 0; i < allElementsLen; i += 1) {
                    curElement = allElements[i];
                    if (curElement.name === name) {
                        results.push(curElement);
                    }
                }
                return results;
            }
        };
    })
    .factory('value', function () {
        "use strict";
        return {
            get: function (object, key) {
                var _data = {};
                if (angular.isUndefined(object[key])) {
                    if (key.indexOf('.')) {
                        var _object = object;
                        angular.forEach(key.split('.'), function (attr) {
                            if (angular.isDefined(_object) && angular.isDefined(_object[attr])) {
                                _object = _object[attr];
                            } else {
                                _object = undefined;
                            }
                        });
                        _data = _object;
                    }
                } else {
                    _data = object[key];
                }
                return _data;
            },
            set: function (object, key, value) {
                var keyList = key.split('.');
                if (keyList.length < 2) {
                    object[keyList[0]] = value;
                } else {
                    this.set(object[keyList.shift()], keyList.join("."), value);
                }
            }
        };
    })
    .factory('core', function (convert) {
        "use strict";
        return {
            zeroPad: function (i) {
                //noinspection ConditionalExpressionJS,ConstantOnRightSideOfComparisonJS
                return i < 10 ? '0' + i : i;
            },
            tag: function (tag, text) {
                if (angular.isUndefined(text)) {
                    text = '';
                }
                return '<' + tag + '>' + text + '</' + tag + '>';
            },
            intersect: function (a, b) {
                var bi;
                var ai;
                var result = [];
                if (angular.isObject(a)) {
                    a = convert.toArray(a);
                }
                if (angular.isObject(b)) {
                    b = convert.toArray(b);
                }
                for (ai = 0; ai < a.length; ai++) {
                    for (bi = 0; bi < b.length; bi++) {
                        if (a[ai] === b[bi]) {
                            result.push(a[ai]);
                        }
                    }
                }
                return result;
            }
        };
    });
