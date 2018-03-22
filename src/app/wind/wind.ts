import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import * as $ from 'jquery';
declare var Windy:any;
import { CanvasLayer } from '../canvas-layer/canvas';
import { WindStateService } from './wind.state.service';

@Injectable()

export class WindJSLeaflet {

  _map;
  _data;
  _options;
  _canvasLayer;
  _windy;
  _context;
  _timer;
  _mouseControl;
  LCanvasLayer;

  canvasStatus = true;

  windSubscription: any;

  constructor(private windStateService: WindStateService) {
    // this._options = options;

    // let self = this;
  }

  init(options) {
    this.LCanvasLayer = new CanvasLayer();

    this._checkWind(options).then(() => {

      // set properties
      this._map = options.map;
      this._options = options;

      // create canvas, add overlay control
      this._canvasLayer = this.LCanvasLayer.delegate(this);
      // this._options.layerControl.addOverlay(this._canvasLayer, options.overlayName || 'wind');

      // ensure clean up on deselect overlay
      this._map.on('overlayremove', (e) => {
        if (e.layer == this._canvasLayer) {
          this.canvasStatus = false;
          this._destroyWind();
        }
      });

      this._map.on('overlayadd ', (e) => {
        if (e.layer == this._canvasLayer) {
          this.canvasStatus = true;
          // this._loadLocalData(this._data);
        }
      });

      this._map.addLayer(this._canvasLayer);

    }).catch((err) => {
      console.log('err');
      this._options.errorCallback(err);
    });

    this.windSubscription = this.windStateService.handleWindPathStatus().subscribe(data => {
      this._loadDataViaUrl(data.path);
    });
  }

  setTime(timeIso) {
    this._options.timeISO = timeIso;
  }

  _checkWind(options) {

    return new Promise((resolve, reject) => {
      if (options.localMode) resolve(true);
      $.ajax({
        type: 'GET',
        url: options.pingUrl,
        error: function error(err) {
          reject(err);
        },
        success: function success(data) {
          resolve(data);
        }
      });
    });
  }

  _getRequestUrl() {

    if(!this._options.useNearest) {
      return this._options.latestUrl;
    }

    let params = {
      "timeIso": this._options.timeISO || new Date().toISOString(),
      "searchLimit": this._options.nearestDaysLimit || 7 // don't show data out by more than limit
    };

    return this._options.nearestUrl + '?' + $.param(params);
  }

  _loadLocalData(data?) {
    this._initWindy(data);
  }

  _loadDataViaUrl(path) {

    // console.log('using local data..');

    $.getJSON(path, (data) => {
      this._data = data;
      if(this.canvasStatus) {
        this._destroyWind();
        this._canvasLayer = this.LCanvasLayer.delegate(this);
        this._map.addLayer(this._canvasLayer);
      }
    });
  }

  _loadWindData(data?) {

    if(!data) {
      return;
    }

    if(this._options.localMode) {
      this._loadLocalData(data);
      return;
    }

    let request = this._getRequestUrl();
    console.log(request);

    $.ajax({
      type: 'GET',
      url: request,
      error: (err) => {
        console.log('error loading data');
        this._options.errorCallback(err) || console.log(err);
        this._loadLocalData();
      },
      success: (data) => {
        this._data = data;
        this._initWindy(data);
      }
    });
  }

  onDrawLayer(overlay?, params?) {

    if (!this._windy) {
      this._loadWindData(this._data);
      return;
    }

    if (this._timer) clearTimeout(this._timer);

    this._timer = setTimeout(() => {

      let bounds = this._map.getBounds();
      let size = this._map.getSize();

      // bounds, width, height, extent
      this._windy.start(
        [
          [0, 0],
          [size.x, size.y]
        ],
        size.x,
        size.y,
        [
          [bounds._southWest.lng, bounds._southWest.lat],
          [bounds._northEast.lng, bounds._northEast.lat]
        ]);
    }, 750); // showing wind is delayed
  }

  _initWindy(data) {

    // windy object
    this._windy = new Windy({ canvas: this._canvasLayer._canvas, data: data });

    // prepare context global var, start drawing
    this._context = this._canvasLayer._canvas.getContext('2d');
    this._canvasLayer._canvas.classList.add("wind-overlay");
    this.onDrawLayer();

    this._map.on('dragstart', this._windy.stop);
    this._map.on('zoomstart', this._clearWind);
    this._map.on('resize', this._clearWind);

    // this._initMouseHandler();
  }

  // _initMouseHandler: function() {
  //   if (!this._mouseControl && this._options.displayValues) {
  //     let options = this._options.displayOptions || {};
  //     options['WindJSLeaflet'] = WindJSLeaflet;
  //     this._mouseControl = L.control.windPosition(options).addTo(this._map);
  //   }
  // },

  _clearWind() {
    if (this._windy) this._windy.stop();
    if (this._context) this._context.clearRect(0, 0, 3000, 3000);
  }

  _destroyWind() {
    if (this._timer) clearTimeout(this._timer);
    if (this._windy) this._windy.stop();
    if (this._context) this._context.clearRect(0, 0, 3000, 3000);
    if (this._mouseControl) this._map.removeControl(this._mouseControl);
    this._mouseControl = null;
    this._windy = null;
    this._map.removeLayer(this._canvasLayer);
  }

}
