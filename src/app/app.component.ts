import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
import { ColorService } from './services/color.service';
import LatLng = L.LatLng;
import TileEvent = L.TileEvent;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map: any;
  step: any;
  dbl: any;
  p: any;
  tiles: any;

  defaultLat: number = 52.242111;
  defaultLng: number = 21.024092;
  maxZoom: number = 8;
  minZoom: number = 3;
  defaultZoom = 3;
  currentZoom = this.defaultZoom;
  canvasWidth = 256;
  canvasHeight = 256;

  refPoints = {};
  screenOffsetX: number = 0;
  screenOffsetY: number = 0;

  colorList = [];

  colorCache = {};
  distanceCache = {};
  tilesForColorize = [];
  indexCache = {};

  zoomed = false;
  shouldBeLoaded = 0;

  mouseTemperature: number;
  loadingStatus: boolean = false;

  constructor(private colorService: ColorService) {
  }

  ngOnInit() {
    this.colorList = this.colorService.getColorList();
    let southWest = L.latLng(-84, -180),
      northEast = L.latLng(84, 180);
    let bounds = L.latLngBounds(southWest, northEast);

    this.map = L.map('lmap', {
      zoomControl: true,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });
    this.map.zoomControl.setPosition('topleft');

    let CanvasLayer = L.GridLayer.extend({
      createTile: function (coords) {
        let tile: any = L.DomUtil.create('canvas', 'leaflet-tile');
        tile.width = 256;
        tile.height = 256;
        return tile;
      }
    });


    let tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    });

    tileLayer.addTo(this.map);

    this.map.setView([this.defaultLat, this.defaultLng], this.defaultZoom);

    let zoomConfigs = {};
    zoomConfigs[3] = {zoom: 3, step: 4, pow: 1};
    zoomConfigs[4] = {zoom: 4, step: 4, pow: 1};
    zoomConfigs[5] = {zoom: 5, step: 8, pow: 1};
    zoomConfigs[6] = {zoom: 6, step: 8, pow: 1};
    zoomConfigs[7] = {zoom: 7, step: 16, pow: 1};
    zoomConfigs[8] = {zoom: 8, step: 16, pow: 1};

    let canvasTiles = new CanvasLayer();

    let config = zoomConfigs[this.map.getZoom()];
    this.step = config.step;
    this.dbl = this.step * 2;
    this.p = config.pow;

    this.map.addLayer(canvasTiles);

    this.tiles = canvasTiles._tiles;

    let img = new Image();
    img.src = 'assets/images/matrix.png';
    img.setAttribute('crossOrigin', '');

    img.onload = () => {


      let self = this;

      let imageCanvas: any = document.getElementById('temp-image');
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      let imageContext = imageCanvas.getContext('2d');
      imageContext.drawImage(img, 0, 0);
      let imageData = imageContext.getImageData(0, 0, img.width, img.height);
      this.refPoints = this.getRefPoints(imageData);
      this.distanceCache = this.updateDistanceCache();
      this.indexCache = this.updateIndexCache();
      this.colorizeTiles();

      this.map.on('zoomstart', function () {
        self.zoomed = true;
        $("#cursor-dialog-box").css({top: 0, left: 0}).hide();
      });

      this.map.on('zoomend', function () {
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
        if (self.zoomed) ++self.shouldBeLoaded;
      });

      tileLayer.on('tileload', function (tileEvent: TileEvent) {
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
        for (let colorizeTile of self.tilesForColorize) {
          for (let item in self.tiles) {
            let currentTile = self.tiles[item];
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

      this.map.on('mousemove', function (event) {
        let imageXStart = Math.floor(2 * (180 + event.latlng.lng));
        let imageYStart = Math.floor(2 * (85 - event.latlng.lat));
        let imageScope = 4 * (imageYStart * 720 + imageXStart);
        self.mouseTemperature = imageData.data[imageScope] - 150;
        $("#cursor-dialog-box").css({top: event.containerPoint.y + 10, left: event.containerPoint.x + 5}).show();
      });

    };

  }

  colorizeTiles() {
    console.time('time');
    for (let item in this.tiles) {
      let currentTile = this.tiles[item];
      this.colorizeTile(currentTile);
    }
    console.timeEnd('time');
  }

  colorizeTile(tile) {
    let canvas = tile.el;
    let context = canvas.getContext('2d');
    let pixelLeftTop = canvas._leaflet_pos;
    let canvasData = context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    let color = this.colorService.temperatureToColor(0);
    let topPart = 0;
    let bottomPart = 0;
    let temperature;
    let absolutePixelX = pixelLeftTop.x + this.screenOffsetX;
    let absolutePixelY = pixelLeftTop.y + this.screenOffsetY;
    let dc;
    for (let pixelX = 0; pixelX < this.canvasWidth; ++pixelX) {
      let leftLine = ((absolutePixelX / this.step) << 0) * this.step;
      let refX = absolutePixelX - leftLine;
      dc = this.distanceCache[refX];
      for (let pixelY = 0; pixelY < this.canvasHeight; ++pixelY) {
        if (absolutePixelX % this.step != 0 || absolutePixelY % this.step != 0) {
          let topLine = ((absolutePixelY / this.step) << 0) * this.step;
          let currentDistances = dc[absolutePixelY - topLine];
          if (currentDistances) {
            topPart = 0;
            bottomPart = 0;
            let length2 = 36;
            for (let index = 0; index < length2; ++index) {
              let distance = currentDistances[index];
              let ic = this.indexCache[index];
              let x2 = leftLine + ic.x * this.step;
              let y2 = topLine + ic.y * this.step;
              let value = this.refPoints[x2][y2];
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
        let index = (pixelX + pixelY * this.canvasWidth) * 4;
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
  }


  getRefPoints(imageData) {

    let startWorldPoint = this.map.latLngToLayerPoint(new L.LatLng(85, -180));
    this.screenOffsetX = Math.abs(startWorldPoint.x);
    this.screenOffsetY = Math.abs(startWorldPoint.y);

    let leftTop = {x: 0, y: 0};
    let rightBottom = {x: 0, y: 0};
    for (let item in this.tiles) {
      let currentTile = this.tiles[item];
      let startTilePoint = currentTile.el._leaflet_pos;
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
    let startNetX = this.screenOffsetX + leftTop.x;
    let startNetY = this.screenOffsetY + leftTop.y;

    let endNetX = this.screenOffsetX + rightBottom.x;
    let endNetY = this.screenOffsetY + rightBottom.y;

    let leftLine = ((startNetX / this.step) << 0) * this.step;
    let rightLine = ((endNetX / this.step + 1) << 0) * this.step;

    let topLine = ((startNetY / this.step) << 0) * this.step;
    let bottomLine = ((endNetY / this.step + 1) << 0) * this.step;
    let refs = {};
    let finishLineX = rightLine + 3 * this.step;
    let finishLineY = bottomLine + 3 * this.step;
    let startLineX = leftLine - 2 * this.step;
    let startLineY = topLine - 2 * this.step;
    for (let verticalLine = startLineX; verticalLine <= finishLineX; verticalLine += this.step) {
      refs[verticalLine] = {};
      for (let horizontalLine = startLineY; horizontalLine <= finishLineY; horizontalLine += this.step) {
        let pointLatLng = this.map.layerPointToLatLng({
          x: verticalLine - this.screenOffsetX,
          y: horizontalLine - this.screenOffsetY
        });
        let imageX = ((2 * (180 + pointLatLng.lng)) << 0);
        let imageY = ((2 * (85 - pointLatLng.lat)) << 0);
        let imageScope = 4 * (imageY * 720 + imageX);
        refs[verticalLine][horizontalLine] = imageData.data[imageScope] - 150;
      }
    }
    return refs;
  }

  updateDistanceCache() {
    let dc = {};
    // let dbl = step * 2;
    for (let i = 0; i < this.step; ++i) {
      dc[i] = {};
      for (let j = 0; j < this.step; ++j) {
        dc[i][j] = [];
        for (let refX = -2 * this.step; refX <= 3 * this.step; refX += this.step) {
          for (let refY = -2 * this.step; refY <= 3 * this.step; refY += this.step) {
            let dist = Math.sqrt(Math.pow(refX - i, 2) + Math.pow(refY - j, 2));
            dist = Math.pow(dist, this.p);
            dc[i][j].push(dist << 0);
          }
        }
      }
    }
    return dc;
  }

  updateIndexCache() {
    let ic = {};
    for (let index = 0; index < 36; ++index) {
      let x1 = (index / 6) << 0;
      let y1 = index - x1 * 6;
      ic[index] = {};
      ic[index].x = x1 - 1 ;
      ic[index].y = y1  - 1;
    }
    return ic;
  }


}
