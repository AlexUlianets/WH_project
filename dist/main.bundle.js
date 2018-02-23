webpackJsonp([1],{

/***/ "../../../../../src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../../../../../src async recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#lmap {\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n.color-wrap {\r\n  position: absolute;\r\n  bottom: 10px;\r\n  z-index: 10000;\r\n  right: 12px;\r\n}\r\n.color-item, .deg-box {\r\n  text-align: center;\r\n  vertical-align: middle;\r\n  line-height: 30px;\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n.deg-box {\r\n  background-color: #fff;\r\n  color: #000;\r\n}\r\n#cursor-dialog-box {\r\n  display:none;\r\n  z-index: 100000;\r\n  position: absolute;\r\n  width: 50px;\r\n  height: 30px;\r\n  background-color: #fff;\r\n  color: #000;\r\n  text-align: center;\r\n  vertical-align: middle;\r\n  line-height: 30px;\r\n  border-radius: 12px;\r\n}\r\n.loading {\r\n  position: absolute;\r\n  left: 0;\r\n  right: 0;\r\n  margin-left: auto;\r\n  margin-right: auto;\r\n  bottom: 50%;\r\n  width: 120px;\r\n  height: 40px;\r\n  line-height: 40px;\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n  border-radius: 2px;\r\n  color: #fff;\r\n  font-size: 18px;\r\n  text-align: center;\r\n  z-index: 10000;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div wth-cursor-dialog id=\"lmap\"></div>\r\n<div id=\"cursor-dialog-box\">{{mouseTemperature}} &deg;C</div>\r\n\r\n<div *ngIf=\"loadingStatus\" class=\"loading\">Loading...</div>\r\n\r\n<div class=\"color-wrap\">\r\n  <div class=\"deg-box\">&deg;C</div>\r\n  <div class=\"color-box\" *ngFor=\"let colorItem of colorList.reverse();\">\r\n    <div class=\"color-item\" [ngStyle]=\"{'background-color': colorItem.backColor, 'color': colorItem.textColor}\" >{{colorItem.tempValue}}</div>\r\n  </div>\r\n</div>\r\n<canvas style=\"display: none\" id=\"temp-image\"></canvas>\r\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_leaflet__ = __webpack_require__("../../../../leaflet/dist/leaflet-src.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_leaflet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__("../../../../jquery/dist/jquery.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_color_service__ = __webpack_require__("../../../../../src/app/services/color.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(colorService) {
        this.colorService = colorService;
        this.defaultLat = 52.242111;
        this.defaultLng = 21.024092;
        this.maxZoom = 8;
        this.minZoom = 3;
        this.defaultZoom = 3;
        this.currentZoom = this.defaultZoom;
        this.canvasWidth = 256;
        this.canvasHeight = 256;
        this.refPoints = {};
        this.screenOffsetX = 0;
        this.screenOffsetY = 0;
        this.colorList = [];
        this.colorCache = {};
        this.distanceCache = {};
        this.tilesForColorize = [];
        this.indexCache = {};
        this.zoomed = false;
        this.shouldBeLoaded = 0;
        this.loadingStatus = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.colorList = this.colorService.getColorList();
        var southWest = __WEBPACK_IMPORTED_MODULE_1_leaflet__["latLng"](-84, -180), northEast = __WEBPACK_IMPORTED_MODULE_1_leaflet__["latLng"](84, 180);
        var bounds = __WEBPACK_IMPORTED_MODULE_1_leaflet__["latLngBounds"](southWest, northEast);
        this.map = __WEBPACK_IMPORTED_MODULE_1_leaflet__["map"]('lmap', {
            zoomControl: true,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0
        });
        this.map.zoomControl.setPosition('topleft');
        var CanvasLayer = __WEBPACK_IMPORTED_MODULE_1_leaflet__["GridLayer"].extend({
            createTile: function (coords) {
                var tile = __WEBPACK_IMPORTED_MODULE_1_leaflet__["DomUtil"].create('canvas', 'leaflet-tile');
                tile.width = 256;
                tile.height = 256;
                return tile;
            }
        });
        var tileLayer = __WEBPACK_IMPORTED_MODULE_1_leaflet__["tileLayer"]('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
        });
        tileLayer.addTo(this.map);
        this.map.setView([this.defaultLat, this.defaultLng], this.defaultZoom);
        var zoomConfigs = {};
        zoomConfigs[3] = { zoom: 3, step: 4, pow: 1 };
        zoomConfigs[4] = { zoom: 4, step: 4, pow: 1 };
        zoomConfigs[5] = { zoom: 5, step: 8, pow: 1 };
        zoomConfigs[6] = { zoom: 6, step: 8, pow: 1 };
        zoomConfigs[7] = { zoom: 7, step: 16, pow: 1 };
        zoomConfigs[8] = { zoom: 8, step: 16, pow: 1 };
        var canvasTiles = new CanvasLayer();
        var config = zoomConfigs[this.map.getZoom()];
        this.step = config.step;
        this.dbl = this.step * 2;
        this.p = config.pow;
        this.map.addLayer(canvasTiles);
        this.tiles = canvasTiles._tiles;
        var img = new Image();
        img.src = 'assets/images/matrix.png';
        img.setAttribute('crossOrigin', '');
        img.onload = function () {
            var self = _this;
            var imageCanvas = document.getElementById('temp-image');
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            var imageContext = imageCanvas.getContext('2d');
            imageContext.drawImage(img, 0, 0);
            var imageData = imageContext.getImageData(0, 0, img.width, img.height);
            _this.refPoints = _this.getRefPoints(imageData);
            _this.distanceCache = _this.updateDistanceCache();
            _this.indexCache = _this.updateIndexCache();
            _this.colorizeTiles();
            _this.map.on('zoomstart', function () {
                self.zoomed = true;
                __WEBPACK_IMPORTED_MODULE_2_jquery__("#cursor-dialog-box").css({ top: 0, left: 0 }).hide();
            });
            _this.map.on('zoomend', function () {
                self.zoomed = false;
                this.removeLayer(canvasTiles);
                canvasTiles = new CanvasLayer();
                this.addLayer(canvasTiles);
                self.currentZoom = self.map.getZoom();
                config = zoomConfigs[self.currentZoom];
                if (self.step != config.step) {
                    self.step = config.step;
                    self.dbl = self.step * 2;
                    self.p = config.pow;
                    self.distanceCache = self.updateDistanceCache();
                }
                self.tiles = canvasTiles._tiles;
                self.refPoints = self.getRefPoints(imageData);
                self.colorizeTiles();
                self.loadingStatus = false;
            });
            // this.map.on('moveend', function () {
            //   self.tiles = canvasTiles._tiles;
            //   self.refPoints = self.getRefPoints(imageData);
            //   self.colorizeTiles();
            //   self.mapOnDragStatus = false;
            // });
            tileLayer.on("tileloadstart", function () {
                if (self.zoomed)
                    ++self.shouldBeLoaded;
            });
            tileLayer.on('tileload', function (tileEvent) {
                if (self.shouldBeLoaded > 0) {
                    self.shouldBeLoaded--;
                    return;
                }
                self.tilesForColorize.push(tileEvent.coords);
            });
            tileLayer.on('loading', function () {
                self.loadingStatus = true;
            });
            tileLayer.on('load', function (event) {
                self.tiles = canvasTiles._tiles;
                self.refPoints = self.getRefPoints(imageData);
                for (var _i = 0, _a = self.tilesForColorize; _i < _a.length; _i++) {
                    var colorizeTile = _a[_i];
                    for (var item in self.tiles) {
                        var currentTile = self.tiles[item];
                        if (currentTile.coords.x == colorizeTile.x && currentTile.coords.y == colorizeTile.y && currentTile.coords.z == colorizeTile.z) {
                            self.colorizeTile(currentTile);
                        }
                    }
                }
                self.tilesForColorize = [];
                if (!self.zoomed) {
                    self.loadingStatus = false;
                }
            });
            _this.map.on('mousemove', function (event) {
                var imageXStart = Math.floor(2 * (180 + event.latlng.lng));
                var imageYStart = Math.floor(2 * (85 - event.latlng.lat));
                var imageScope = 4 * (imageYStart * 720 + imageXStart);
                self.mouseTemperature = imageData.data[imageScope] - 150;
                __WEBPACK_IMPORTED_MODULE_2_jquery__("#cursor-dialog-box").css({ top: event.containerPoint.y + 10, left: event.containerPoint.x + 5 }).show();
            });
        };
    };
    AppComponent.prototype.colorizeTiles = function () {
        console.time('time');
        for (var item in this.tiles) {
            var currentTile = this.tiles[item];
            this.colorizeTile(currentTile);
        }
        console.timeEnd('time');
    };
    AppComponent.prototype.colorizeTile = function (tile) {
        var canvas = tile.el;
        var context = canvas.getContext('2d');
        var pixelLeftTop = canvas._leaflet_pos;
        var canvasData = context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        var color = this.colorService.temperatureToColor(0);
        var topPart = 0;
        var bottomPart = 0;
        var temperature;
        var absolutePixelX = pixelLeftTop.x + this.screenOffsetX;
        var absolutePixelY = pixelLeftTop.y + this.screenOffsetY;
        var dc;
        for (var pixelX = 0; pixelX < this.canvasWidth; ++pixelX) {
            var leftLine = ((absolutePixelX / this.step) << 0) * this.step;
            var refX = absolutePixelX - leftLine;
            dc = this.distanceCache[refX];
            for (var pixelY = 0; pixelY < this.canvasHeight; ++pixelY) {
                if (absolutePixelX % this.step != 0 || absolutePixelY % this.step != 0) {
                    var topLine = ((absolutePixelY / this.step) << 0) * this.step;
                    var currentDistances = dc[absolutePixelY - topLine];
                    if (currentDistances) {
                        topPart = 0;
                        bottomPart = 0;
                        var length2 = 36;
                        for (var index_1 = 0; index_1 < length2; ++index_1) {
                            var distance = currentDistances[index_1];
                            var ic = this.indexCache[index_1];
                            var x2 = leftLine + ic.x * this.step;
                            var y2 = topLine + ic.y * this.step;
                            var value = this.refPoints[x2][y2];
                            topPart += value / distance;
                            bottomPart += 1 / distance;
                        }
                        temperature = topPart / bottomPart;
                    }
                    // temperature = Math.ceil(temperature);
                    temperature = Math.round(temperature * 10) / 10;
                    // temperature = temperature.toFixed(1);
                    if (this.colorCache[temperature]) {
                        color = this.colorCache[temperature];
                    }
                    else {
                        color = this.colorService.temperatureToColor(temperature);
                        this.colorCache[temperature] = color;
                    }
                }
                var index = (pixelX + pixelY * this.canvasWidth) * 4;
                canvasData.data[index] = color[0];
                canvasData.data[index + 1] = color[1];
                canvasData.data[index + 2] = color[2];
                canvasData.data[index + 3] = 170;
                ++absolutePixelY;
            }
            ++absolutePixelX;
            absolutePixelY = pixelLeftTop.y + this.screenOffsetY;
        }
        context.putImageData(canvasData, 0, 0);
    };
    AppComponent.prototype.getRefPoints = function (imageData) {
        var startWorldPoint = this.map.latLngToLayerPoint(new __WEBPACK_IMPORTED_MODULE_1_leaflet__["LatLng"](85, -180));
        this.screenOffsetX = Math.abs(startWorldPoint.x);
        this.screenOffsetY = Math.abs(startWorldPoint.y);
        var leftTop = { x: 0, y: 0 };
        var rightBottom = { x: 0, y: 0 };
        for (var item in this.tiles) {
            var currentTile = this.tiles[item];
            var startTilePoint = currentTile.el._leaflet_pos;
            if (startTilePoint.x < leftTop.x) {
                leftTop.x = startTilePoint.x;
            }
            if (startTilePoint.y < leftTop.y) {
                leftTop.y = startTilePoint.y;
            }
            if (startTilePoint.x + 256 > rightBottom.x) {
                rightBottom.x = startTilePoint.x + 256;
            }
            if (startTilePoint.y + 256 > rightBottom.y) {
                rightBottom.y = startTilePoint.y + 256;
            }
        }
        var startNetX = this.screenOffsetX + leftTop.x;
        var startNetY = this.screenOffsetY + leftTop.y;
        var endNetX = this.screenOffsetX + rightBottom.x;
        var endNetY = this.screenOffsetY + rightBottom.y;
        var leftLine = ((startNetX / this.step) << 0) * this.step;
        var rightLine = ((endNetX / this.step + 1) << 0) * this.step;
        var topLine = ((startNetY / this.step) << 0) * this.step;
        var bottomLine = ((endNetY / this.step + 1) << 0) * this.step;
        var refs = {};
        var finishLineX = rightLine + 3 * this.step;
        var finishLineY = bottomLine + 3 * this.step;
        var startLineX = leftLine - 2 * this.step;
        var startLineY = topLine - 2 * this.step;
        for (var verticalLine = startLineX; verticalLine <= finishLineX; verticalLine += this.step) {
            refs[verticalLine] = {};
            for (var horizontalLine = startLineY; horizontalLine <= finishLineY; horizontalLine += this.step) {
                var pointLatLng = this.map.layerPointToLatLng({
                    x: verticalLine - this.screenOffsetX,
                    y: horizontalLine - this.screenOffsetY
                });
                var imageX = ((2 * (180 + pointLatLng.lng)) << 0);
                var imageY = ((2 * (85 - pointLatLng.lat)) << 0);
                var imageScope = 4 * (imageY * 720 + imageX);
                refs[verticalLine][horizontalLine] = imageData.data[imageScope] - 150;
            }
        }
        return refs;
    };
    AppComponent.prototype.updateDistanceCache = function () {
        var dc = {};
        // let dbl = step * 2;
        for (var i = 0; i < this.step; ++i) {
            dc[i] = {};
            for (var j = 0; j < this.step; ++j) {
                dc[i][j] = [];
                for (var refX = -2 * this.step; refX <= 3 * this.step; refX += this.step) {
                    for (var refY = -2 * this.step; refY <= 3 * this.step; refY += this.step) {
                        var dist = Math.sqrt(Math.pow(refX - i, 2) + Math.pow(refY - j, 2));
                        dist = Math.pow(dist, this.p);
                        dc[i][j].push(dist << 0);
                    }
                }
            }
        }
        return dc;
    };
    AppComponent.prototype.updateIndexCache = function () {
        var ic = {};
        for (var index = 0; index < 36; ++index) {
            var x1 = (index / 6) << 0;
            var y1 = index - x1 * 6;
            ic[index] = {};
            ic[index].x = x1 - 1;
            ic[index].y = y1 - 1;
        }
        return ic;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_1" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__services_color_service__["a" /* ColorService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_color_service__["a" /* ColorService */]) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_cursor_dialog_directive__ = __webpack_require__("../../../../../src/app/directives/cursor.dialog.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_color_service__ = __webpack_require__("../../../../../src/app/services/color.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_hsl_color_service__ = __webpack_require__("../../../../../src/app/services/hsl.color.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_4__directives_cursor_dialog_directive__["a" /* CursorDialogDirective */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* HttpModule */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_5__services_color_service__["a" /* ColorService */],
            __WEBPACK_IMPORTED_MODULE_6__services_hsl_color_service__["a" /* HsvColorService */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/directives/cursor.dialog.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__("../../../../jquery/dist/jquery.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CursorDialogDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CursorDialogDirective = (function () {
    function CursorDialogDirective(el) {
        this.el = el;
    }
    // @HostListener('mousemove', ['$event']) onMouseMoove(event: MouseEvent) {
    //   this.showDialog(true, event);
    // }
    CursorDialogDirective.prototype.onMouseLeave = function () {
        this.showDialog(false, event);
    };
    CursorDialogDirective.prototype.showDialog = function (flag, event) {
        if (flag) {
            // console.log(event.clientX, event.clientY);
            __WEBPACK_IMPORTED_MODULE_1_jquery__("#cursor-dialog-box").css({ top: event.clientY, left: event.clientX }).show();
        }
        else {
            // console.log(event.clientX, event.clientY);
            __WEBPACK_IMPORTED_MODULE_1_jquery__("#cursor-dialog-box").hide();
        }
    };
    return CursorDialogDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* HostListener */])('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CursorDialogDirective.prototype, "onMouseLeave", null);
CursorDialogDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* Directive */])({ selector: '[wth-cursor-dialog]' }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */]) === "function" && _a || Object])
], CursorDialogDirective);

