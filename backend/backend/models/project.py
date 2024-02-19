from . import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name1 = db.Column(db.String(150), nullable=False)
    project_path = db.Column(db.String(255), nullable=False)
    template_name = db.Column(db.String(100), nullable=False)
    dockerfile_path = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"Project('{self.name1}', '{self.project_path}', '{self.template_name}', '{self.dockerfile_path}')"
