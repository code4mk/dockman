# myapp/migrate.py

import os
from flask_migrate import Migrate, upgrade
from backend.app import create_app, db

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    with app.app_context():
        # Create migrations directory if it doesn't exist
        if not os.path.exists(migrate.directory):
            os.makedirs(migrate.directory)

        # Perform the migration with a custom message
        message = "Your custom migration message here"
        result = migrate.init_app(app, db)
        if result:
            print("Migration successful!")
        else:
            print("Migration failed!")

        # Upgrade the database
        upgrade(directory=migrate.directory)
