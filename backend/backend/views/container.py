# myapp/views/home.py

from flask import Blueprint, jsonify
from dock_craftsman.docker.container import TheContainer

bp = Blueprint('container', __name__)

@bp.route('/', methods=['get'])
def lists():
    container = TheContainer(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    the_list = container.get_lists()
    print(str(the_list))
    return jsonify({'data': the_list})
