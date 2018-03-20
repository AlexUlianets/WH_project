export class DevelopUtil {

  /*private static HOST = 'http://weathermap.tk/';*/

  private static HOST = 'http://localhost:5000/';

  public static getHost() {
    return DevelopUtil.HOST;
  }

  public static url(url: string) {
    return DevelopUtil.HOST + url;
  }
}
