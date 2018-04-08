import utils
from datetime import datetime
import calendar
import os


class CloudConverter:
    def __init__(self, date):
        self.date = date
        self.dayMillis = calendar.timegm(datetime.strptime(date, "%Y-%m-%d").timetuple())

    def convert(self, cache, points):
        resultConfig = []
        hour = 0
        for time in utils.TIMES:
            clouds = []
            for x in range(0, len(cache.web)):
                clouds.append([])
                for y in range(0, len(cache.web[x])):
                    cloud = self.interpolate_clouds(cache.web[x][y], points, time)
                    clouds[x].append(int(cloud))
            timestamp = int(hour * 60 * 60 + self.dayMillis)
            name = self.date + '_' + str(timestamp) + '_' + utils.get_generation_timestamp()
            path = os.path.join('clouds', name)
            utils.generate_image(clouds, path)
            hour += 1
            resultConfig.append({
                'path': name,
                'date': timestamp,
                'type': 'clouds'
            })
        return resultConfig

    def interpolate_clouds(self, nearest, points, time):
        top = 0.0
        bottom = 0.0
        valid = False
        for near in nearest:
            d_ = near['d']
            if d_ < 700:
                valid = True
        if not valid:
            return 10

        for near in nearest:
            cloud = points[near['i']].times[time].cloud
            d_ = near['d']
            power = float(d_) ** 2
            if power == 0:
                return float(cloud)
            weight = 1.0 / power
            top += float(cloud) * weight
            bottom += weight
        return top / bottom
