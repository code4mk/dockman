
from flask import Blueprint, jsonify
from dock_craftsman.docker.volume import TheVolume

bp = Blueprint('volume', __name__)

@bp.route('/', methods=['get'])
def lists():
    volume = TheVolume(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")

    the_response = volume.get_lists()
    return jsonify({'data': the_response})