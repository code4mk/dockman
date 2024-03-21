import sys
from backend.app import app, sio
from backend.app import create_app
from flask_socketio import join_room , leave_room

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

def handle_join_room(room):
    join_room(room)
    print(f"service has joined room: {room}")
    
def handle_leave_room(room):
    leave_room(room)
    print(f"service has leave room: {room}")
    
# Register event handlers
sio.on_event('connect', handle_connect)
sio.on_event('disconnect', handle_disconnect)
sio.on_event('joinRoom', handle_join_room)
sio.on_event('leaveRoom', handle_leave_room)

import os

import os
import sys
import subprocess

def run_as_root():
    if os.geteuid() != 0:
        # Re-run the script with sudo if not already running as root
        command = ["sudo", "-S", sys.executable] + sys.argv
        sudo_proc = subprocess.Popen(command, stdin=subprocess.PIPE)
        
        # Read the sudo password from user's input
        sudo_password = 'mkkawsar'
        
        # Provide the sudo password to the subprocess
        sudo_proc.communicate(input=sudo_password.encode())
        
        if sudo_proc.returncode != 0:
            print("Error: Failed to execute script as root.")
            sys.exit(1)


    # Now we're running as root
    print("Running as root")
        

if __name__ == '__main__':
    #sio.run(app, **app_config)
    #app.run(**app_config)
    sio.run(app, allow_unsafe_werkzeug=True, **app_config)
    
