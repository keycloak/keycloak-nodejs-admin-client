"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var Resource = (function () {
    function Resource(agent, basePath) {
        if (basePath === void 0) { basePath = ''; }
        var _this = this;
        this.makeRequest = function (args) {
            return _this.agent.request(__assign({ basePath: _this.basePath }, args));
        };
        this.makeUpdateRequest = function (args) {
            return _this.agent.updateRequest(__assign({ basePath: _this.basePath }, args));
        };
        this.agent = agent;
        this.basePath = basePath;
    }
    return Resource;
}());
exports["default"] = Resource;
//# sourceMappingURL=resource.js.map