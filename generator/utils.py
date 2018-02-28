import gzip
import urllib2
from math import sin, cos, sqrt, atan2, degrees, asin, pi

import os

import errno

import shutil
from PIL import Image

# import shutil
# from pip._vendor import requests
# from pip._vendor import requests

TIMES = [
    '0',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '1000',
    '1100',
    '1200',
    '1300',
    '1400',
    '1500',
    '1600',
    '1700',
    '1800',
    '1900',
    '2000',
    '2100',
    '2200',
    '2300'
]


def frange(x, y, jump):
    while x < y:
        yield x
        x += jump


def mfrange(x, y, jump):
    while x > y:
        yield x
        x -= jump


def download_large_file(url, name):
    with open(name,'wb') as f:
        f.write(urllib2.urlopen(url).read())
        f.close()

def extract_large_file(zip_filename, filename):
    with gzip.open(zip_filename, 'rb') as f_in, open(filename, 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)


def distance(lat1, lng1, lat2, lng2):
    R = 6373.0
    dlon = lng2 - lng1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return int(R * c)


def distance2(lat1, lng1, lat2, lng2):
    R = 6371
    x = (lng2 - lng1) * cos(0.5 * (lat2 + lat1))
    y = lat2 - lat1
    d = R * sqrt(x * x + y * y)
    return d


def generate_image(data, name):
    img = Image.new('RGB', (720, 340))  # create a new black image
    pixels = img.load()  # create the pixel map

    for i in range(img.size[0]):  # for every col:
        for j in range(img.size[1]):  # For every row
            valueee = 150 + data[i][j]
            pixels[i, j] = (valueee, 0, 0)  # set the colour accordingly

    filename = 'temp/' + name + '.png'
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    img.save(filename)


def generate_wind_image(dataU, dataV, name):
    img = Image.new('RGB', (360, 180))  # create a new black image
    pixels = img.load()  # create the pixel map

    for i in range(img.size[0]):  # for every col:
        for j in range(img.size[1]):  # For every row
            valueeeU = int(dataU[j * 180 + i])
            valueeeV = int(dataV[j * 180 + i])
            pixels[i, j] = (valueeeU, valueeeV, 0)  # set the colour accordingly

    filename = 'temp/' + name + '.png'
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    img.save(filename)


def delete_directory(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)
