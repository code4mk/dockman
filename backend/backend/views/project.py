# Direct import
import os
import json
import requests
import uuid
import boto3
import base64

# Third Party source
from flask import Blueprint, request, jsonify, g
from itertools import groupby
from json.decoder import JSONDecodeError
from datetime import datetime

# Own source
from backend.models import db
from backend.models.project import (
    Project,
    ProjectPath,
    ProjectEnvironment,
    ProjectEnviornmentValue,
    ContainerRegistry
)
from dock_craftsman.dockerfile_generator import DockerfileGenerator
from backend.helpers.base import get_param

bp = Blueprint('project', __name__)

@bp.route('/create', methods=['POST'])
def create_project():
    name = get_param('project_name')
    project_path = get_param('project_path')

    try:
        # Create a new Project instance
        new_project = Project(
            id = str(uuid.uuid4()),
            name=name,
            company_id='d2e88f60-2c2e-4bc9-ae4e-8a3427b00931'
        )

        # Add the new project to the session and flush to get its ID
        db.session.add(new_project)
        db.session.flush()  # This makes the ID available without committing the transaction

        # Use the new project's ID to create a ProjectPath instance
        new_project_path = ProjectPath(
            id = str(uuid.uuid4()),
            project_id=new_project.id,
            user_id='d2e88f60-2c2e-4bc9-ae4e-8a3427b00931',
            project_path=project_path
        )

        # Add the new project path to the session
        db.session.add(new_project_path)

        # Commit the transaction
        db.session.commit()

        # If we reach this point, both inserts were successful
        return jsonify({
            'message': 'Project created successfully',
            'project_id': new_project.id,
            'name': new_project.name
        })

    except Exception as e:
        # If there is any error, roll back the transaction
        db.session.rollback()
        return jsonify({'message': 'Failed to add the project', 'error': str(e)}), 500

@bp.route('/get-all', methods=['GET'])
def get_all_projects():
    try:
        # Query all projects
        projects = Project.query.all()

        # Serialize the project data
        projects_data = [{'id': project.id, 'name': project.name} for project in projects]

        # Return the serialized data as a JSON response
        return jsonify(projects_data)

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve projects', 'error': str(e)}), 500


@bp.route('/get/<project_id>', methods=['GET'])
def get_single_project(project_id):
    user_id = 'd2e88f60-2c2e-4bc9-ae4e-8a3427b00931'  # Replace this with the actual user_id as needed

    try:
        # Query the project by its ID
        project = Project.query.get(project_id)
        
        if not project:
            return jsonify({'message': 'Project not found'}), 404

        # Query the project path by user_id and project_id
        project_path = ProjectPath.query.filter_by(user_id=user_id, project_id=project_id).first()

        if not project_path:
            return jsonify({'message': 'Project path not found'}), 404

        # Create the response object
        response = {
            'id': project.id,
            'name': project.name,
            'project_path': project_path.project_path
        }

        # Return the response object as JSON
        return jsonify(response)

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve project', 'error': str(e)}), 500


@bp.route('/edit/<int:project_id>', methods=['PUT'])
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    
    name = get_param('name')
    project_path = get_param('project_path')
    template_name = get_param('template_name')
    dockerfile_path = get_param('dockerfile_path')

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

@bp.route('/environment/create', methods=['POST'])
def env_create():
    try:
        # Extract parameters using get_param utility
        name = get_param('env_name')
        project_id = get_param('project_id')

        if not name or not project_id:
            return jsonify({'message': 'env_name and project_id are required'}), 400

        # Create a new ProjectEnvironment instance
        new_item = ProjectEnvironment(
            id = str(uuid.uuid4()),
            name=name,
            project_id=project_id,
            created_at=datetime.now()
        )

        # Add the new environment to the database session
        db.session.add(new_item)
        db.session.commit()

        # Return a success response with the created environment details
        return jsonify({
            'message': 'Environment created successfully',
            'environment_id': new_item.id,
            'name': new_item.name
        }), 201

    except Exception as e:
        # Roll back the session in case of an error
        db.session.rollback()
        return jsonify({'message': 'Failed to create environment', 'error': str(e)}), 500
    
