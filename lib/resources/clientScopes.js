"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var resource_1 = __importDefault(require("./resource"));
var ClientScopes = (function (_super) {
    __extends(ClientScopes, _super);
    function ClientScopes(agent, basePath) {
        if (basePath === void 0) { basePath = '/admin/realms/{realm}'; }
        var _this = _super.call(this, agent, basePath) || this;
        _this.find = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            path: '/client-scopes'
        });
        _this.findOne = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}',
            urlParamKeys: ['id'],
            catchNotFound: true
        });
        _this.update = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.del = _this.makeRequest({
            method: 'DELETE',
            path: '/client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.listDefaultClientScopes = _this.makeRequest({
            method: 'GET',
            path: '/default-default-client-scopes'
        });
        _this.addDefaultClientScope = _this.makeRequest({
            method: 'PUT',
            path: '/default-default-client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.delDefaultClientScope = _this.makeRequest({
            method: 'DELETE',
            path: '/default-default-client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.listDefaultOptionalClientScopes = _this.makeRequest({
            method: 'GET',
            path: '/default-optional-client-scopes'
        });
        _this.addDefaultOptionalClientScope = _this.makeRequest({
            method: 'PUT',
            path: '/default-optional-client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.delDefaultOptionalClientScope = _this.makeRequest({
            method: 'DELETE',
            path: '/default-optional-client-scopes/{id}',
            urlParamKeys: ['id']
        });
        _this.addMultipleProtocolMappers = _this.makeUpdateRequest({
            method: 'POST',
            path: '/client-scopes/{id}/protocol-mappers/add-models',
            urlParamKeys: ['id']
        });
        _this.addProtocolMapper = _this.makeUpdateRequest({
            method: 'POST',
            path: '/client-scopes/{id}/protocol-mappers/models',
            urlParamKeys: ['id']
        });
        _this.listProtocolMappers = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/protocol-mappers/models',
            urlParamKeys: ['id']
        });
        _this.findProtocolMapper = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId'],
            catchNotFound: true
        });
        _this.findProtocolMappersByProtocol = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/protocol-mappers/protocol/{protocol}',
            urlParamKeys: ['id', 'protocol'],
            catchNotFound: true
        });
        _this.updateProtocolMapper = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId']
        });
        _this.delProtocolMapper = _this.makeRequest({
            method: 'DELETE',
            path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId']
        });
        _this.listScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings',
            urlParamKeys: ['id']
        });
        _this.addClientScopeMappings = _this.makeUpdateRequest({
            method: 'POST',
            path: '/client-scopes/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.listClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.listAvailableClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/clients/{client}/available',
            urlParamKeys: ['id', 'client']
        });
        _this.listCompositeClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/clients/{client}/available',
            urlParamKeys: ['id', 'client']
        });
        _this.delClientScopeMappings = _this.makeUpdateRequest({
            method: 'DELETE',
            path: '/client-scopes/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.addRealmScopeMappings = _this.makeUpdateRequest({
            method: 'POST',
            path: '/client-scopes/{id}/scope-mappings/realm',
            urlParamKeys: ['id']
        });
        _this.listRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/realm',
            urlParamKeys: ['id']
        });
        _this.listAvailableRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/realm/available',
            urlParamKeys: ['id']
        });
        _this.listCompositeRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/client-scopes/{id}/scope-mappings/realm/available',
            urlParamKeys: ['id']
        });
        _this.delRealmScopeMappings = _this.makeUpdateRequest({
            method: 'DELETE',
            path: '/client-scopes/{id}/scope-mappings/realm',
            urlParamKeys: ['id']
        });
        return _this;
    }
    ClientScopes.prototype.findOneByName = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var allScopes, scope;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.find(__assign({}, (payload.realm ? { realm: payload.realm } : {})))];
                    case 1:
                        allScopes = _a.sent();
                        scope = allScopes.find(function (item) { return item.name === payload.name; });
                        return [2, scope ? scope : null];
                }
            });
        });
    };
    ClientScopes.prototype.delByName = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var scope;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.findOneByName(payload)];
                    case 1:
                        scope = _a.sent();
                        if (!scope) {
                            throw new Error('Scope not found.');
                        }
                        return [4, this.del(__assign({}, (payload.realm ? { realm: payload.realm } : {}), { id: scope.id }))];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ClientScopes.prototype.findProtocolMapperByName = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var allProtocolMappers, protocolMapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.listProtocolMappers(__assign({ id: payload.id }, (payload.realm ? { realm: payload.realm } : {})))];
                    case 1:
                        allProtocolMappers = _a.sent();
                        protocolMapper = allProtocolMappers.find(function (mapper) { return mapper.name === payload.name; });
                        return [2, protocolMapper ? protocolMapper : null];
                }
            });
        });
    };
    return ClientScopes;
}(resource_1["default"]));
exports.ClientScopes = ClientScopes;
//# sourceMappingURL=clientScopes.js.map