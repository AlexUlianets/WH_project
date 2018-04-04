import datetime
import DB
from flask import Flask, request, json, jsonify
from flaskext.mysql import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)

##for development only
#from content_access import get_image
#from content_access import get_wind
#app.add_url_rule( '/images/<type>/<image>', 'get_image', get_image, methods=['GET'])
#app.add_url_rule( '/images/wind/<wind>', 'get_wind', get_wind, methods=['GET'])
##end of for development

CORS(app)
mysql = MySQL()

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = DB.MYSQL_USER
app.config['MYSQL_DATABASE_PASSWORD'] = DB.MYSQL_PASSWORD
app.config['MYSQL_DATABASE_DB'] = DB.MYSQL_DB
app.config['MYSQL_DATABASE_HOST'] = DB.MYSQL_HOST
mysql.init_app(app)


@app.route('/api/weather', methods=['GET'])
def image():
    _date = request.args.get('date')
    _type = request.args.get('type')
    d = 3600 * ((int(_date) + 1800) // 3600)
    timestamp = datetime.datetime.utcfromtimestamp(d)
    f = '%Y-%m-%d %H:%M:%S'
    conn = mysql.connect()
    cursor = conn.cursor()
    query = "SELECT path FROM images WHERE type=%(type)s AND date=%(date)s"
    cursor.execute(query, {'type': _type, 'date': timestamp.strftime(f)})
    data = cursor.fetchone()
    if data is not None:
        path = 'images/' + _type + '/' + data[0] + '.png'
        wind = 'images/wind/' + data[0] + '.json'
        return jsonify({'path': path, 'wind': wind})
    else:
        ##test only
        #path = 'images/clouds/clouds.png'
        #wind = 'images/wind/wind.json'
        #return jsonify({'path': path, 'wind': wind})
        #test end
        return jsonify({})

if __name__ == "__main__":
    app.run()
