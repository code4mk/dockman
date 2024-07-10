from flask import Flask
from config import Config
from backend.views import project, container, image, volume, network
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from alembic import command
from alembic.config import Config as AlembicConfig
from backend.models import db
# Get the home directory
import os
from .socket_manager import init_socketio
home_directory = os.path.expanduser("~")

def create_app():
    app = Flask(__name__)
    # app.config.from_object(Config)
    print(f'home:::{home_directory}')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(home_directory, 'dockman.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    
    # Initialize SQLAlchemy directly in app.py
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)
    
    with app.app_context():
        db.create_all()
        
        # Programmatically run `flask db migrate`
        # alembic_cfg = AlembicConfig(os.path.join(os.path.dirname(__file__), 'migrations/alembic.ini'))
        # command.revision(alembic_cfg, autogenerate=True, message="Automatic migration")

        # # Programmatically run `flask db upgrade`
        # command.upgrade(alembic_cfg, 'head')
        
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


app = create_app()
sio = init_socketio(app)
