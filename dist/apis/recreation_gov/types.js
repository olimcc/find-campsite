"use strict";
exports.__esModule = true;
exports.TypeOfUse = exports.CapacityRating = exports.CampsiteType = exports.CampsiteReserveType = exports.CampsiteAvailability = void 0;
var CampsiteAvailability;
(function (CampsiteAvailability) {
    CampsiteAvailability["Available"] = "Available";
    CampsiteAvailability["NotAvailable"] = "Not Available";
    CampsiteAvailability["NotReservable"] = "Not Reservable";
    CampsiteAvailability["NotReservableManagement"] = "Not Reservable Management";
    CampsiteAvailability["Reserved"] = "Reserved";
})(CampsiteAvailability = exports.CampsiteAvailability || (exports.CampsiteAvailability = {}));
var CampsiteReserveType;
(function (CampsiteReserveType) {
    CampsiteReserveType["SiteSpecific"] = "Site-Specific";
})(CampsiteReserveType = exports.CampsiteReserveType || (exports.CampsiteReserveType = {}));
var CampsiteType;
(function (CampsiteType) {
    CampsiteType["GroupStandardNonelectric"] = "GROUP STANDARD NONELECTRIC";
    CampsiteType["Management"] = "MANAGEMENT";
    CampsiteType["StandardNonelectric"] = "STANDARD NONELECTRIC";
    CampsiteType["TentOnlyNonelectric"] = "TENT ONLY NONELECTRIC";
    CampsiteType["WalkTo"] = "WALK TO";
})(CampsiteType = exports.CampsiteType || (exports.CampsiteType = {}));
var CapacityRating;
(function (CapacityRating) {
    CapacityRating["Double"] = "Double";
    CapacityRating["Empty"] = "";
    CapacityRating["Group"] = "Group";
    CapacityRating["Single"] = "Single";
})(CapacityRating = exports.CapacityRating || (exports.CapacityRating = {}));
var TypeOfUse;
(function (TypeOfUse) {
    TypeOfUse["Overnight"] = "Overnight";
})(TypeOfUse = exports.TypeOfUse || (exports.TypeOfUse = {}));
