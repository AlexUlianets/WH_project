import os
from flask import send_file

def get_image(type, image):
    return send_file(get_root_path() + "/images/" + type + "/" + image, mimetype='image/png')

def get_wind(wind):
    return send_file(get_root_path() + "/images/wind/" + wind, mimetype='application/json')

def get_root_path():
    return os.getcwd().replace("api", "generator", 1)


