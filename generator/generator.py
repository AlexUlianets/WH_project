import json

from cache import Cache
from convert.cloud import CloudConverter
from convert.precipitation import PrecipitationConverter
from convert.temperature import TemperatureConverter
from convert.wind import WindConverter
from point import Point, TimeRecord


class Generator:
    def __init__(self):
        self.prepared = False
        pass

    def generate(self, date, data):
        step = 0.5
        cache = Cache(step)

        with open('jsons/ids.json') as data_file:
            ids = json.load(data_file)

        lastKnownId = 1
        for realId, myId in ids.iteritems():
            if myId >= lastKnownId:
                lastKnownId += 1

        points = {}
        for id, row in data.iteritems():
            if id not in ids:
                print 'new point ', id
                ids[id] = lastKnownId
                lastKnownId += 1
            sid = ids[id]

            times = {}
            for time, record in row['times'].iteritems():
                timeRecord = TimeRecord(record['temperature'], record['cloud'], record['precipitation'],
                                        record['wind_degree'], record['wind_speed'])
                times[time] = timeRecord
            point = Point(sid, row['latitude'], row['longitude'], times)
            points[sid] = point

        print 'start iterate points'
        # Check on new points
        # if not self.prepared:
        #     self.prepared = True
        #     pointsToAdd = []
        #     for id, point in points.iteritems():
        #         if id not in cache.knownPoints:
        #             pointsToAdd.append(point)
        #     print len(pointsToAdd)
        #     if len(pointsToAdd) > 0: cache.addAll(pointsToAdd, points)
        #     cache.save()
        #
        #     json_data = json.dumps(ids)
        #     with open('jsons/ids.json', 'w') as file:
        #         file.write(json_data)

        configs = []
        temperature = TemperatureConverter(date)
        configs += temperature.convert(cache, points)

        cloud = CloudConverter(date)
        configs += cloud.convert(cache, points)

        precipitation = PrecipitationConverter(date)
        configs += precipitation.convert(cache, points)

        wind = WindConverter(date)
        configs += wind.convert(cache, points)

        return configs
