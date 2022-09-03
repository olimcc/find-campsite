"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
exports.getCampsites = exports.getCampground = void 0;
var luxon_1 = require("luxon");
var requests_1 = require("../../requests");
var API_ENDPOINT = 'https://calirdr.usedirect.com/rdr/rdr/search/grid';
var API_DATE_FORMAT = 'M-d-yyyy';
var Campground = /** @class */ (function () {
    function Campground(data) {
        this.data = data;
    }
    Campground.prototype.getName = function () {
        return this.data.Name;
    };
    return Campground;
}());
function getCampground(campgroundId) {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        FacilityId: Number.parseInt(campgroundId),
                        StartDate: '7-1-2020',
                        EndDate: '7-2-2020'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, requests_1.makePostRequest(API_ENDPOINT, request)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data.Facility ? new Campground(response.data.Facility) : null];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getCampground = getCampground;
var Campsite = /** @class */ (function () {
    function Campsite(data) {
        this.data = data;
    }
    Campsite.prototype.getAvailableDates = function () {
        return Object.entries(this.data.Slices).map(function (_a) {
            var date = _a[0], value = _a[1];
            return {
                date: luxon_1.DateTime.fromISO(date),
                isAvailable: value.IsFree
            };
        });
    };
    Campsite.prototype.getName = function () {
        return "" + this.data.Name;
    };
    Campsite.prototype.getUrl = function () {
        return "https://www.reservecalifornia.com/CaliforniaWebHome/";
    };
    return Campsite;
}());
function getCampsites(campgroundId, monthsToCheck) {
    return __awaiter(this, void 0, void 0, function () {
        var start, end, request, response, attempt, attempts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = luxon_1.DateTime.local().startOf('day');
                    end = start.plus({ months: monthsToCheck });
                    request = {
                        FacilityId: campgroundId,
                        StartDate: start.toFormat(API_DATE_FORMAT),
                        EndDate: end.toFormat(API_DATE_FORMAT)
                    };
                    attempt = 0;
                    attempts = 4;
                    _a.label = 1;
                case 1:
                    if (!(attempt < attempts)) return [3 /*break*/, 3];
                    return [4 /*yield*/, requests_1.makePostRequest(API_ENDPOINT, request)];
                case 2:
                    response = _a.sent();
                    if ((response.data && response.data.Message.startsWith('Invalid')) || response.status != 200) {
                        attempt += 1;
                    }
                    else {
                        return [2 /*return*/, Object.values(response.data.Facility.Units).map(function (data) { return new Campsite(data); })];
                    }
                    return [3 /*break*/, 1];
                case 3: throw "getCampsites fetch error:\n" + response;
            }
        });
    });
}
exports.getCampsites = getCampsites;
