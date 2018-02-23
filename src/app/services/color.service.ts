import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

  betweenM40andM30 = "efefef";
  betweenM30andM20 = "ffb1ff";
  betweenM20andM15 = "9a1d9a";
  betweenM15andM10 = "554ea6";
  betweenM10andM5 = "635cb7";
  betweenM5and0 = "4d84cb";
  between0and5 = "59bca0";
  between5and10 = "66d458";
  between10and15 = "c3e64d";
  between15and20 = "edda45";
  between20and25 = "ecab4d";
  between25and30 = "e77961";
  between30and40 = "c34172";
  between40and50 = "6b1527";
  between50and8 = "2b0001";

  static hexToR(h) {
    return parseInt(h.substring(0, 2), 16)
  }

  static hexToG(h) {
    return parseInt(h.substring(2, 4), 16)
  }

  static hexToB(h) {
    return parseInt(h.substring(4, 6), 16)
  }

  public temperatureToColor(temperature) {
    let startTemp = 0;
    let endTemp = 0;
    let startColor = '';
    let endColor = '';
    if (temperature < -30) {
      startTemp = -40;
      endTemp = -30;
      startColor = this.betweenM40andM30;
      endColor = this.betweenM30andM20;
    } else if (temperature < -20) {
      startTemp = -30;
      endTemp = -20;
      startColor = this.betweenM30andM20;
      endColor = this.betweenM20andM15;
    } else if (temperature < -15) {
      startTemp = -20;
      endTemp = -15;
      startColor = this.betweenM20andM15;
      endColor = this.betweenM15andM10;
    } else if (temperature < -10) {
      startTemp = -15;
      endTemp = -10;
      startColor = this.betweenM15andM10;
      endColor = this.betweenM10andM5;
    } else if (temperature < -5) {
      startTemp = -10;
      endTemp = -5;
      startColor = this.betweenM10andM5;
      endColor = this.betweenM5and0;
    } else if (temperature < 0) {
      startTemp = -5;
      endTemp = 0;
      startColor = this.betweenM5and0;
      endColor = this.between0and5;
    } else if (temperature < 5) {
      startTemp = 0;
      endTemp = 5;
      startColor = this.between0and5;
      endColor = this.between5and10;
    } else if (temperature < 10) {
      startTemp = 5;
      endTemp = 10;
      startColor = this.between5and10;
      endColor = this.between10and15;
    } else if (temperature < 15) {
      startTemp = 10;
      endTemp = 15;
      startColor = this.between10and15;
      endColor = this.between15and20;
    } else if (temperature < 20) {
      startTemp = 15;
      endTemp = 20;
      startColor = this.between15and20;
      endColor = this.between20and25;
    } else if (temperature < 25) {
      startTemp = 20;
      endTemp = 25;
      startColor = this.between20and25;
      endColor = this.between25and30;
    } else if (temperature < 30) {
      startTemp = 25;
      endTemp = 30;
      startColor = this.between25and30;
      endColor = this.between30and40;
    } else if (temperature < 40) {
      startTemp = 30;
      endTemp = 40;
      startColor = this.between30and40;
      endColor = this.between40and50;
    } else if (temperature < 50) {
      startTemp = 40;
      endTemp = 50;
      startColor = this.between40and50;
      endColor = this.between50and8;
    }
    let dTemp = endTemp - startTemp;
    let fraction = (temperature - startTemp) / dTemp;
    return ColorService.interpolateColor(fraction, startColor, endColor);
  }

  static interpolateColor(fraction, startColor, endColor) {
    let startR = ColorService.hexToR(startColor);
    let startG = ColorService.hexToG(startColor);
    let startB = ColorService.hexToB(startColor);

    let endR = ColorService.hexToR(endColor);
    let endG = ColorService.hexToG(endColor);
    let endB = ColorService.hexToB(endColor);

    return [
      Math.ceil(startR + Math.ceil((fraction * (endR - startR)))),
      Math.ceil(startG + Math.ceil((fraction * (endG - startG)))),
      Math.ceil(startB + Math.ceil((fraction * (endB - startB)))),
    ];
  }

  getColorList() {
    return this.colorList;
  }

  colorList: Array<any> = [
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