var _a;
//# sourceMappingURL=cursor.dialog.directive.js.map

/***/ }),

/***/ "../../../../../src/app/services/color.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ColorService = ColorService_1 = (function () {
    function ColorService() {
        this.betweenM40andM30 = "efefef";
        this.betweenM30andM20 = "ffb1ff";
        this.betweenM20andM15 = "9a1d9a";
        this.betweenM15andM10 = "554ea6";
        this.betweenM10andM5 = "635cb7";
        this.betweenM5and0 = "4d84cb";
        this.between0and5 = "59bca0";
        this.between5and10 = "66d458";
        this.between10and15 = "c3e64d";
        this.between15and20 = "edda45";
        this.between20and25 = "ecab4d";
        this.between25and30 = "e77961";
        this.between30and40 = "c34172";
        this.between40and50 = "6b1527";
        this.between50and8 = "2b0001";
        this.colorList = [
            {
                backColor: '#efefef',
                tempValue: '-40',
                textColor: '#000',
            },
            {
                backColor: '#ffb1ff',
                tempValue: '-30',
                textColor: '#000',
            },
            {
                backColor: '#9a1d9a',
                tempValue: '-20',
                textColor: '#fff',
            },
            {
                backColor: '#362a76',
                tempValue: '-15',
                textColor: '#fff',
            },
            {
                backColor: '#635cb7',
                tempValue: '-10',
                textColor: '#fff',
            },
            {
                backColor: '#4d84cb',
                tempValue: '-5',
                textColor: '#fff',
            },
            {
                backColor: '#59bca0',
                tempValue: '0',
                textColor: '#000',
            },
            {
                backColor: '#66d458',
                tempValue: '5',
                textColor: '#000',
            },
            {
                backColor: '#c3e64d',
                tempValue: '10',
                textColor: '#000',
            },
            {
                backColor: '#edda45',
                tempValue: '15',
                textColor: '#000',
            },
            {
                backColor: '#ecab4d',
                tempValue: '20',
                textColor: '#000',
            },
            {
                backColor: '#e77961',
                tempValue: '25',
                textColor: '#fff',
            },
            {
                backColor: '#c34172',
                tempValue: '30',
                textColor: '#fff',
            },
            {
                backColor: '#6b1527',
                tempValue: '40',
                textColor: '#fff',
            },
            {
                backColor: '#2b0001',
                tempValue: '50',
                textColor: '#fff',
            }
        ];
    }
    ColorService.hexToR = function (h) {
        return parseInt(h.substring(0, 2), 16);
    };
    ColorService.hexToG = function (h) {
        return parseInt(h.substring(2, 4), 16);
    };
    ColorService.hexToB = function (h) {
        return parseInt(h.substring(4, 6), 16);
    };
    ColorService.prototype.temperatureToColor = function (temperature) {
        var startTemp = 0;
        var endTemp = 0;
        var startColor = '';
        var endColor = '';
        if (temperature < -30) {
            startTemp = -40;
            endTemp = -30;
            startColor = this.betweenM40andM30;
            endColor = this.betweenM30andM20;
        }
        else if (temperature < -20) {
            startTemp = -30;
            endTemp = -20;
            startColor = this.betweenM30andM20;
            endColor = this.betweenM20andM15;
        }
        else if (temperature < -15) {
            startTemp = -20;
            endTemp = -15;
            startColor = this.betweenM20andM15;
            endColor = this.betweenM15andM10;
        }
        else if (temperature < -10) {
            startTemp = -15;
            endTemp = -10;
            startColor = this.betweenM15andM10;
            endColor = this.betweenM10andM5;
        }
        else if (temperature < -5) {
            startTemp = -10;
            endTemp = -5;
            startColor = this.betweenM10andM5;
            endColor = this.betweenM5and0;
        }
        else if (temperature < 0) {
            startTemp = -5;
            endTemp = 0;
            startColor = this.betweenM5and0;
            endColor = this.between0and5;
        }
        else if (temperature < 5) {
            startTemp = 0;
            endTemp = 5;
            startColor = this.between0and5;
            endColor = this.between5and10;
        }
        else if (temperature < 10) {
            startTemp = 5;
            endTemp = 10;
            startColor = this.between5and10;
            endColor = this.between10and15;
        }
        else if (temperature < 15) {
            startTemp = 10;
            endTemp = 15;
            startColor = this.between10and15;
            endColor = this.between15and20;
        }
        else if (temperature < 20) {
            startTemp = 15;
            endTemp = 20;
            startColor = this.between15and20;
            endColor = this.between20and25;
        }
        else if (temperature < 25) {
            startTemp = 20;
            endTemp = 25;
            startColor = this.between20and25;
            endColor = this.between25and30;
        }
        else if (temperature < 30) {
            startTemp = 25;
            endTemp = 30;
            startColor = this.between25and30;
            endColor = this.between30and40;
        }
        else if (temperature < 40) {
            startTemp = 30;
            endTemp = 40;
            startColor = this.between30and40;
            endColor = this.between40and50;
        }
        else if (temperature < 50) {
            startTemp = 40;
            endTemp = 50;
            startColor = this.between40and50;
            endColor = this.between50and8;
        }
        var dTemp = endTemp - startTemp;
        var fraction = (temperature - startTemp) / dTemp;
        return ColorService_1.interpolateColor(fraction, startColor, endColor);
    };
    ColorService.interpolateColor = function (fraction, startColor, endColor) {
        var startR = ColorService_1.hexToR(startColor);
        var startG = ColorService_1.hexToG(startColor);
        var startB = ColorService_1.hexToB(startColor);
        var endR = ColorService_1.hexToR(endColor);
        var endG = ColorService_1.hexToG(endColor);
        var endB = ColorService_1.hexToB(endColor);
        return [
            Math.ceil(startR + Math.ceil((fraction * (endR - startR)))),
            Math.ceil(startG + Math.ceil((fraction * (endG - startG)))),
            Math.ceil(startB + Math.ceil((fraction * (endB - startB)))),
        ];
    };
    ColorService.prototype.getColorList = function () {
        return this.colorList;
    };
    return ColorService;
}());
ColorService = ColorService_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])()
], ColorService);

