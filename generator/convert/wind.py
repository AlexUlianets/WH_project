from datetime import datetime
import json
import os
import calendar
from math import cos
from math import sin

import errno

import utils


class WindConverter:
    def __init__(self, date):
        self.date = date
        self.dayMillis = calendar.timegm(datetime.strptime(date, "%Y-%m-%d").timetuple())

    def convert(self, cache, points):
        resultConfig = []
        hour = 0
        for time in utils.TIMES:
            u = []
            v = []

            length = 1980
            for index in range(0, length):
                u.append(0)
                v.append(0)

            y = 0
            for lng in range(85, -85, -1):
                x = 0
                for lat in range(-180, 180):
                    speed = self.__interpolate_wind_speed(cache.web[x][y], points, time)
                    degree = self.__interpolate_wind_degree(cache.web[x][y], points, time)
                    u.append(float("%.2f" % (speed * cos(degree))))
                    v.append(float("%.2f" % (speed * sin(degree))))
                    x += 2
                y += 2
            #
            # for x in range(0, len(cache.web), 2):
            #     for y in range(0, len(cache.web[x]), 2):
            #         speed = self.__interpolate_wind_speed(cache.web[x][y], points, time)
            #         degree = self.__interpolate_wind_degree(cache.web[x][y], points, time)
            #         u.append(float("%.2f" % (speed * cos(degree))))
            #         v.append(float("%.2f" % (speed * sin(degree))))

            length = 1980
            for index in range(0, length):
                u.append(0)
                v.append(0)

            timestamp = int(hour * 60 * 60 + self.dayMillis)
            name = self.date + '_' + str(timestamp) + '_' + utils.get_generation_timestamp()

            # u1 = u
            # v1 = v
            # for i in range(0, len(u1)):
            #     u1[i] = u1[i] * 10
            #     v1[i] = v1[i] * 10
            #
            # path = os.path.join('windUV', name)
            # utils.generate_wind_image(u1, v1, path)

            path = os.path.join('wind', name)
            filename = 'temp/' + path + '.json'
            self.__save_wind(u, v, filename)
            hour += 1
            resultConfig.append({
                'path': name,
                'date': timestamp,
                'type': 'wind'
            })
        return resultConfig

    def __save_wind(self, u, v, filename):
        with open('jsons/wind.json') as data_file:
            wind_json = json.load(data_file)

        wind_json[0]['data'] = [0 for x in range(65160)]
        wind_json[1]['data'] = u
        wind_json[2]['data'] = v

        if not os.path.exists(os.path.dirname(filename)):
            try:
                os.makedirs(os.path.dirname(filename))
            except OSError as exc:  # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise

        json_data = json.dumps(wind_json)
        with open(filename, 'w') as file:
            file.write(json_data)

    def __interpolate_wind_speed(self, nearest, points, time):
        top = 0.0
        bottom = 0.0
        for near in nearest:
            speed = points[near['i']].times[time].wind_speed
            power = float(near['d']) ** 2
            if power == 0:
                return float(speed)
            weight = 1.0 / power
            top += float(speed) * weight
            bottom += weight
        return top / bottom

    def __interpolate_wind_degree(self, nearest, points, time):
        top = 0.0
        bottom = 0.0
        for near in nearest:
            degree = points[near['i']].times[time].wind_degree
            power = float(near['d']) ** 2
            if power == 0:
                return float(degree)
            weight = 1.0 / power
            top += float(degree) * weight
            bottom += weight
        return top / bottom
