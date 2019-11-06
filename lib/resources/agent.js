"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var url_join_1 = __importDefault(require("url-join"));
var url_template_1 = __importDefault(require("url-template"));
var lodash_1 = require("lodash");
var SLASH = '/';
var Agent = (function () {
    function Agent(_a) {
        var _b = _a.getUrlParams, getUrlParams = _b === void 0 ? function () { return ({}); } : _b, _c = _a.getBaseUrl, getBaseUrl = _c === void 0 ? function (client) { return client.baseUrl; } : _c, axios = _a.axios;
        this.getBaseParams = getUrlParams;
        this.getBaseUrl = getBaseUrl;
        this.axios = axios;
    }
    Agent.prototype.setClient = function (client) {
        this.client = client;
    };
    Agent.prototype.getRequestConfig = function () {
        if (this.client && this.client.getRequestConfig()) {
            return this.client.getRequestConfig();
        }
        return {};
    };
    Agent.prototype.request = function (_a) {
        var _this = this;
        var method = _a.method, _b = _a.basePath, basePath = _b === void 0 ? '' : _b, _c = _a.path, path = _c === void 0 ? '' : _c, _d = _a.urlParamKeys, urlParamKeys = _d === void 0 ? [] : _d, _e = _a.queryParamKeys, queryParamKeys = _e === void 0 ? [] : _e, _f = _a.catchNotFound, catchNotFound = _f === void 0 ? false : _f, keyTransform = _a.keyTransform, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return function (payload) {
            if (payload === void 0) { payload = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var baseParams, queryParams, allUrlParamKeys, urlParams;
                return __generator(this, function (_a) {
                    baseParams = this.getBaseParams(this.client);
                    queryParams = queryParamKeys ? lodash_1.pick(payload, queryParamKeys) : null;
                    allUrlParamKeys = Object.keys(baseParams).concat(urlParamKeys);
                    urlParams = __assign({}, baseParams, lodash_1.pick(payload, allUrlParamKeys));
                    payload = lodash_1.omit(payload, allUrlParamKeys.concat(queryParamKeys));
                    if (keyTransform) {
                        this.transformKey(payload, keyTransform);
                        this.transformKey(queryParams, keyTransform);
                    }
                    return [2, this.requestWithParams({
                            method: method,
                            basePath: basePath,
                            path: path,
                            payload: payload,
                            urlParams: urlParams,
                            queryParams: queryParams,
                            catchNotFound: catchNotFound,
                            payloadKey: payloadKey,
                            returnResourceIdInLocationHeader: returnResourceIdInLocationHeader
                        })];
                });
            });
        };
    };
    Agent.prototype.updateRequest = function (_a) {
        var _this = this;
        var method = _a.method, _b = _a.basePath, basePath = _b === void 0 ? '' : _b, _c = _a.path, path = _c === void 0 ? '' : _c, _d = _a.urlParamKeys, urlParamKeys = _d === void 0 ? [] : _d, _e = _a.queryParamKeys, queryParamKeys = _e === void 0 ? [] : _e, _f = _a.catchNotFound, catchNotFound = _f === void 0 ? false : _f, keyTransform = _a.keyTransform, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return function (query, payload) {
            if (query === void 0) { query = {}; }
            if (payload === void 0) { payload = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var baseParams, queryParams, allUrlParamKeys, urlParams;
                return __generator(this, function (_a) {
                    baseParams = this.getBaseParams(this.client);
                    queryParams = queryParamKeys ? lodash_1.pick(query, queryParamKeys) : null;
                    allUrlParamKeys = Object.keys(baseParams).concat(urlParamKeys);
                    urlParams = __assign({}, baseParams, lodash_1.pick(query, allUrlParamKeys));
                    if (keyTransform) {
                        this.transformKey(queryParams, keyTransform);
                    }
                    return [2, this.requestWithParams({
                            method: method,
                            basePath: basePath,
                            path: path,
                            payload: payload,
                            urlParams: urlParams,
                            queryParams: queryParams,
                            catchNotFound: catchNotFound,
                            payloadKey: payloadKey,
                            returnResourceIdInLocationHeader: returnResourceIdInLocationHeader
                        })];
                });
            });
        };
    };
    Agent.prototype.requestWithParams = function (_a) {
        var method = _a.method, basePath = _a.basePath, path = _a.path, payload = _a.payload, urlParams = _a.urlParams, queryParams = _a.queryParams, catchNotFound = _a.catchNotFound, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return __awaiter(this, void 0, void 0, function () {
            var _b, newPath, pathTemplate, parsedPath, url, requestConfig, res, locationHeader, resourceId, field, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        newPath = url_join_1["default"](basePath, path);
                        pathTemplate = url_template_1["default"].parse(newPath);
                        parsedPath = pathTemplate.expand(urlParams);
                        url = "" + this.getBaseUrl(this.client) + parsedPath;
                        requestConfig = __assign({}, this.getRequestConfig(), { method: method,
                            url: url, headers: {
                                Authorization: "bearer " + this.client.getAccessToken()
                            } });
                        if (method === 'GET') {
                            requestConfig.params = payload;
                        }
                        else {
                            requestConfig.data = payloadKey ? payload[payloadKey] : payload;
                        }
                        if (queryParams) {
                            requestConfig.params = requestConfig.params
                                ? __assign({}, requestConfig.params, queryParams) : queryParams;
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4, this.axios(requestConfig)];
                    case 2:
                        res = _c.sent();
                        if (returnResourceIdInLocationHeader) {
                            locationHeader = res.headers.location;
                            if (!locationHeader) {
                                throw new Error("location header is not found in request: " + res.config.url);
                            }
                            resourceId = lodash_1.last(locationHeader.split(SLASH));
                            if (!resourceId) {
                                throw new Error("resourceId is not found in Location header from request: " + res.config.url);
                            }
                            field = returnResourceIdInLocationHeader.field;
                            return [2, (_b = {}, _b[field] = resourceId, _b)];
                        }
                        return [2, res.data];
                    case 3:
                        err_1 = _c.sent();
                        if (err_1.response && err_1.response.status === 404 && catchNotFound) {
                            return [2, null];
                        }
                        throw err_1;
                    case 4: return [2];
                }
            });
        });
    };
    Agent.prototype.transformKey = function (payload, keyMapping) {
        if (!payload) {
            return;
        }
        Object.keys(keyMapping).some(function (key) {
            if (lodash_1.isUndefined(payload[key])) {
                return false;
            }
            var newKey = keyMapping[key];
            payload[newKey] = payload[key];
            delete payload[key];
        });
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map