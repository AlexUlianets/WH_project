import {Injectable} from '@angular/core';

@Injectable()
export class RgbColorService {

  private colors;
  private config: ColorConfig;

  public init(colorConfig: ColorConfig) {
    this.config = colorConfig;

    let startValue = colorConfig.startValue;
    let lengthValue = colorConfig.endValue - startValue;
    let stepValue = colorConfig.step;

    let steps = lengthValue / stepValue + 1;
    let gradient = RgbColorService.hsvGradient(steps, colorConfig.colours);

    this.colors = {};
    for (let index = 0, value = startValue; index < gradient.length; index++, value += stepValue) {
      value = Math.round(value * 100) / 100;
      this.colors[value] = gradient[index];
    }
  }

  public getColor(value) {
    if (value < this.config.startValue || isNaN(value)) {
      value = this.config.startValue
    } else if (value > this.config.endValue) {
      value = this.config.endValue;
    }
    return this.colors[value];
  }

  private static hsvGradient(steps, colours) {
    const parts = colours.length - 1;
    const gradient = new Array(steps);
    let gradientIndex = 0;
    let partSteps = Math.floor(steps / parts);
    let remainder = steps - (partSteps * parts);
    for (let col = 0; col < parts; col++) {
      // get colours
      let c1 = colours[col].c,
        c2 = colours[col + 1].c;

      // determine clockwise and counter-clockwise distance between hues
      if (col == parts - 1) partSteps += remainder;
      for (let step = 0; step < partSteps; step++) {
        const p = step / partSteps;
        let color = RgbColorService.interpolateColor(p, c1, c2);
        gradient[gradientIndex] = {r: color[0], g: color[1], b: color[2]};
        gradientIndex++;
      }
    }
    return gradient;
  }


  static interpolateColor(fraction, startColor, endColor) {
    let startR = startColor[0];
    let startG = startColor[1];
    let startB = startColor[2];

    let endR = endColor[0];
    let endG = endColor[1];
    let endB = endColor[2];

    return [
      Math.ceil(startR + Math.ceil((fraction * (endR - startR)))),
      Math.ceil(startG + Math.ceil((fraction * (endG - startG)))),
      Math.ceil(startB + Math.ceil((fraction * (endB - startB)))),
    ];
  }

  static hexToR(h) {
    return parseInt(h.substring(0, 2), 16)
  }

  static hexToG(h) {
    return parseInt(h.substring(2, 4), 16)
  }

  static hexToB(h) {
    return parseInt(h.substring(4, 6), 16)
  }
}

export class ColorConfig {

  colours;
  startValue;
  endValue;
  step = 0.01;
}