@bp.route('/environment/<project_id>/get-all', methods=['GET'])
def get_all_env(project_id):
    try:
        # Query all environments for the given project_id
        environments = ProjectEnvironment.query.filter_by(project_id=project_id).all()
        
        if not environments:
            return jsonify([]), 200  # Return an empty list if no environments are found

        # Serialize the environment data
        environment_list = [
            {
                'id': str(env.id),
                'name': env.name,
                'project_id': str(env.project_id),
                'created_at': env.created_at.isoformat()  # Assuming `created_at` is a datetime field
            } 
            for env in environments
        ]

        # Return the serialized data as a JSON response
        return jsonify(environment_list)

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve environments', 'error': str(e)}), 500


@bp.route('/environment/get/<env_id>', methods=['GET'])
def get_single_env(env_id):
    try:
        # Retrieve the environment by its ID using filter_by
        env = ProjectEnvironment.query.filter_by(id=env_id).first()

        if not env:
            return jsonify({'message': 'Environment not found'}), 404

        # Create the response data
        env_data = {
            'id': str(env.id),
            'name': env.name,
            'project_id': str(env.project_id),  # Ensure project_id is a string
            'created_at': env.created_at.isoformat()  # Assuming `created_at` is a datetime field
        }

        # Return the environment data as JSON
        return jsonify(env_data)

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve environment', 'error': str(e)}), 500


@bp.route('/environment/delete/<env_id>', methods=['DELETE'])
def delete_env(env_id):
    project = ProjectEnvironment.query.get_or_404(str(env_id))
    db.session.delete(project)
    db.session.commit()

    return jsonify({'message': 'Environment deleted successfully'})

@bp.route('/environment/data-save', methods=['POST'])
def env_data_save():
    # Extract data using get_param
    env_id = get_param('environment_id')
    
    env_data = {
        "id": str(uuid.uuid4()),
        "environment_id": env_id,
        "image_name": get_param('image_name'),
        "cache": get_param('cache'),
        "platform": get_param('platform'),
        "target": get_param('target'),
        "project_id": get_param('project_id'),
        "is_registry_publish": True if get_param('is_registry_publish') == 'yes' else False,
        "registry_info": get_param('registry_info') if get_param('registry_info') else "",
        "argument_info": get_param('argument_info') if get_param('argument_info') else ""
    }

    the_env_data = ProjectEnviornmentValue.query.filter_by(environment_id=env_id).first()

    if the_env_data:
        env_data["id"] = the_env_data.id
        db.session.merge(ProjectEnviornmentValue(**env_data))
    else:
        db.session.add(ProjectEnviornmentValue(**env_data))

    # Commit changes to the database
    db.session.commit()

    # Return the project data
    return jsonify({
        "message": "saved successfully",
    })
    
@bp.route('/environment/<env_id>/get-data', methods=['GET'])
def get_env_data(env_id):
    try:
        # Retrieve the environment data by environment_id
        the_env_data = ProjectEnviornmentValue.query.filter_by(environment_id=str(env_id)).first()

        if the_env_data:
            # Convert the environment data to a dictionary
            env_data = the_env_data.as_dict()  # Ensure this method exists in the model
            return jsonify(env_data)
        else:
            # Return an empty object if no environment data is found
            return jsonify({})

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve environment data', 'error': str(e)}), 500


@bp.route('/container-registry/data-save', methods=['POST'])
def container_registry_save():
    project_id = get_param('project_id')
    registry_data = {
        "id": str(uuid.uuid4()),
        "project_id": project_id,
        "name": get_param('name'),
        "slug": get_param('slug'),
        "registry_config": get_param('registry_config')
    }
    
    exist_registry = ContainerRegistry.query.filter_by(project_id = project_id).first()
    
    if exist_registry:
        registry_data["id"] = exist_registry.id  # Preserve the original ID
        db.session.merge(ContainerRegistry(**registry_data))
    else:
        db.session.add(ContainerRegistry(**registry_data))

    # Commit changes to the database
    db.session.commit()

    # Return the project data
    return jsonify({
        "message": "saved successfully",
    })
    

