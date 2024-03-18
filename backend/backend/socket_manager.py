from flask_socketio import SocketIO

def init_socketio(app):
    sio = SocketIO(app, cors_allowed_origins="*")
    return sio
