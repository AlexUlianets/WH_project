import json
import os
import time

import shutil

import datetime

from generator import Generator
import utils
import weather_parser
import mysql.connector
import DB

startTime = time.time()

filename = '/home/ubuntu/maps_app/generator/data/weather.csv'
zip_filename = '/home/ubuntu/maps_app/generator/data/wwo-data.csv.gz'

print 'Downloading weather file'
url = "http://bkwdv.worldweatheronline.com/data/wwo-data.csv.gz"
utils.download_large_file(url, zip_filename)
print 'Done'
print '------------------------\n'

print 'Extracting weather file'
utils.extract_large_file(zip_filename, filename)
print 'Done'
print '------------------------\n'

print 'Parsing weather file'
weather_parser.parse(filename)
print 'Done'
print '------------------------\n'

files = []
path = os.path.join('.', 'jsons', 'parser')
for dirname, dir_names, filenames in os.walk(path):
    for filename in filenames:
        files.append(os.path.join(dirname, filename))

configs = []
generator = Generator()
for parser_file in files:
    with open(parser_file) as data_file:
        data = json.load(data_file)
    date = parser_file.split(os.sep)[3]
    date = date[:-5]
    print configs
    configs += generator.generate(date, data)

# with open('jsons/configs.json', 'w') as file:
#     file.write(json_data)

cnx = mysql.connector.connect(user=DB.MYSQL_USER, password=DB.MYSQL_PASSWORD,
                              host=DB.MYSQL_HOST,
                              database=DB.MYSQL_DB)
cursor = cnx.cursor()
truncate = "TRUNCATE TABLE images"
query = "INSERT INTO images (date, path, type) VALUES (%(date)s, %(path)s, %(type)s)"
f = '%Y-%m-%d %H:%M:%S'
cursor.execute(truncate)
for item in configs:
    timestamp = datetime.datetime.utcfromtimestamp(item['date'])
    cursor.execute(query, {'type': item['type'], 'date': timestamp.strftime(f), 'path': item['path']})
    cnx.commit()
cnx.close()

path = os.path.join('.', 'images')
print path
utils.delete_directory(path)
shutil.move(os.path.join('.', 'temp', 'temperature'), 'images')
shutil.move(os.path.join('.', 'temp', 'clouds'), 'images')
shutil.move(os.path.join('.', 'temp', 'precipitations'), 'images')
shutil.move(os.path.join('.', 'temp', 'wind'), 'images')

print time.time() - startTime
