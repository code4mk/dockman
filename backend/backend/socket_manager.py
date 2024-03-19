from flask import Flask
from flask_socketio import SocketIO
from engineio.async_drivers import threading

# async_mode = None

def init_socketio(app):
    # Create a SocketIO instance with gevent as async mode
    sio = SocketIO(app, async_mode='threading', cors_allowed_origins="*")
    return sio
