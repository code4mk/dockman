import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Boolean, DateTime, Text
from . import db

import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Project(db.Model):
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    project_path = Column(String(255), nullable=True)
    owner_id = Column(String(36), nullable=False)
    has_registry = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    

class ProjectDockerfile(db.Model):
    id = db.Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    project_id = db.Column(String(36), nullable=False)
    method = db.Column(db.String(255), nullable=True)
    title = db.Column(db.String(100), nullable=True)
    stage = db.Column(db.String(255), nullable=True)
    data = db.Column(db.String(255), nullable=True)
    created_at = db.Column(DateTime, nullable=False, default=datetime.now)

class ProjectDockerBuild(db.Model):
    id = db.Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    project_id = db.Column(String(36), nullable=False)
    environment_id = db.Column(String(36), nullable=False)
    registry_id = db.Column(String(36), nullable=True)
    image_name = db.Column(db.String(150), nullable=False)
    cache = db.Column(db.String(150), nullable=False)
    platform = db.Column(db.String(150), nullable=False)
    target = db.Column(db.String(150), nullable=False)
    dockerfile_path = db.Column(db.String(150), nullable=False)
    is_registry_publish = Column(Boolean, default=False)
    registry_info = Column(Text(), default="")
    created_at = db.Column(DateTime, nullable=False, default=datetime.now)
    
    def as_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}

class ProjectDockerBuildArgument(db.Model):
    id = db.Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    project_id = db.Column(String(36), nullable=False)
    environment_id = db.Column(String(36), nullable=False)
    key = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Text, nullable=False)
    created_at = db.Column(DateTime, nullable=False, default=datetime.now)
    
    
class ProjectEnvironment(db.Model):
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    project_id = db.Column(String(36), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
class ContainerRegistry(db.Model):
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    slug = db.Column(String(36), nullable=False)
    registry_config = db.Column(Text(), default='')
    project_id = db.Column(String(36), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}