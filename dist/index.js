#!/usr/bin/env node
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
var luxon_1 = require("luxon");
var RecreationGov = require("./apis/recreation_gov/recreation_gov");
var ReserveCA = require("./apis/reserve_ca/reserve_california");
function matchAvailableDateRanges(availabilities, startDayOfWeek, lengthOfStay) {
    var sortedAvailabilities = availabilities.sort(function (a, b) { return a.date.diff(b.date).as('days'); });
    var result = [];
    var sequenceStart = null;
    var sequenceLength = 0;
    sortedAvailabilities.forEach(function (availability) {
        if (sequenceStart) {
            if (sequenceLength === lengthOfStay) {
                var sequenceEnd = availability.date;
                result.push({ start: sequenceStart, end: sequenceEnd });
                sequenceStart = null;
                sequenceLength = 0;
            }
            else if (availability.isAvailable && sequenceLength < lengthOfStay) {
                sequenceLength += 1;
            }
            else {
                sequenceStart = null;
                sequenceLength = 0;
            }
        }
        else if (availability.date.weekday === startDayOfWeek && availability.isAvailable) {
            sequenceStart = availability.date;
            sequenceLength += 1;
        }
    });
    return result;
}
function makeAvailabilityKey(availability) {
    var start = availability.start, end = availability.end;
    var startFmt = start.toLocaleString(luxon_1.DateTime.DATE_SHORT);
    var endFmt = end.toLocaleString(luxon_1.DateTime.DATE_SHORT);
    return startFmt + " to " + endFmt;
}
function consolidateItineraries(matches) {
    var result = {};
    matches.forEach(function (match) {
        match.matchingRanges.forEach(function (availability) {
            var key = makeAvailabilityKey(availability);
            if (!result[key]) {
                result[key] = {
                    range: availability,
                    campsites: []
                };
            }
            result[key].campsites.push(match.site);
        });
    });
    return Object.values(result).sort(function (a, b) { return a.range.start.diff(b.range.end).as('days'); });
}
function formatRange(start, end) {
    var startFmt = start.toLocaleString(luxon_1.DateTime.DATE_SHORT);
    var endFmt = end.toLocaleString(luxon_1.DateTime.DATE_SHORT);
    return startFmt + " to " + endFmt;
}
function doTheThing(api, campgroundId, startDayOfWeek, lengthOfStay, monthsToCheck, machine) {
    if (machine === void 0) { machine = false; }
    return __awaiter(this, void 0, void 0, function () {
        var campground, campsites, matches, regrouped, length;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getCampground(campgroundId)];
                case 1:
                    campground = _a.sent();
                    if (!campground) {
                        throw new Error("No campground with id " + campgroundId);
                    }
                    if (!machine) {
                        console.log("Checking for sites at " + campground.getName() + " available on a " + weekdayToDay(startDayOfWeek) + " for " + lengthOfStay + " " + (lengthOfStay === 1 ? 'night' : 'nights') + ".");
                        console.log();
                    }
                    return [4 /*yield*/, api.getCampsites(campgroundId, monthsToCheck)];
                case 2:
                    campsites = _a.sent();
                    matches = campsites
                        .map(function (site) {
                        var availabilities = site.getAvailableDates();
                        var matchingRanges = matchAvailableDateRanges(availabilities, startDayOfWeek, lengthOfStay);
                        return { site: site, matchingRanges: matchingRanges };
                    })
                        .filter(function (site) { return site.matchingRanges.length > 0; });
                    regrouped = consolidateItineraries(matches);
                    if (machine) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                resolve({
                                    campground: campground,
                                    availability: regrouped
                                });
                            })];
                    }
                    if (regrouped.length > 0) {
                        length = regrouped.length;
                        console.log("Found " + length + " matching " + (length === 1 ? 'itinerary' : 'itineraries') + ":");
                        console.log();
                        regrouped.forEach(function (_a) {
                            var range = _a.range, campsites = _a.campsites;
                            var start = range.start, end = range.end;
                            var diff = Math.round(start.diffNow('week').as('weeks'));
                            console.log(formatRange(start, end) + " (in " + diff + " " + (diff === 1 ? 'week' : 'weeks') + "):");
                            campsites.forEach(function (site) {
                                console.log("- " + site.getName() + " " + site.getUrl());
                            });
                        });
                    }
                    else {
                        console.log('No sites found for the given constraints :(');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var APIChoice;
(function (APIChoice) {
    APIChoice["RecreationGov"] = "recreation_gov";
    APIChoice["ReserveCA"] = "reserve_ca";
})(APIChoice || (APIChoice = {}));
function pickAPI(choice) {
    return choice === APIChoice.RecreationGov ? RecreationGov : ReserveCA;
}
function main(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var api, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    api = pickAPI(argv.api);
                    return [4 /*yield*/, doTheThing(api, argv.campground, dayToWeekday(argv.day), argv.nights, argv.months, argv.machine)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function dayToWeekday(day) {
    return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(day) + 1;
}
function weekdayToDay(weekday) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][weekday - 1];
}
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var argv = require('yargs')
        .alias('h', 'help')
        .option('api', {
        type: 'string',
        choices: ['recreation_gov', 'reserve_ca'],
        "default": 'recreation_gov',
        description: 'Which reservation API to search'
    })
        .option('campground', {
        alias: 'c',
        type: 'number',
        description: "Campground's identifier",
        required: true
    })
        .option('day', {
        alias: 'd',
        type: 'string',
        choices: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        "default": 'fri',
        description: 'Day of week to start on'
    })
        .option('nights', {
        alias: 'n',
        type: 'number',
        "default": 2
    })
        .option('months', {
        type: 'number',
        "default": 6,
        description: 'Number of months to check'
    })
        .option('machine', {
        type: 'bool',
        "default": false,
        description: 'For machine consumption'
    }).argv;
    main(argv);
}
exports.main = main;
