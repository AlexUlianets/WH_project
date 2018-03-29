import utils
from datetime import datetime
import calendar
import os


class PrecipitationConverter:
    def __init__(self, date):
        self.date = date
        self.dayMillis = calendar.timegm(datetime.strptime(date, "%Y-%m-%d").timetuple())

    def convert(self, cache, points):
        precipitations = []
        for x in range(0, len(cache.web)):
            precipitations.append([])
            for y in range(0, len(cache.web[x])):
                precipitation = self.interpolate_precipitation(cache.web[x][y], points)
                precipitations[x].append(int(precipitation))

        hour = 0
        resultConfig = []
        for time in utils.TIMES:
            timestamp = int(hour * 60 * 60 + self.dayMillis)
            name = self.date + '_' + str(timestamp)
            path = os.path.join('precipitations', name)
            utils.generate_image(precipitations, path)
            hour += 1
            resultConfig.append({
                'path': name,
                'date': timestamp,
                'type': 'precipitations'
            })
        return resultConfig

    def interpolate_precipitation(self, nearest, points):
        top = 0.0
        bottom = 0.0
        for near in nearest:
            precipitation = 0
            for time, timeRecord in points[near['i']].times.iteritems():
                precipitation += float(timeRecord.precipitation)
            power = float(near['d']) ** 2
            if power == 0:
                return float(precipitation)
            weight = 1.0 / power
            top += float(precipitation) * weight
            bottom += weight
        return top / bottom
