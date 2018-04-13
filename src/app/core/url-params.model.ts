import { URLSearchParams, QueryEncoder } from '@angular/http';

export class URLParams extends URLSearchParams {

  constructor(rawParams?: string) {
    super(rawParams, new CustomQueryEncoder());
  };

}

class CustomQueryEncoder extends QueryEncoder {

  private static customEncoding(v: string): string {
    return encodeURIComponent(v)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/gi, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%2B/gi, '+')
      .replace(/%3D/gi, '=')
      .replace(/%3F/gi, '?')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
      .replace(/%2F/gi, '/');
  }

  encodeKey(k: string): string { return CustomQueryEncoder.customEncoding(k); }

  encodeValue(v: string): string { return CustomQueryEncoder.customEncoding(v); }
}
