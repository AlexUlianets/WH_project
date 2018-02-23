import {Injectable} from '@angular/core';

@Injectable()
export class HsvColorService {

  private static colours = [
    {t: -40, c: [70, 51, 244]},
    {t: -30, c: [91, 99, 232]},
    {t: -20, c: [142, 118, 209]},
    {t: -10, c: [109, 200, 194]},
    {t: 0, c: [77, 133, 195]},
    {t: 10, c: [90, 153, 53]},
    {t: 20, c: [198, 182, 79]},
    {t: 30, c: [188, 97, 61]},
    {t: 40, c: [102, 65, 89]},
  ];

  private colors;

  public init() {
    let startTemperature = -40;
    let lengthTemperature = 40 - (-40);
    let stepTemperature = 0.01;

    let steps = lengthTemperature / stepTemperature + 1;
    let gradient = HsvColorService.hsvGradient(steps, HsvColorService.colours);

    this.colors = {};
    for (let index = 0, temperature = startTemperature; index < gradient.length; index++, temperature += stepTemperature) {
      temperature = Math.round(temperature * 100) / 100;
      let color = gradient[index];
      this.colors[temperature] = HsvColorService.hsvToRgb(color.h, color.v, color.v);
    }
  }

  public getColor(temperature) {
    if (temperature < -20 || isNaN(temperature)) {
      temperature = -20
    } else if (temperature > 40) {
      temperature = 40;
    }
    return this.colors[temperature];
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
      c1 = HsvColorService.rgbToHsv(c1[0], c1[1], c1[2]);
      c2 = HsvColorService.rgbToHsv(c2[0], c2[1], c2[2]);

      // determine clockwise and counter-clockwise distance between hues
      const distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
      const distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
      // ensure we get the right number of steps by adding remainder to final part
      if (col == parts - 1) partSteps += remainder;
      // make gradient for this part
      for (let step = 0; step < partSteps; step++) {
        const p = step / partSteps;
        // interpolate h, s, b
        let h = (distCW <= distCCW) ? c1.h + (distCW * p) : c1.h - (distCCW * p);
        if (h < 0) h = 1 + h;
        if (h > 1) h = h - 1;
        const s = (1 - p) * c1.s + p * c2.s;
        const v = (1 - p) * c1.v + p * c2.v;
        // add to gradient array
        gradient[gradientIndex] = {h: h, s: s, v: v};
        gradientIndex++;
      }
    }
    return gradient;
  }

  private static rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
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
    return {h: h, s: s, v: v};
  }

  static hsvToRgb(h, s, v) {
    let r, g, b, i, f, p, q, t;
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
  }
}

