from . import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    project_path = db.Column(db.String(255), nullable=True)
    template_name = db.Column(db.String(100), nullable=True)
    dockerfile_path = db.Column(db.String(255), nullable=True)
    the_dockerfile_raw = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"Project('{self.name}', '{self.project_path}', '{self.template_name}', '{self.dockerfile_path}')"
    

class ProjectDockerfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.String(150), nullable=False)
    method = db.Column(db.String(255), nullable=True)
    title = db.Column(db.String(100), nullable=True)
    stage = db.Column(db.String(255), nullable=True)
    data = db.Column(db.String(255), nullable=True)
    
class ProjectDockerBuild(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.String(150), nullable=False)
    image_name = db.Column(db.String(150), nullable=False)
    image_version = db.Column(db.String(150), nullable=False)
    cache = db.Column(db.String(150), nullable=False)
    platform = db.Column(db.String(150), nullable=False)
    target = db.Column(db.String(150), nullable=False)
    dockerfile_path = db.Column(db.String(150), nullable=False)