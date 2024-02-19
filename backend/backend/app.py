from flask import Flask
from config import Config
from backend.views import project, container, image, volume, network
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from backend.models import db
# Get the home directory
import os
home_directory = os.path.expanduser("~")

def create_app():
    app = Flask(__name__)
    # app.config.from_object(Config)
    print(f'home:::{home_directory}')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(home_directory, 'dockman.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize SQLAlchemy directly in app.py
    db.init_app(app)
    with app.app_context():
        db.create_all()
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Additional CORS headers (optional)
    app.config["CORS_HEADERS"] = "Content-Type"


    # Register blueprints (views)
    app.register_blueprint(project.bp, url_prefix='/project')
    app.register_blueprint(container.bp, url_prefix='/container')
    app.register_blueprint(image.bp, url_prefix='/image')
    app.register_blueprint(volume.bp, url_prefix='/volume')
    app.register_blueprint(network.bp, url_prefix='/the-network')

    return app
