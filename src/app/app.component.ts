import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import * as L from 'leaflet';
import * as $ from 'jquery';
import * as moment from 'moment';
import { ColorService } from './services/color.service';
import { CanvasLayer } from './canvas-layer/canvas';
import { WindJSLeaflet } from './wind/wind';
import TileEvent = L.TileEvent;
import { ColorConfig, RgbColorService } from './services/rgb.color.service';
import { borders } from './borders';
import { MapDataHttpService } from './services/http/map.data.http.service';
import { DevelopUtil } from './utils/develop.utils';
import { WindStateService } from './wind/wind.state.service';
import { Http } from '@angular/http';
import { CalendarModule } from 'primeng/primeng';

import * as domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CanvasLayer, WindJSLeaflet, WindStateService, CalendarModule]
})
export class AppComponent {

  map: any;
  step: any;
  dbl: any;
  p: any;
  tiles: any;

  currentFilter = 'temperature';
  filters = [{
    value: 'temperature',
    display: 'Температура'
  }, {
    value: 'clouds',
    display: 'Облачность'
  }, {
    value: 'precipitations',
    display: 'Осадки'
  }];

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

  zoomed = false;
  shouldBeLoaded = 0;

  mouseTemperature: number;
  loadingStatus: boolean = false;


  canvasTiles: any;
  zoomConfigs: any;
  tileLayer: any;
  groupLayers: any;
  imageData: any;
  //FIXME
  CanvasLayer: any;

  calendar = moment().toDate();


  calendarMinDate = moment(this.calendar).startOf('day').toDate();
  calendarMaxDate = moment(this.calendarMinDate).add(4,'d').endOf('day').toDate();
  // calendar = moment().set({'year': 2016, 'month': 10, 'date': 4}).startOf('day').toDate();
  // calendarMinDate = moment(this.calendar).startOf('day').toDate();
  // calendarMaxDate = moment(this.calendarMinDate).add(4,'d').endOf('day').toDate();
  calendarDisabled = false;
  calendarShowTime = true;
  langRU: any = {
    firstDayOfWeek: 1,
    dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    dayNamesMin: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
    monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
    monthNamesShort: [ "Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
    today: 'Сегодня',
    clear: 'Очистить'
  };

  // console.log(langRU);
  calDate: any = {
    hours: parseInt( moment().startOf('hour').format('H') ),
    days: [
      moment().startOf('day').format('ddd, DD.MM'),
      moment().add(1,'d').startOf('day').format('ddd, DD.MM'),
      moment().add(2,'d').startOf('day').format('ddd, DD.MM'),
      moment().add(3,'d').startOf('day').format('ddd, DD.MM'),
      moment().add(4,'d').startOf('day').format('ddd, DD.MM')
    ],
  };

  constructor(private http: Http, private colorService: ColorService, private windJSLeaflet: WindJSLeaflet, private hsvColorService: RgbColorService, private mapDataHttpService: MapDataHttpService, private windStateService: WindStateService, private meta: Meta) {
  this.meta.addTag({property: 'og:image', content: 'assets/images/world_weather_online.jpg'});
  this.meta.addTag({name: 'title', content: 'World Weather Map - Interactive weather map. Worldweatheronline'});
  this.meta.addTag({name: 'description', content: 'Interactive world weather map by Worldweatheronline.com with temperature, precipitation, cloudiness, wind. Animated hourly and daily weather forecasts on map'});
  this.meta.addTag({name: 'og:title', content: 'World Weather Map - Interactive weather map. Worldweatheronline'});
  this.meta.addTag({name: 'og:description', content: 'Interactive world weather map by Worldweatheronline.com with temperature, precipitation, cloudiness, wind. Animated hourly and daily weather forecasts on map'});
  }

  openURLInPopup(url, width, height, popup?) {
      var newwindow = window.open(url, popup || 'window' + Math.floor(Math.random() * 10000 + 1), 'width='+width+', height='+height);
      if (window.focus) {newwindow.focus()}
  }
  share2(net) {
    switch (net) {
      case 'F': {
          this.openURLInPopup('http://www.facebook.com/sharer.php?u=' + window.location.protocol + '//' + window.location.hostname, 600, 400);
          break;
      }
      case 'T': {
          this.openURLInPopup('http://twitter.com/home?status=' + window.location.protocol + '//' + window.location.hostname, 600, 400);
          break;
      }
      case 'G': {
          this.openURLInPopup('https://plus.google.com/share?url=' + window.location.protocol + '//' + window.location.hostname, 600, 400);
          break;
      }
      case 'screenShot': {
          this.loadingStatus = true;
          domtoimage.toBlob(document.querySelector('.leaflet-pane.leaflet-map-pane'), { height: window.innerHeight, width: window.innerWidth })
          .then((blob) => {
            FileSaver.saveAs(blob, "map.png");
            this.loadingStatus = false;
          })
          .catch((error) => {
            this.loadingStatus = false;
            console.error('oops, something went wrong!', error);
          });
          break;
      }
    }
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
      maxBoundsViscosity: 1.0,
      preferCanvas: true
    });
    this.map.zoomControl.setPosition('topleft');

