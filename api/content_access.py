import os
from flask import send_file
#from weather import app

#@app.route('/images/<image>', methods=['GET'])
def get_image(image):
    return send_file(get_root_path() + "/images/" + image, mimetype='image/png')

#@app.route('/images/wind/<wind>', methods=['GET'])
def get_wind(wind):
    return send_file(get_root_path() + "/images/wind/" + wind, mimetype='application/json')

def get_root_path():
    return os.getcwd().replace("api", "generator", 1)


