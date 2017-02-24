from app import app
from app import models


@app.route('/api/vol/<vol>')
def get_vol(vol):
    return models.get_vol(vol)


@app.route('/api/track/<vol>')
def get_track(vol):
    return models.get_track_list(vol)


@app.route('/api/latestVol')
def get_latest_vol():
    return str(models.get_latest_vol())
