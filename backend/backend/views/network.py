
from flask import Blueprint, jsonify
from dock_craftsman.docker.network import TheNetwork

bp = Blueprint('network', __name__)

@bp.route('/', methods=['get'])
def lists():
    network = TheNetwork(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")

    the_response = network.get_lists()
    return jsonify({'data': the_response})