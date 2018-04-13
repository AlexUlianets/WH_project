export class DevelopUtil {

  /*private static HOST = 'http://weathermap.tk/';*/
  /*private static HOST = 'http://35.173.37.26:8888/';*/
  /*private static HOST = 'http://localhost:5000/';*/

  private static HOST = 'https://map.worldweatheronline.com:8888/';

  public static getHost() {
    return DevelopUtil.HOST;
  }

  public static url(url: string) {
    console.log('host: ' + DevelopUtil.HOST);
    return DevelopUtil.HOST + url;
  }
}
