# myapp/views/home.py

from flask import Blueprint, jsonify
from dock_craftsman.docker.container import TheContainer

bp = Blueprint('container', __name__)

@bp.route('/', methods=['get'])
def lists():
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_response = container.get_lists()
    return jsonify({'data': the_response})

@bp.route('/logs/<container_id>', methods=['get'])
def logs(container_id):
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_response = container.logs(container_id)
    return jsonify({'data': the_response})

@bp.route('/stop/<container_id>', methods=['get'])
def stop(container_id):
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_response = container.stop(container_id)
    return jsonify({'data': the_response})

@bp.route('/start/<container_id>', methods=['get'])
def start(container_id):
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_response = container.start(container_id)
    return jsonify({'data': the_response})

@bp.route('/remove/<container_id>', methods=['get'])
def remove(container_id):
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_response = container.remove(container_id)
    return jsonify({'data': the_response})