    this.CanvasLayer = L.GridLayer.extend({
      createTile: function (coords) {
        let tile: any = L.DomUtil.create('canvas', 'leaflet-tile');
        tile.width = 256;
        tile.height = 256;
        return tile;
      }
    });

    this.tileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {
      attribution: '',
      subdomains: 'abcd',
      zIndex: 2,
    });

    let myStyle = {
      weight: 1,
      color: '#555',
      fillColor: '#555',
      // opacity: '0.3',
      fillOpacity: 0.01,
    };
    //let bordersLayer = L.geoJSON(borders);
    let bordersLayer = L.geoJSON((borders as any));

    bordersLayer.setStyle(myStyle as any);

    this.map.setView([this.defaultLat, this.defaultLng], this.defaultZoom);

    this.zoomConfigs = {};
    this.zoomConfigs[3] = {zoom: 3, step: 4, pow: 1};
    this.zoomConfigs[4] = {zoom: 4, step: 4, pow: 1};
    this.zoomConfigs[5] = {zoom: 5, step: 8, pow: 1};
    this.zoomConfigs[6] = {zoom: 6, step: 8, pow: 1};
    this.zoomConfigs[7] = {zoom: 7, step: 16, pow: 1};
    this.zoomConfigs[8] = {zoom: 8, step: 16, pow: 1};

    //FIXME
    this.canvasTiles = new this.CanvasLayer();

    let config = this.zoomConfigs[this.map.getZoom()];
    this.step = config.step;
    this.dbl = this.step * 2;
    this.p = config.pow;

    // this.map.addLayer(this.canvasTiles);

    this.groupLayers = L.layerGroup([]);
    this.groupLayers.addLayer(bordersLayer);
    this.groupLayers.addLayer(this.tileLayer);
    this.groupLayers.addLayer(this.canvasTiles);
    this.groupLayers.addTo(this.map);

    this.tiles = this.canvasTiles._tiles;
    this.hsvColorService.init(this.getColorConfig(this.currentFilter));

    this.updateMap();

    let layerControl = null;
    // let layerControl = L.control.layers({});
    // layerControl.addTo(this.map);
    let handleError = function (err) {
      console.log('handleError...');
      console.log(err);
    };

    this.windJSLeaflet.init({
      localMode: true,
      map: this.map,
      layerControl: layerControl,
      useNearest: false,
      timeISO: null,
      nearestDaysLimit: 7,
      displayValues: true,
      displayOptions: {
        displayPosition: 'bottomleft',
        displayEmptyString: 'No wind data'
      },
      overlayName: 'Wind',

      // https://github.com/danwild/wind-js-server
      // pingUrl: 'http://localhost:7000/alive',
      // latestUrl: 'http://localhost:7000/latest',
      // nearestUrl: 'http://localhost:7000/nearest',
      errorCallback: handleError
    });

  }

  windOffOn(){
    this.windJSLeaflet._destroyWind();
    if(!this.windJSLeaflet.canvasStatus){
      this.windJSLeaflet._canvasLayer = this.windJSLeaflet.LCanvasLayer.delegate(this.windJSLeaflet);
      this.windJSLeaflet._map.addLayer(this.windJSLeaflet._canvasLayer);
    }
    this.windJSLeaflet.canvasStatus = !this.windJSLeaflet.canvasStatus;
  }

  public show(imgPath) {
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imgPath;

    img.onload = () => {


      let self = this;
      let imageCanvas: any = document.getElementById('temp-image');
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      let imageContext = imageCanvas.getContext('2d');
      imageContext.drawImage(img, 0, 0);
      this.imageData = imageContext.getImageData(0, 0, img.width, img.height);
      this.refPoints = this.getRefPoints(this.imageData);
      this.distanceCache = this.updateDistanceCache();
      this.colorizeTiles();

      this.map.on('zoomstart', function () {
        self.zoomed = true;
        $("#cursor-dialog-box").css({top: 0, left: 0}).hide();
      });

      this.map.on('zoomend', function () {
        self.zoomed = false;

        let config = self.zoomConfigs[self.currentZoom];
        if (self.step != config.step) {
          self.step = config.step;
          self.dbl = self.step * 2;
          self.p = config.pow;
          self.distanceCache = self.updateDistanceCache();
        }

        self.groupLayers.removeLayer(self.canvasTiles);
        self.canvasTiles = new self.CanvasLayer();
        self.groupLayers.addLayer(self.canvasTiles);
        self.currentZoom = self.map.getZoom();

        self.tiles = self.canvasTiles._tiles;
        self.refPoints = self.getRefPoints(self.imageData);
        self.colorizeTiles();
        self.loadingStatus = false;
      });

      // this.map.on('moveend', function () {
      //   self.tiles = canvasTiles._tiles;
      //   self.refPoints = self.getRefPoints(imageData);
      //   self.colorizeTiles();
      //   self.mapOnDragStatus = false;
      // });


      this.tileLayer.on("tileloadstart", function () {
        if (self.zoomed) ++self.shouldBeLoaded;
      });

      this.tileLayer.on('tileload', function (tileEvent: TileEvent) {
        if (self.shouldBeLoaded > 0) {
          self.shouldBeLoaded--;
          return;
        }
        self.tilesForColorize.push(tileEvent.coords);
      });

      this.tileLayer.on('loading', function () {
        self.loadingStatus = true;
      });

      this.tileLayer.on('load', function (event) {
        self.tiles = self.canvasTiles._tiles;
        self.refPoints = self.getRefPoints(self.imageData);
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
      let func33213 = function(event){
        let imageXStart = Math.floor(2 * (180 + event.latlng.lng));
        let imageYStart = Math.floor(2 * (85 - event.latlng.lat));
        let imageScope = 4 * (imageYStart * 720 + imageXStart);
        self.mouseTemperature = self.imageData.data[imageScope] - 150;
        $("#cursor-dialog-box").css({top: event.containerPoint.y + 10, left: event.containerPoint.x + 5}).show();
      }
      this.map.on('mousemove', function (event) {
        func33213(event);
      });
      this.map.on('click', function (event) {
        func33213(event);
      });

    };
  }

  filterSelected(filter) {
    this.currentFilter = filter;
    this.hsvColorService.init(this.getColorConfig(this.currentFilter));
    this.calendarShowTime = this.currentFilter !== 'precipitations';
    this.updateMap();
  }

  colorizeTiles() {
    for (let item in this.tiles) {
      let currentTile = this.tiles[item];
      this.colorizeTile(currentTile);
    }
  }

  colorizeTile(tile) {
    let canvas = tile.el;
    let context = canvas.getContext('2d');
    let pixelLeftTop = canvas._leaflet_pos;
    let canvasData = context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    let color = this.hsvColorService.getColor(0);
    let topPart = 0;
    let bottomPart = 0;
    let temperature;
    let absolutePixelX = pixelLeftTop.x + this.screenOffsetX;
    let absolutePixelY = pixelLeftTop.y + this.screenOffsetY;
    for (let pixelX = 0; pixelX < this.canvasWidth; ++pixelX) {
      let leftLine = ((absolutePixelX / this.step) << 0) * this.step;
      let refX = absolutePixelX - leftLine;
      for (let pixelY = 0; pixelY < this.canvasHeight; ++pixelY) {
        if (absolutePixelX % this.step != 0 || absolutePixelY % this.step != 0) {
          let topLine = ((absolutePixelY / this.step) << 0) * this.step;
          let currentDistances = this.distanceCache[refX][absolutePixelY - topLine];
          if (currentDistances) {
            topPart = 0;
            bottomPart = 0;
            let length2 = currentDistances.length;
            for (let index = 0; index < length2; ++index) {
              let distance = currentDistances[index];
              let x1 = (index / 6) << 0;
              let y1 = index - x1 * 6;
              let x2 = leftLine + (x1 - 1) * this.step;
              let y2 = topLine + (y1 - 1) * this.step;
              let value = this.refPoints[x2][y2];
              topPart += value / distance;
              bottomPart += 1 / distance;
            }
            temperature = topPart / bottomPart;
          }
          // temperature = Math.ceil(temperature);
          temperature = Math.round(temperature * 10) / 10;
          // temperature = temperature.toFixed(1);
          color = this.hsvColorService.getColor(temperature);
        }
        let index = (pixelX + pixelY * this.canvasWidth) * 4;
        canvasData.data[index] = color.r;
        canvasData.data[++index] = color.g;
        canvasData.data[++index] = color.b;
        canvasData.data[++index] = 255;
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
    console.log('getRefPoints: '+ this.tiles.length)
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
    console.log('getRefPoints: '+ finishLineX)
    console.log('getRefPoints: '+ finishLineY)
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

  getColorConfig(filter): ColorConfig {
    switch (filter) {
      case 'temperature':
        return AppComponent.getTemperatureColorConfig();
      case 'clouds':
        return AppComponent.getCloudsColorConfig();
      case 'precipitations':
        return AppComponent.getPrecipitationsColorConfig();
      default:
        return AppComponent.getTemperatureColorConfig();
    }
  }

  static getTemperatureColorConfig(): ColorConfig {
    let colorConfig = new ColorConfig();
    colorConfig.colours = [
      {v: -40, c: [70, 51, 244]},
      {v: -30, c: [91, 99, 232]},
      {v: -20, c: [142, 118, 209]},
      {v: -10, c: [109, 200, 194]},
      {v: 0, c: [77, 133, 195]},
      {v: 10, c: [90, 153, 53]},
      {v: 20, c: [198, 182, 79]},
      {v: 30, c: [188, 97, 61]},
      {v: 40, c: [102, 65, 89]},
    ];
    colorConfig.startValue = -40;
    colorConfig.endValue = 40;
    return colorConfig;
  }

  static getCloudsColorConfig(): ColorConfig {
    let colorConfig = new ColorConfig();
    colorConfig.colours = [
      {v: 0, c: [84, 121, 164]},
      {v: 30, c: [140, 161, 186]},
      {v: 50, c: [183, 191, 200]},
      {v: 70, c: [221, 221, 221]},
      {v: 100, c: [255, 255, 255]},
    ];
    colorConfig.startValue = 0;
    colorConfig.endValue = 100;
    return colorConfig;
  }

  static getPrecipitationsColorConfig(): ColorConfig {
    let colorConfig = new ColorConfig();
    colorConfig.colours = [
      {v: 0, c: [130, 130, 130]},
      {v: 3, c: [69, 155, 181]},
      {v: 10, c: [147, 182, 69]},
      {v: 20, c: [182, 70, 72]},
      {v: 30, c: [182, 69, 174]},
    ];
    colorConfig.startValue = 0;
    colorConfig.endValue = 30;
    return colorConfig;
  }

  applyUpdateMap($event, h, d, justUpdateIt?) {
    if(justUpdateIt){
      this.updateMap();
      return 0;
    }
    $event.preventDefault();
    if(h !== !1){
      this.calendar = moment(this.calendar).startOf('day').add(d, 'd').add(h, 'h').toDate();
      this.calDate.hours = h;
    }else{
      this.calendar = moment().add(d, 'd').startOf('day').set('hour', this.calDate.hours).toDate();
      document.getElementById('active_days').id = '';
      if($event.target.nodeName != 'LI'){
        $event.target.closest('li').id = 'active_days';
      }else{
        $event.target.id = 'active_days';
      }
    }
    this.updateMap();
  }

  updateMap() {
    this.loadingStatus = true;
    this.calendarDisabled = true;

    let date = this.calendar;
    let timestamp = moment(date).unix();
    let type = this.currentFilter;

    this.mapDataHttpService.get(timestamp, type).subscribe(
      success => {
        if (success) {
          if(success.json()) {
            let imgPath = success.json().path;
            let windPath = success.json().wind;
            this.windStateService.triggerWindPathStatus({path: DevelopUtil.url(windPath)});
            this.show(DevelopUtil.url(imgPath));
          }
          this.loadingStatus = false;
          this.calendarDisabled = false;
        }
      },
      error => {
        if (error) {
          this.loadingStatus = false;
          this.calendarDisabled = false;
        }
      },
      () => {
      });
  }
}
