from math import radians


class Point:
    def __init__(self, id, lat, lng, times):
        self.id = id
        self.lat = radians(float(lat))
        self.lng = radians(float(lng))
        self.times = times


class TimeRecord:
    def __init__(self, temperature, cloud, precipitation, wind_degree, wind_speed):
        self.temperature = temperature
        self.cloud = cloud
        self.precipitation = precipitation
        self.wind_degree = radians(float(wind_degree))
        self.wind_speed = wind_speed
