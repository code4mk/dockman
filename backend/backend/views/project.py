from flask import Blueprint, request, jsonify, g
from backend.models import db
from backend.models.project import Project, ProjectDockerfile

bp = Blueprint('project', __name__)

@bp.route('/create', methods=['POST'])
def create_project():
    # Extract data from form-data
    name = request.form.get('project_name')
    project_path = request.form.get('project_path')
    # template_name = request.form.get('template_name')
    # dockerfile_path = request.form.get('dockerfile_path')

    # Create a new Project instance
    new_project = Project(
        name=name,
        project_path=project_path,
        # template_name=template_name,
        # dockerfile_path=dockerfile_path
    )

    # Add the new project to the database
    db.session.add(new_project)
    db.session.commit()

    # Query the database to check if the data has been added
    added_project = Project.query.filter_by(name=name).first()

    if added_project:
        # Project has been added successfully
        return jsonify({
            'message': 'Project created successfully',
            'project_id': added_project.id,
            'name': added_project.name,
            'project_path': added_project.project_path,
            # 'template_name': added_project.template_name,
            # 'dockerfile_path': added_project.dockerfile_path
        })
    else:
        # Failed to add the project
        return jsonify({'message': 'Failed to add the project'}), 500 
    
@bp.route('/get-all', methods=['GET'])
def get_all_projects():
    projects = Project.query.all()
    project_list = [{'id': project.id, 'name': project.name, 'project_path': project.project_path,
                     'template_name': project.template_name, 'dockerfile_path': project.dockerfile_path}
                    for project in projects]
    return jsonify({'data': project_list})

@bp.route('/get/<int:project_id>', methods=['GET'])
def get_single_project(project_id):
    project = Project.query.get_or_404(project_id)
    project_data = {'id': project.id, 'name': project.name, 'project_path': project.project_path,
                    'template_name': project.template_name, 'dockerfile_path': project.dockerfile_path}
    return jsonify({'project': project_data})

@bp.route('/edit/<int:project_id>', methods=['PUT'])
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.form  # Assuming you're using form data for editing (adjust if using JSON)

    # Extract data from form-data
    name = data.get('name')
    project_path = data.get('project_path')
    template_name = data.get('template_name')
    dockerfile_path = data.get('dockerfile_path')

    # Update project data
    project.name = name or project.name
    project.project_path = project_path or project.project_path
    project.template_name = template_name or project.template_name
    project.dockerfile_path = dockerfile_path or project.dockerfile_path

    db.session.commit()

    return jsonify({
        'message': 'Project updated successfully',
        'project_id': project.id,
        'name': project.name,
        'project_path': project.project_path,
        'template_name': project.template_name,
        'dockerfile_path': project.dockerfile_path
    })

@bp.route('/delete/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()

    return jsonify({'message': 'Project deleted successfully'})


@bp.route('/create-dockerfile', methods=['POST'])
def create_project_dockerfile():
    # Extract data from form-data
    project_id = request.form.get('project_id')
    method = request.form.get('method')
    title = request.form.get('title')
    data = request.form.get('data')
    stage = request.form.get('stage')

    # Validate that all required data is provided
    if not all([project_id, method, title, data, stage]):
        return jsonify({'message': 'Incomplete data provided'}), 400

    # Create a new ProjectDockerfile instance
    new_project_dockerfile = ProjectDockerfile(
        project_id=project_id,
        method=method,
        title=title,
        data=data,
        stage=stage
    )

    # Add the new project dockerfile to the database
    db.session.add(new_project_dockerfile)
    db.session.commit()

    # Query the database to check if the data has been added
    added_dockerfile = ProjectDockerfile.query.filter_by(project_id=project_id, stage=stage, method=method).first()

    if added_dockerfile:
        # Dockerfile has been added successfully
        return jsonify({
            'message': 'Dockerfile item created successfully',
            'dockerfile_id': added_dockerfile.id,
            'project_id': added_dockerfile.project_id,
            'method': added_dockerfile.method,
            'title': added_dockerfile.title,
            'data': added_dockerfile.data,
            'stage': added_dockerfile.stage
        })
    else:
        # Failed to add the dockerfile
        return jsonify({'message': 'Failed to add the dockerfile item'}), 500


from itertools import groupby

@bp.route('/get-all-dockerfiles/<int:project_id>', methods=['GET'])
def get_all_dockerfiles(project_id):
    dockerfiles = ProjectDockerfile.query.filter_by(project_id=project_id).all()

    # Sort the dockerfiles by stage
    dockerfiles.sort(key=lambda x: x.stage)

    # Group the dockerfiles by stage
    grouped_dockerfiles = {key: list(group) for key, group in groupby(dockerfiles, key=lambda x: x.stage)}

    # Convert the grouped data to a list of dictionaries
    dockerfile_list = [{'stage': stage, 'dockerfiles': [{'id': dockerfile.id, 'project_id': dockerfile.project_id,
                                                           'method': dockerfile.method, 'title': dockerfile.title,
                                                           'data': dockerfile.data, 'stage': dockerfile.stage}
                                                          for dockerfile in dockerfiles]}
                       for stage, dockerfiles in grouped_dockerfiles.items()]

    return jsonify({'data': dockerfile_list})
