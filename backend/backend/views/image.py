
from flask import Blueprint, jsonify
from dock_craftsman.docker.image import TheImage

bp = Blueprint('image', __name__)

@bp.route('/', methods=['get'])
def lists():
    image = TheImage(docker_socket="unix:///Users/code4mk/.colima/default/docker.sock")
    query_params = {'status': 'all', 'date_sort': 'asc'}

    the_response = image.get_lists(query=query_params)
    return jsonify({'data': the_response})