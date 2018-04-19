export class DevelopUtil {

  // private static HOST = window.location.protocol + '//' + window.location.hostname + ':8888/';

  private static HOST = 'https://map.worldweatheronline.com:8888/';

  public static getHost() {
    return DevelopUtil.HOST;
  }

  public static url(url: string) {
    console.log('host: ' + DevelopUtil.HOST);
    return DevelopUtil.HOST + url;
  }
}
