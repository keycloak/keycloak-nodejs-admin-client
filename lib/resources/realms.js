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
var Realms = (function (_super) {
    __extends(Realms, _super);
    function Realms(agent, basePath) {
        if (basePath === void 0) { basePath = '/admin/realms'; }
        var _this = _super.call(this, agent, basePath) || this;
        _this.find = _this.makeRequest({
            method: 'GET'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            returnResourceIdInLocationHeader: { field: 'realmName' }
        });
        _this.findOne = _this.makeRequest({
            method: 'GET',
            path: '/{realm}',
            urlParamKeys: ['realm'],
            catchNotFound: true
        });
        _this.update = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{realm}',
            urlParamKeys: ['realm']
        });
        _this.del = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}',
            urlParamKeys: ['realm']
        });
        _this.findEvents = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/events',
            urlParamKeys: ['realm'],
            queryParamKeys: [
                'client',
                'dateFrom',
                'dateTo',
                'first',
                'ipAddress',
                'max',
                'type',
                'user',
            ]
        });
        return _this;
    }
    return Realms;
}(resource_1["default"]));
exports.Realms = Realms;
//# sourceMappingURL=realms.js.map