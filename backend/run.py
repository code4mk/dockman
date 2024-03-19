import sys
from backend.app import app, sio
from backend.app import create_app

# app = create_app()

# Retrieve command-line arguments or use default values
# Default port
default_port = 5656

# Check if a port number is provided as a command-line argument
if len(sys.argv) > 1:
    try:
        port = int(sys.argv[1])
    except ValueError:
        print("Invalid port number provided. Using default port:", default_port)
        port = default_port
else:
    port = default_port
    
debug = True if len(sys.argv) > 2 and sys.argv[2].lower() == 'true' else True

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
    #sio.run(app, **app_config)
    #app.run(**app_config)
    sio.run(app, allow_unsafe_werkzeug=True, **app_config)
    
