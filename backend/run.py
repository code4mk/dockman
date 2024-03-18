import sys
from backend.app import app, sio

# Retrieve command-line arguments or use default values
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5656
debug = True if len(sys.argv) > 2 and sys.argv[2].lower() == 'true' else False

app_config = {
    "host": "0.0.0.0",
    "port": port,
    "debug": debug
}

# Define event handlers
def handle_connect():
    print('Client connected')

def handle_disconnect():
    print('Client disconnected')

def handle_message(data):
    print('Server is running!')
    print(data['message'])
    sio.emit('message', {'message': 'Server is running mostafa!'})

# Register event handlers
sio.on_event('connect', handle_connect)
sio.on_event('disconnect', handle_disconnect)
sio.on_event('message', handle_message)


if __name__ == '__main__':
    sio.run(app, **app_config)
