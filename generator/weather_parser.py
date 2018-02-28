import csv
import json

import os

import utils


def parse(filename):
    __clear_storage()
    with open(filename) as data_file:
        reader = csv.reader(data_file)
        rows = []
        for row in reader:
            rows.append(row)
        __internal_parse(rows)


def __internal_parse(rows):
    parsed_dates = []
    new_date = 1
    while new_date is not None:
        new_date = __parse_date(rows, parsed_dates)
        parsed_dates.append(new_date)
    print new_date


def __parse_date(rows, parsed_dates):
    splitter = "\t"
    current_date = None
    locations = {}
    firstRow = True

    location_ids = []
    for row in rows:
        if firstRow:
            firstRow = False
            continue

        columns = row[0].split(splitter)
        date = columns[Columns.FORECAST_DATE]

        if current_date is None:
            if date not in parsed_dates:
                current_date = date
            else:
                continue
        if current_date != date:
            continue

        location_id = columns[Columns.LOCATION_ID]
        if location_id not in locations:
            latitude = columns[Columns.LATITUDE]
            longitude = columns[Columns.LONGITUDE]

            if longitude > 23 and longitude < 33 and latitude > 51 and latitude < 56:
                print longitude, ' ', latitude
                location_ids.append(location_id)

            locations[location_id] = {
                'latitude': latitude,
                'longitude': longitude,
                'times': {}
            }

        time = columns[Columns.FORECAST_TIME]
        time = __check_time(time)
        locations[location_id]['times'][time] = __collect_row(columns)
        if location_id in location_ids:
            print columns

    if current_date is not None:
        json_data = json.dumps(locations)
        store_name = current_date.split(' ')[0]

        path = os.path.join('jsons', 'parser', store_name + '.json')
        with open(path, 'w') as opened_file:
            opened_file.write(json_data)
    return current_date


def __collect_row(columns):
    temperature = columns[Columns.TEMPERATURE]
    degree = columns[Columns.WIND_DIRECTION_DEGREE]
    speed = columns[Columns.WIND_SPEED]
    precipitation = columns[Columns.PRECIPITATION]
    cloud = columns[Columns.CLOUD]
    return {'temperature': temperature, 'wind_degree': degree, 'wind_speed': speed,
            'precipitation': precipitation, 'cloud': cloud}


def __clear_storage():
    path = os.path.join('.', 'jsons', 'parser')
    utils.delete_directory(path)


def __check_time(time):
    int_time = int(time)
    ost = int_time % 100
    if ost != 0:
        return int_time - ost
    else:
        return int_time


class Columns:
    def __init__(self):
        pass

    LOCATION_ID = 0
    LATITUDE = 1
    LONGITUDE = 2
    UID = 3
    FORECAST_DATE = 5
    FORECAST_TIME = 6
    WIND_DIRECTION_DEGREE = 7
    WIND_SPEED = 8
    TEMPERATURE = 9
    ICON_CODE = 10
    HUMIDITY = 11
    PRECIPITATION = 12
    CLOUD = 13
    VISIBILITY = 14
    PRESSURE = 15
    LAST_UPDATE_DATE = 16

    CHANCE_OF_RAIN = 17
    CHANCE_OF_BEING_DRY = 18
    CHANCE_OF_STRONG_WIND = 19
    CHANCE_OF_BEING_CLOUDY = 20
    CHANCE_OF_BEING_SUNNY = 21
    CHANCE_OF_TEMP_BELLOW_FREEZING = 22
    CHANCE_OF_BEING_WARM = 23
    CHANCE_OF_POOR_VISIBILITY = 24
    CHANCE_OF_SNOW = 25
    CHANCE_OF_THUNDER = 26

    WATER_TEMP = 27
    UTC_DATE = 28
    UTC_TIME = 29

    CHANCE_OF_HEAVY_RAIN = 30
    CHANCE_OF_STORM = 31
    CHANCE_OF_DEW = 32
    CHANCE_OF_ICE = 33
    CHANCE_OF_TEMP_BELLOW_5_DEGREE = 34
    CHANCE_OF_MOD_WIND = 35

    HEAT_INDEX = 36
    DEW_POINT = 37
    WIND_CHILL = 38
    WIND_GUST = 39
