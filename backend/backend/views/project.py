import os
import json
import requests
from flask import Blueprint, request, jsonify, g
from backend.models import db
from backend.models.project import Project, ProjectDockerfile, ProjectDockerBuild
from dock_craftsman.dockerfile_generator import DockerfileGenerator
from itertools import groupby
from json.decoder import JSONDecodeError
from datetime import datetime
import uuid

bp = Blueprint('project', __name__)

@bp.route('/create', methods=['POST'])
def create_project():
    # Extract data from form-data
    name = request.form.get('project_name')
    project_path = request.form.get('project_path')
    has_registry = request.form.get('has_registry')
    # template_name = request.form.get('template_name')
    # dockerfile_path = request.form.get('dockerfile_path')

    # Create a new Project instance
    new_project = Project(
        name=name,
        project_path=project_path,
        owner_id = 'd2e88f60-2c2e-4bc9-ae4e-8a3427b00931',
        created_at = datetime.now(),
        has_registry = True if has_registry.lower() == 'yes' else False
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
        })
    else:
        # Failed to add the project
        return jsonify({'message': 'Failed to add the project'}), 500 
    
@bp.route('/get-all', methods=['GET'])
def get_all_projects():
    projects = Project.query.all()
    project_list = [{'id': str(project.id), 'name': project.name, 'project_path': project.project_path} for project in projects]
    return jsonify({'data': project_list})

@bp.route('/get/<project_id>', methods=['GET'])
def get_single_project(project_id):
    project = Project.query.get_or_404(str(project_id))
    project_data = {'id': str(project.id), 'name': project.name, 'project_path': project.project_path,}
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
@bp.route('/save-content', methods=['POST'])
def save_content():
    data = request.form
    content = data.get('content')
    project_path = data.get('project_path')
    the_type = data.get('the_type')
    
    the_folder = ''
    the_path = ''
    
    if the_type == 'dockerfile':
        the_folder = os.path.join(project_path, 'the_dockman/dockerfiles')
        the_path = os.path.join(the_folder, 'app.Dockerfile')
    elif the_type == 'nginx':
        the_folder = os.path.join(project_path, 'the_dockman/config/nginx')
        the_path = os.path.join(the_folder, 'app.conf')
    
    # Create the dockerfiles folder if it doesn't exist
    if not os.path.exists(the_folder):
        os.makedirs(the_folder)

        # Set read and write permissions for the dockerfiles folder
        os.chmod(the_folder, 0o755)


    # Write or update the content to the app.Dockerfile
    with open(the_path, 'w') as file:
        file.write(content)

        # Set read and write permissions for the app.Dockerfile
        os.chmod(the_path, 0o644)

    return jsonify({'message': f'{the_type} saved successfully'}), 200

@bp.route('get-file-data', methods=['GET'])
def get_file_data():
    # Extracting the 'path' query parameter from the request
    file_path = request.args.get('path')

    if file_path:
        # Check if the file exists
        if os.path.exists(file_path):
            # File exists, read its contents
            with open(file_path, 'r') as file:
                file_data = file.read()
            return jsonify({'file_data': file_data}), 200
        else:
            # File does not exist, return empty content
            return jsonify({'file_data': ''}), 200
    else:
        return jsonify({'error': 'Path parameter is missing'}), 400
    
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

@bp.route('/save-image-build', methods=['POST'])
def save_image_build():
    # Extract data from form-data
    project_id = request.form.get('project_id')

    # Check if the project_id exists
    project = ProjectDockerBuild.query.filter_by(project_id=project_id).first()

    if project:
        # Project exists, update the project
        project.image_name = request.form.get('image_name')
        project.image_version = request.form.get('image_version')
        project.cache = request.form.get('cache')
        project.platform = request.form.get('platform')
        project.target = request.form.get('target')
        project.dockerfile_path = request.form.get('dockerfile_path')
        # Update other fields as needed
    else:
        # Project does not exist, create a new project
        image_name = request.form.get('image_name')
        image_version = request.form.get('image_version')
        cache = request.form.get('cache')
        platform = request.form.get('platform')
        target = request.form.get('target')
        dockerfile_path = request.form.get('dockerfile_path')

        # Create a new Project instance
        project = ProjectDockerBuild(
            project_id=project_id,
            image_name=image_name,
            image_version=image_version,
            cache=cache,
            platform=platform,
            target=target,
            dockerfile_path=dockerfile_path
        )

        # Add the new project to the database
        db.session.add(project)

    # Commit changes to the database
    db.session.commit()

    # Return the project data
    return jsonify({
        "message": "Project saved successfully",
        "project": {
            "project_id": project.project_id,
            "image_name": project.image_name,
            "image_version": project.image_version,
            "cache": project.cache,
            "platform": project.platform,
            "target": project.target,
            "dockerfile_path": project.dockerfile_path
            # Add other fields as needed
        }
    })

