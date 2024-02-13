from flask import Flask
from config import Config
from backend.views import project, container, image
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Additional CORS headers (optional)
    app.config["CORS_HEADERS"] = "Content-Type"

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints (views)
    app.register_blueprint(project.bp, url_prefix='/project')
    app.register_blueprint(container.bp, url_prefix='/container')
    app.register_blueprint(image.bp, url_prefix='/image')

    return app
