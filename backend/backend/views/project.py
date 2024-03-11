from flask import Blueprint, request, jsonify, g
from backend.models import db
from backend.models.project import Project, ProjectDockerfile
from dock_craftsman.dockerfile_generator import DockerfileGenerator
from itertools import groupby
import json
from json.decoder import JSONDecodeError
import requests

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

@bp.route('/delete-dockerfile/<int:id>', methods=['DELETE'])
def delete_dockerfile(id):
    the_item = ProjectDockerfile.query.get(id)
    db.session.delete(the_item)
    db.session.commit()

    return jsonify({'message': 'Delete successfully'})


@bp.route('/get-all-dockerfiles/<int:project_id>', methods=['GET'])
def get_all_dockerfiles(project_id):
    dockerfiles = ProjectDockerfile.query.filter_by(project_id=project_id).order_by(ProjectDockerfile.stage).all()

    grouped_dockerfiles = {key: list(group) for key, group in groupby(dockerfiles, key=lambda x: x.stage)}

    dockerfile_list = []
    for stage, dockerfiles in grouped_dockerfiles.items():
        stage_dockerfiles = []
        for dockerfile in dockerfiles:
            try:
                if dockerfile.method == 'env':
                    parsed_data = json.loads(dockerfile.data)
                else:
                    parsed_data = json.loads(dockerfile.data)
            except JSONDecodeError as e:
                # Handle the error (e.g., log it, provide a default value, etc.)
                parsed_data = None
                # You can also raise the exception again if you want to propagate it
                # raise e

            stage_dockerfiles.append({
                'id': dockerfile.id,
                'project_id': dockerfile.project_id,
                'method': dockerfile.method,
                'title': dockerfile.title,
                'data': parsed_data,
                'stage': dockerfile.stage
            })

        dockerfile_list.append({
            'stage': stage,
            'dockerfiles': stage_dockerfiles
        })

    return jsonify({'data': dockerfile_list})


@bp.route('/the-dockerfile/<int:project_id>', methods=['GET'])
def the_dockerfile(project_id):
    dockerfiles = ProjectDockerfile.query.filter_by(project_id=project_id).order_by(ProjectDockerfile.stage).all()

    grouped_dockerfiles = {key: list(group) for key, group in groupby(dockerfiles, key=lambda x: x.stage)}

    dockerfile_list = []
    for stage, dockerfiles in grouped_dockerfiles.items():
        stage_dockerfiles = []
        for dockerfile in dockerfiles:
            try:
                if dockerfile.method == 'env':
                    parsed_data = json.loads(dockerfile.data)
                else:
                    parsed_data = json.loads(dockerfile.data)
            except JSONDecodeError as e:
                # Handle the error (e.g., log it, provide a default value, etc.)
                parsed_data = None
                # You can also raise the exception again if you want to propagate it
                # raise e

            stage_dockerfiles.append({
                'id': dockerfile.id,
                'project_id': dockerfile.project_id,
                'method': dockerfile.method,
                'title': dockerfile.title,
                'data': parsed_data,
                'stage': dockerfile.stage
            })

        dockerfile_list.append({
            'stage': stage,
            'dockerfiles': stage_dockerfiles
        })

    # Instantiate the DockerfileGenerator
    dockerfile = DockerfileGenerator()

    # Loop through the provided data and generate Python code
    for dockerfile_data in dockerfile_list:
        dockerfile.stage(dockerfile_data["stage"])
        for dockerfile_command in dockerfile_data["dockerfiles"]:
            method = dockerfile_command["method"]
            if method == "from_":
                dockerfile.from_(dockerfile_command["data"])                
            elif method == "env":
                for env_data in dockerfile_command["data"]:
                    dockerfile.env(env_data["key"], env_data["value"])
            elif method == "apt_install":
                dockerfile.apt_install(dockerfile_command["data"])
            elif method == "run":
                dockerfile.run(dockerfile_command["data"])
            elif method == "workdir":
                dockerfile.workdir(dockerfile_command["data"])
            elif method == "expose":
                dockerfile.expose(dockerfile_command["data"])
            elif method == "cmd":
                dockerfile.cmd(dockerfile_command["data"])
            # Add more conditions for other methods if needed

    # Get the content of the generated Dockerfile
    generated_dockerfile = dockerfile.get_content()
    return jsonify({'data': generated_dockerfile})

import os
@bp.route('/save-content-dockerfile', methods=['POST'])
def save_content_dockerfile():
    data = request.form
    content = data.get('content')
    project_path = data.get('project_path')
    
    # Define the path to the dockerfiles folder
    dockerfiles_folder = os.path.join(project_path, 'the_dockman/dockerfiles')
    
    # Create the dockerfiles folder if it doesn't exist
    if not os.path.exists(dockerfiles_folder):
        os.makedirs(dockerfiles_folder)

        # Set read and write permissions for the dockerfiles folder
        os.chmod(dockerfiles_folder, 0o755)

    # Define the path to the app.Dockerfile
    dockerfile_path = os.path.join(dockerfiles_folder, 'app.Dockerfile')

    # Write or update the content to the app.Dockerfile
    with open(dockerfile_path, 'w') as file:
        file.write(content)

        # Set read and write permissions for the app.Dockerfile
        os.chmod(dockerfile_path, 0o644)

    return jsonify({'message': 'Dockerfile saved successfully'}), 200

@bp.route('get-nginx-lists', methods=['GET'])
def get_nginx_lists():
    url = "https://raw.githubusercontent.com/dockmandev/dockman-data-hub/main/nginx/nginx.json"
    response = requests.get(url)
    data = response.json()
    return data

@bp.route('get-nginx-data', methods=['GET'])
def get_nginx_data():
    url = request.args.get('path')

    if not url:
        return "Missing 'path' parameter", 400

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        data = response.text  # Get the response content as a string
        return data
    except requests.exceptions.RequestException as e:
        return f'Request failed: {str(e)}', 500