import sys
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}

# Configure CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Additional CORS headers (optional)
app.config["CORS_HEADERS"] = "Content-Type"

# Example route with CORS enabled
@app.route("/example")
def example():
    # See /src/components/App.js for frontend call
    return jsonify({'name': 'kamal', 'age': '28'})

# Quit route
@app.route("/quit")
def quit():
    shutdown = request.environ.get("werkzeug.server.shutdown")
    shutdown()
    return

if __name__ == "__main__":
    app.run(**app_config)
