from flask import Blueprint, request, jsonify, g
from backend.models import db
from backend.models.project import Project

bp = Blueprint('project', __name__)

@bp.route('/create', methods=['POST'])
def create_project():
    # Extract data from form-data
    name = request.form.get('name')
    project_path = request.form.get('project_path')
    template_name = request.form.get('template_name')
    dockerfile_path = request.form.get('dockerfile_path')

    # Create a new Project instance
    new_project = Project(
        name=name,
        project_path=project_path,
        template_name=template_name,
        dockerfile_path=dockerfile_path
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
            'template_name': added_project.template_name,
            'dockerfile_path': added_project.dockerfile_path
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
    return jsonify({'projects': project_list})

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