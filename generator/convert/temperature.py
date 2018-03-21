import os

import utils
from datetime import datetime
import time


class TemperatureConverter:
    def __init__(self, date):
        self.date = date
        self.dayMillis = time.mktime(datetime.strptime(date, "%Y-%m-%d").timetuple())

    def convert(self, cache, points):
        resultConfig = []

        hour = 0
        for time in utils.TIMES:
            matrix = []
            for x in range(0, len(cache.web)):
                matrix.append([])
                for y in range(0, len(cache.web[x])):
                    value = self.__interpolate(cache.web[x][y], points, time)
                    matrix[x].append(int(value))
            timestamp = int(hour * 60 * 60 + self.dayMillis)
            name = self.date + '_' + str(timestamp)
            path = os.path.join('temperature', name)
            utils.generate_image(matrix, path)
            hour += 1
            resultConfig.append({
                'path': name,
                'date': timestamp,
                'type': 'temperature'
            })
        return resultConfig

    def __interpolate(self, nearest, points, time):
        top = 0.0
        bottom = 0.0
        for near in nearest:
            value = points[near['i']].times[time].temperature
            power = float(near['d']) ** 2
            if power == 0:
                return float(value)
            weight = 1.0 / power
            top += float(value) * weight
            bottom += weight
        return top / bottom