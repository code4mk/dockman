# run.py
import sys
from backend import create_app

app = create_app()
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}

if __name__ == '__main__':
    app.run(**app_config)
