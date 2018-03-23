export class DevelopUtil {

  /*private static HOST = 'http://weathermap.tk/';*/

  private static HOST = 'http://35.173.37.26:8888/';

  public static getHost() {
    return DevelopUtil.HOST;
  }

  public static url(url: string) {
    return DevelopUtil.HOST + url;
  }
}
