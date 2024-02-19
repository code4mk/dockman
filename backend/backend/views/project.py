# myapp/views/home.py

from flask import Blueprint, jsonify

bp = Blueprint('project', __name__)

@bp.route('/', methods=['get'])
def lists():
    return jsonify({'name': 'kamal', 'age': '28'})