@bp.route('/container-registry/get-data/<project_id>', methods=['GET'])
def get_container_registry_data(project_id):
    # Query the ProjectDockerBuild object based on the environment_id
    container_registry = ContainerRegistry.query.filter_by(project_id = project_id).first()

    if container_registry:
        # Convert the ProjectDockerBuild object to a dictionary using as_dict() method
        data = container_registry.as_dict()
        data['registry_config'] = ""
        return jsonify(data)
    else:
        return jsonify({'error': 'not found'}), 404
    
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
    elif the_type == 'supervisord':
        the_folder = os.path.join(project_path, 'the_dockman/config/supervisor')
        the_path = os.path.join(the_folder, 'supervisord.conf')
    
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
    
@bp.route('get-template-lists', methods=['GET'])
def get_template_lists():
    template_type = request.args.get('template_type')
    url = f"https://raw.githubusercontent.com/dockmandev/dockman-data-hub/main/{template_type}/{template_type}-template.json"
    response = requests.get(url)
    data = response.json()
    return data

@bp.route('get-template-content', methods=['GET'])
def get_template_content():
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

from threading import Lock
from time import sleep

threads = {}
thread_lock = Lock()
stop_background_task = {}

@bp.route('docker-build', methods=['POST'])
def docker_build():
    data = request.form
    app_user_data_path = get_param('app_user_data')
    the_socket_room_name = get_param('socket_room_name')
    image_version = get_param('image_version')
    
    # Extract project_id from the request parameters
    environment_id = get_param('environment_id')
    project_id = get_param('project_id')
    project_path = get_param('project_path')

    # Query the database for the project with the given project_id
    projectEnv = ProjectEnviornmentValue.query.filter_by(environment_id=environment_id).first()

    build_data = {
        'project_id': project_id,
        'image_name': projectEnv.image_name,
        'image_version': image_version,
        'cache': projectEnv.cache,
        'platform': projectEnv.platform,
        'target': projectEnv.target,
        'dockerfile_path': projectEnv.dockerfile_path,
        'base_path': project_path,
        'registry_info': json.loads(projectEnv.registry_info),
        'argument_info': json.loads(projectEnv.argument_info),
        'docker_socket': 'unix:///Users/code4mk/.colima/default/docker.sock'
    }

    global threads, stop_background_task
    import random
    task_key = random.randint(1, 100)
    with thread_lock:
        if task_key not in threads or not threads[task_key]['thread'].is_alive():
            from backend.app import sio, app
            threads[task_key] = {'thread': sio.start_background_task(background_task, app, task_key, app_user_data_path, build_data, the_socket_room_name, project_id)}
            stop_background_task[task_key] = False
            return f"Image building background task with key {task_key} started"
        
    return jsonify({'message': f'Docker build is ongoing'}), 200


