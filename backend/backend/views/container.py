# myapp/views/home.py

from flask import Blueprint, jsonify

bp = Blueprint('container', __name__)

@bp.route('/', methods=['get'])
def lists():
    return jsonify({'name': 'kamal container', 'age': '28'})
