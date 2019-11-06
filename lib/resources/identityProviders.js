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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var resource_1 = __importDefault(require("./resource"));
var IdentityProviders = (function (_super) {
    __extends(IdentityProviders, _super);
    function IdentityProviders(agent, basePath) {
        if (basePath === void 0) { basePath = '/admin/realms/{realm}/identity-provider'; }
        var _this = _super.call(this, agent, basePath) || this;
        _this.find = _this.makeRequest({
            method: 'GET',
            path: '/instances'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            path: '/instances',
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.findOne = _this.makeRequest({
            method: 'GET',
            path: '/instances/{alias}',
            urlParamKeys: ['alias'],
            catchNotFound: true
        });
        _this.update = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/instances/{alias}',
            urlParamKeys: ['alias']
        });
        _this.del = _this.makeRequest({
            method: 'DELETE',
            path: '/instances/{alias}',
            urlParamKeys: ['alias']
        });
        _this.findFactory = _this.makeRequest({
            method: 'GET',
            path: '/providers/{providerId}',
            urlParamKeys: ['providerId']
        });
        _this.findMappers = _this.makeRequest({
            method: 'GET',
            path: '/instances/{alias}/mappers',
            urlParamKeys: ['alias']
        });
        _this.findOneMapper = _this.makeRequest({
            method: 'GET',
            path: '/instances/{alias}/mappers/{id}',
            urlParamKeys: ['alias', 'id'],
            catchNotFound: true
        });
        _this.createMapper = _this.makeRequest({
            method: 'POST',
            path: '/instances/{alias}/mappers',
            urlParamKeys: ['alias'],
            payloadKey: 'identityProviderMapper',
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.updateMapper = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/instances/{alias}/mappers/{id}',
            urlParamKeys: ['alias', 'id']
        });
        _this.delMapper = _this.makeRequest({
            method: 'DELETE',
            path: '/instances/{alias}/mappers/{id}',
            urlParamKeys: ['alias', 'id']
        });
        _this.findMapperTypes = _this.makeRequest({
            method: 'GET',
            path: '/instances/{alias}/mapper-types',
            urlParamKeys: ['alias']
        });
        return _this;
    }
    return IdentityProviders;
}(resource_1["default"]));
exports.IdentityProviders = IdentityProviders;
//# sourceMappingURL=identityProviders.js.map