import subprocess
def background_task(app, task_key, app_user_data_path, the_build_data, the_socket_room, project_id, is_image_push=None):
    with app.app_context():
        while not stop_background_task.get(task_key, False):
            try:
                from backend.app import sio
                sio.emit('build_started', 'started', to=the_socket_room)
                
   
                # Extract necessary information
                image_name = the_build_data['image_name']
                image_version = the_build_data['image_version']
                platform = the_build_data['platform']
                dockerfile_path = the_build_data['dockerfile_path']

                # Generate build-me.py inside base_path
                the_project_path = the_build_data['base_path']
                build_me_script_path = os.path.join(the_project_path, 'build-me.py')
                
                
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
'''.format(dockerfile_path, the_build_data['docker_socket'], platform, image_name, image_version))

                print("build-me.py generated successfully at:", build_me_script_path)

                # Set up the virtual environment path
                project_path = the_project_path
                venv_name = '.dockman_venv'
                the_user_app_data_path = app_user_data_path.replace(' ', '\ ')

                venv_path = os.path.join(the_user_app_data_path, venv_name)
                
                
                # Check if virtual environment already exists, if not, create it
                if not os.path.exists(venv_path):
                    create_venv_cmd1 = f"python3 -m venv {venv_path}"
                    subprocess.run(create_venv_cmd1, shell=True, check=True)
                    combined_cmd = f"source {venv_path}/bin/activate && pip3 install dock-craftsman chardet && python3 {project_path}/build-me.py"
                else:
                    combined_cmd = f"source {venv_path}/bin/activate && python3 {project_path}/build-me.py"

                # Run the bash script using subprocess.Popen
                process = subprocess.Popen(combined_cmd, shell=True, cwd=project_path, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                sio.emit('build_start', 'build start', to=the_socket_room)
                
                for stdout_line in iter(process.stdout.readline, b''):
                    sio.emit('message', {'message': stdout_line.decode()}, to=the_socket_room)

                for stderr_line in iter(process.stderr.readline, b''):
                    sio.emit('message', {'message': stderr_line.decode()}, to=the_socket_room)
                
                sio.emit('build_completed', 'completed', to=the_socket_room)
                
                getRegistry = ContainerRegistry.query.filter_by(project_id=project_id).first()
                the_registry_data = getRegistry.as_dict()
        
                registry_config = json.loads(the_registry_data["registry_config"])

                import docker
                the_client = docker.DockerClient(base_url="unix:///Users/code4mk/.colima/default/docker.sock")
                image = image_name
                tag = image_version
                
                if the_registry_data["slug"] == 'aws-ecr': 
                
                    aws_credentials = {
                    'aws_access_key_id': registry_config.get("publicKey"),
                    'aws_secret_access_key': registry_config.get("secretKey"),
                    'aws_region': the_build_data["registry_info"].get("aws_region")
                    }
                
                    ecr_url = the_build_data["registry_info"].get("ecr_url")
                
                    ecr_push(
                        aws_credentials=aws_credentials,
                        ecr_url=ecr_url,
                        image=image,
                        tag=tag,
                        the_docker_client=the_client,
                        sio=sio,
                        the_socket_room=the_socket_room
                        )
                
                stop_background_task[task_key] = True

            except Exception as e:
                stop_background_task[task_key] = True
                print(f"Error occurred while building Docker image: {e}")
                
            sleep(1)

def ecr_push(sio, the_socket_room, aws_credentials, the_docker_client, ecr_url, image, tag):
    """
    Pushes a Docker image to Amazon ECR with real-time status updates via Socket.IO.
    
    Parameters:
    - sio: Socket.IO server instance.
    - the_socket_room: The room to send updates to.
    - aws_credentials: A dictionary with keys 'aws_access_key_id', 'aws_secret_access_key', and 'aws_region'.
    - ecr_url: The URL of the ECR repository.
    - image: The name of the Docker image to push.
    - tag: The tag of the Docker image to push.
    """
    AWS_ACCESS_KEY_ID = aws_credentials['aws_access_key_id']
    AWS_SECRET_ACCESS_KEY = aws_credentials['aws_secret_access_key']
    AWS_DEFAULT_REGION = aws_credentials['aws_region']
    ECR_URL = ecr_url
    IMAGE_NAME = image
    IMAGE_TAG = tag

    # Set up AWS session
    session = boto3.Session(
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_DEFAULT_REGION,
    )

    ecr_client = session.client('ecr')

    #Get ECR login token
    auth_token = ecr_client.get_authorization_token()
    username, password = base64.b64decode(auth_token['authorizationData'][0]['authorizationToken']).decode().split(':')
    proxy_endpoint = auth_token['authorizationData'][0]['proxyEndpoint']
    
    # Set up Docker client
    client = the_docker_client

    # Log in to Docker with ECR credentials
    client.login(username=username, password=password, registry=proxy_endpoint)
    
    # Tag the Docker image
    full_image_name = f"{ECR_URL}/{IMAGE_NAME}:{IMAGE_TAG}"
    client.images.get(f"{IMAGE_NAME}:{IMAGE_TAG}").tag(full_image_name)

    # Push the Docker image to ECR with status updates
    sio.emit('push_started', {'message': 'started'}, to=the_socket_room)
    push_logs = client.images.push(full_image_name, stream=True, decode=True)

    for log in push_logs:
        if 'status' in log:
            status_message = log['status']
            detail_message = log.get('id', '') + ': ' + status_message
            sio.emit('push_status', {'message': detail_message}, room=the_socket_room)

    sio.emit('push_complete', {'message': 'Docker image pushed to ECR successfully'}, room=the_socket_room)
    print("Docker image pushed to ECR successfully")

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
