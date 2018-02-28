import json
import time
from math import radians

from utils import frange, distance, mfrange


class Cache:
    def __init__(self, step):
        with open('jsons/cache.json') as data_file:
            cache = json.load(data_file)
        self.knownPoints = cache['knownPoints']
        self.web = cache['web']
        self.step = step
        self.hStep = step / 2
        if len(self.web) == 0:
            self.__create()

    def save(self):
        data = {'knownPoints': self.knownPoints, 'web': self.web}
        json_data = json.dumps(data)
        with open('jsons/cache.json', 'w') as file:
            file.write(json_data)

    def addAll(self, points, allPoints):
        """ :param Point[] point:  """
        i = 'i'
        d = 'd'
        check = 0.7
        x = 0
        for lng in frange(-180, 180, self.step):
            y = 0
            print 'adding for ', lng
            startTime = time.time()
            for lat in mfrange(85, -85, self.step):
                cLat = radians(float(lat + self.hStep))
                cLng = radians(float(lng + self.hStep))
                arr = []
                counter = 0
                startCheck = check
                for pId, point in allPoints.iteritems():
                    if abs(cLat - point.lat) < startCheck and abs(cLng - point.lng) < startCheck:
                        counter += 1
                        dist = distance(point.lat, point.lng, cLat, cLng)
                        arr.append({i: pId, d: dist})
                if counter < 8:
                    startCheck = check * 2
                    counter = 0
                    for pId, point in allPoints.iteritems():
                        if abs(cLat - point.lat) < startCheck and abs(cLng - point.lng) < startCheck:
                            counter += 1
                            dist = distance(point.lat, point.lng, cLat, cLng)
                            arr.append({i: pId, d: dist})
                if counter < 8:
                    raise Exception('bad')
                self.web[x][y] = sorted(arr, key=lambda k: k[d])[0:8]
                y += 1
            print 'adding took ', time.time() - startTime
            x += 1

        for point in points:
            self.knownPoints.append(point.id)

    def __create(self):
        x = 0
        for lat in frange(-180, 180, self.step):
            y = 0
            self.web.append([])
            for lng in mfrange(85, -85, self.step):
                self.web[x].append([])
                y += 1
            x += 1
