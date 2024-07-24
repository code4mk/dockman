import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from . import db

Base = declarative_base()

class Project(db.Model):
    __tablename__ = 'docker_projects'
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    company_id = Column(String(36), nullable=False)
    git_url = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=func.now())
    
class ProjectPath(db.Model):
    __tablename__ = "docker_project_paths"
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    project_id = Column(String(36), nullable=False)
    user_id = Column(String(36), nullable=False)
    project_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())

class ProjectEnvironment(db.Model):
    __tablename__ = "docker_project_environments"
    
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    project_id = Column(String(36), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
class ProjectEnviornmentValue(db.Model):
    __tablename__ = "docker_project_environment_values"
    
    id = db.Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    project_id = db.Column(String(36), nullable=False)
    environment_id = db.Column(String(36), nullable=False)
    image_name = db.Column(db.String(150), nullable=False)
    cache = db.Column(db.String(150), nullable=False)
    platform = db.Column(db.String(150), nullable=False)
    target = db.Column(db.String(150), nullable=False)
    is_registry_publish = Column(Boolean, default=False)
    registry_info = Column(Text(), default="")
    argument_info = Column(Text(), default="")
    created_at = db.Column(DateTime, nullable=False, default=datetime.now)
    
    def as_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}
    
class ContainerRegistry(db.Model):
    __tablename__ = "docker_container_registries"
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    slug = db.Column(String(36), nullable=False)
    registry_config = db.Column(Text(), default='')
    project_id = db.Column(String(36), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}