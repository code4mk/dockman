# run.py
import sys
from backend import create_app

app = create_app()
# Retrieve command-line arguments or use default values
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
debug = True if len(sys.argv) > 2 and sys.argv[2].lower() == 'true' else False

app_config = {
    "host": "0.0.0.0",
    "port": port,
    "debug": debug
}

if __name__ == '__main__':
    app.run(**app_config)
