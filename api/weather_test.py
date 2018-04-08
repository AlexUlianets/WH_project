import weather

from content_access import get_image
from content_access import get_wind
weather.app.add_url_rule( '/images/<type>/<image>', 'get_image', get_image, methods=['GET'])
weather.app.add_url_rule( '/images/wind/<wind>', 'get_wind', get_wind, methods=['GET'])

if __name__ == "__main__":
    weather.app.run(port = 8888)