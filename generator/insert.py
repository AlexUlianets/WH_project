import datetime
import json

import mysql.connector
import DB

cnx = mysql.connector.connect(user=DB.MYSQL_USER, password=DB.MYSQL_PASSWORD,
                              host=DB.MYSQL_HOST,
                              database=DB.MYSQL_DB)
with open('jsons/configs.json') as data_file:
    data = json.load(data_file)
cursor = cnx.cursor()
query = "INSERT INTO images (date, path, type) VALUES (%(date)s, %(path)s, %(type)s)"
f = '%Y-%m-%d %H:%M:%S'
for item in data:
    timestamp = datetime.datetime.utcfromtimestamp(item['date'])
    cursor.execute(query, {'type': item['type'], 'date': timestamp.strftime(f), 'path': item['path']})
    cnx.commit()
cnx.close()