@bp.route('/get-image-build', methods=['GET'])
def get_image_build():
    # Extract project_id from the request parameters
    project_id = request.args.get('project_id')

    # Query the database for the project with the given project_id
    project = ProjectDockerBuild.query.filter_by(project_id=project_id).first()

    if project:
        # Project found, return its details
        return jsonify({
            'project_id': project.id,
            'image_name': project.image_name,
            'image_version': project.image_version,
            'cache': project.cache,
            'platform': project.platform,
            'target': project.target,
            'dockerfile_path': project.dockerfile_path
            # Add other fields as needed
        })
    else:
        # Project not found, return an error message
        return jsonify({'error': 'Project not found'})


from threading import Lock
from time import sleep

threads = {}
thread_lock = Lock()
stop_background_task = {}

@bp.route('docker-build', methods=['POST'])
def docker_build():
    data = request.form
    app_user_data_path = data.get('app_user_data')
    the_socket_room_name = data.get('socket_room_name')
    
    # Extract project_id from the request parameters
    project_id = data.get('project_id')

    # Query the database for the project with the given project_id
    project = ProjectDockerBuild.query.filter_by(project_id=project_id).first()
    
    build_data = {
         'data': {
            'project_id': project.id,
            'image_name': project.image_name,
            'image_version': project.image_version,
            'cache': project.cache,
            'platform': project.platform,
            'target': project.target,
            'dockerfile_path': project.dockerfile_path,
            'base_path': '/Users/code4mk/Documents/GitHub/kintaro/kintaro-backend',
            'docker_socket': 'unix:///Users/code4mk/.colima/default/docker.sock'
         }
    }

    global threads, stop_background_task
    import random
    task_key = random.randint(1, 100)
    with thread_lock:
        if task_key not in threads or not threads[task_key]['thread'].is_alive():
            from backend.app import sio
            threads[task_key] = {'thread': sio.start_background_task(background_task, task_key, app_user_data_path, build_data, the_socket_room_name )}
            stop_background_task[task_key] = False
            return f"Image building background task with key {task_key} started"
        
    return jsonify({'message': f'Docker build is ongoing'}), 200