var ColorService_1;
//# sourceMappingURL=color.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/hsl.color.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HsvColorService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var HsvColorService = HsvColorService_1 = (function () {
    function HsvColorService() {
    }
    HsvColorService.prototype.init = function () {
        var startTemperature = -40;
        var lengthTemperature = 40 - (-40);
        var stepTemperature = 0.01;
        var steps = lengthTemperature / stepTemperature + 1;
        var gradient = HsvColorService_1.hsvGradient(steps, HsvColorService_1.colours);
        this.colors = {};
        for (var index = 0, temperature = startTemperature; index < gradient.length; index++, temperature += stepTemperature) {
            temperature = Math.round(temperature * 100) / 100;
            var color = gradient[index];
            this.colors[temperature] = HsvColorService_1.hsvToRgb(color.h, color.v, color.v);
        }
    };
    HsvColorService.prototype.getColor = function (temperature) {
        if (temperature < -20 || isNaN(temperature)) {
            temperature = -20;
        }
        else if (temperature > 40) {
            temperature = 40;
        }
        return this.colors[temperature];
    };
    HsvColorService.hsvGradient = function (steps, colours) {
        var parts = colours.length - 1;
        var gradient = new Array(steps);
        var gradientIndex = 0;
        var partSteps = Math.floor(steps / parts);
        var remainder = steps - (partSteps * parts);
        for (var col = 0; col < parts; col++) {
            // get colours
            var c1 = colours[col].c, c2 = colours[col + 1].c;
            c1 = HsvColorService_1.rgbToHsv(c1[0], c1[1], c1[2]);
            c2 = HsvColorService_1.rgbToHsv(c2[0], c2[1], c2[2]);
            // determine clockwise and counter-clockwise distance between hues
            var distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
            var distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
            // ensure we get the right number of steps by adding remainder to final part
            if (col == parts - 1)
                partSteps += remainder;
            // make gradient for this part
            for (var step = 0; step < partSteps; step++) {
                var p = step / partSteps;
                // interpolate h, s, b
                var h = (distCW <= distCCW) ? c1.h + (distCW * p) : c1.h - (distCCW * p);
                if (h < 0)
                    h = 1 + h;
                if (h > 1)
                    h = h - 1;
                var s = (1 - p) * c1.s + p * c2.s;
                var v = (1 - p) * c1.v + p * c2.v;
                // add to gradient array
                gradient[gradientIndex] = { h: h, s: s, v: v };
                gradientIndex++;
            }
        }
        return gradient;
    };
    HsvColorService.rgbToHsv = function (r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
        var d = max - min;
        s = max == 0 ? 0 : d / max;
        if (max == min) {
            h = 0; // achromatic
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    };
    HsvColorService.hsvToRgb = function (h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };
    return HsvColorService;
}());
HsvColorService.colours = [
    { t: -40, c: [70, 51, 244] },
    { t: -30, c: [91, 99, 232] },
    { t: -20, c: [142, 118, 209] },
    { t: -10, c: [109, 200, 194] },
    { t: 0, c: [77, 133, 195] },
    { t: 10, c: [90, 153, 53] },
    { t: 20, c: [198, 182, 79] },
    { t: 30, c: [188, 97, 61] },
    { t: 40, c: [102, 65, 89] },
];
HsvColorService = HsvColorService_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])()
], HsvColorService);

var HsvColorService_1;
//# sourceMappingURL=hsl.color.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map