import subprocess
def background_task(task_key, app_user_data_path, the_json_data, the_socket_room, is_image_push = None):
    while not stop_background_task.get(task_key, False):
        try:
            from backend.app import sio
            sio.emit('build_started', 'started', to=the_socket_room)
            
            data = (the_json_data)

            # Extract necessary information
            image_name = data['data']['image_name']
            image_version = data['data']['image_version']
            platform = data['data']['platform']
            dockerfile_path = data['data']['dockerfile_path']

            # Generate build-me.py inside base_path
            build_me_script_path = os.path.join(data['data']['base_path'], 'build-me.py')
            
            # Check if build-me.py exists, if not, create it and set permissions
            if not os.path.exists(build_me_script_path):
                with open(build_me_script_path, 'w') as build_me_file:
                    pass  # Creates an empty file if it doesn't exist
                # Set permissions for read and write (0644)
                os.chmod(build_me_script_path, 0o644)

            with open(build_me_script_path, 'w') as build_me_file:
                build_me_file.write('''\
from dock_craftsman.docker_image_builder import DockerImageBuilder

dockerfile_path = "{}"
dockerfile_content = ""
with open(dockerfile_path, 'r') as file:
    dockerfile_content = file.read()

b = DockerImageBuilder(docker_socket="{}")
b.set_platform('{}')
b.set_name('{}')
b.set_tag('{}')
b.set_content(dockerfile_content)
b.build()
'''.format(dockerfile_path, data['data']['docker_socket'], platform, image_name, image_version))

            print("build-me.py generated successfully at:", build_me_script_path)

            # Set up the virtual environment path
            project_path = '/Users/code4mk/Documents/GitHub/kintaro/kintaro-backend'
            venv_name = 'dockman_venv'
            the_user_app_data_path = app_user_data_path.replace(' ', '\ ')
            venv_path = os.path.join(the_user_app_data_path, venv_name)
            # Check if virtual environment already exists, if not, create it
            if not os.path.exists(venv_path):
                create_venv_cmd1 = f"python3 -m venv {venv_path}"
                subprocess.run(create_venv_cmd1, shell=True, check=True)
                combined_cmd = f"source {venv_path}/bin/activate && pip install dock-craftsman chardet && ./deploy-copy.sh"
            else:
                combined_cmd = f"source {venv_path}/bin/activate && ./deploy-copy.sh"

            # Run the bash script using subprocess.Popen
            process = subprocess.Popen(combined_cmd, shell=True, cwd=project_path, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            

            sio.emit('build_start', 'build start', to=the_socket_room)
            
            for stdout_line in iter(process.stdout.readline, b''):
                sio.emit('message', {'message': stdout_line.decode()}, to=the_socket_room)

            for stderr_line in iter(process.stderr.readline, b''):
                sio.emit('message', {'message': stderr_line.decode()}, to=the_socket_room)
            
            sio.emit('build_completed', 'completed', to=the_socket_room)
            
            if is_image_push == None:
                print('docker image pushing')
                docker_push(sio, the_socket_room=the_socket_room, image_name=image_name, image_version=image_version, project_path=project_path)
            
            stop_background_task[task_key] = True

        except Exception as e:
            stop_background_task[task_key] = True
            print(f"Error occurred while building Docker image: {e}")
            
        sleep(1)

def docker_push(sio, the_socket_room, image_name, image_version, project_path):
    region = ""
    profile = ""
    ecr_url = ""
    repo_name = image_name
    image_versions = [image_version]

    try:
        # Set AWS credentials as environment variables
        os.environ['AWS_DEFAULT_REGION'] = region
        os.environ['AWS_PROFILE'] = profile
        the_docker_bin = '/opt/homebrew/bin/docker'
        the_aws_bin = '/opt/homebrew/bin/aws'

        sio.emit('push_started', 'started', to=the_socket_room)
        # Execute login command
        login_cmd = f"{the_aws_bin} ecr get-login-password | {the_docker_bin} login --username AWS --password-stdin {ecr_url}"
        login_process = subprocess.Popen(login_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=os.environ.copy(), cwd=project_path)

        # Send real-time login logs
        for line in login_process.stdout:
            sio.emit('docker_push_status', line.decode().strip(), to=the_socket_room)

        login_process.wait()

        # Perform Docker operations for each version
        for image_version in image_versions:
            tag_cmd = f" {the_docker_bin} tag {repo_name}:{image_version} {ecr_url}/{repo_name}:{image_version}"
            tag_process = subprocess.Popen(tag_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=os.environ.copy(), cwd=project_path)

            # Send real-time tagging logs
            for line in tag_process.stdout:
                sio.emit('docker_push_status', line.decode().strip(), to=the_socket_room)

            tag_process.wait()

            push_cmd = f"{the_docker_bin} push {ecr_url}/{repo_name}:{image_version}"
            push_process = subprocess.Popen(push_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=os.environ.copy(), cwd=project_path)

            # Send real-time pushing logs
            for line in push_process.stdout:
                sio.emit('docker_push_status', line.decode().strip(), to=the_socket_room)

            push_process.wait()

        # Emit success message after all versions are pushed
        sio.emit('docker_push_status', "Docker push process completed successfully", to=the_socket_room)
        sio.emit('push_completed', 'completed', to=the_socket_room)
    except Exception as e:
        # Emit error message if subprocess fails
        sio.emit('docker_push_status', f"Error: {e}", to=the_socket_room)
    
    return "Docker push process completed. Check real-time updates."
