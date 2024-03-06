@bp.route('/get-all-dockerfiles-raw/<int:project_id>', methods=['GET'])
def get_all_dockerfiles_raw(project_id):
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
                    parsed_data = dockerfile.data
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

    
    # from dock_craftsman.dockerfile_generator import DockerfileGenerator
    # # Instantiate the DockerfileGenerator
    # dockerfile = DockerfileGenerator()

    # Loop through the provided data and generate Python code
    # for dockerfile_data in dockerfile_list:
    #     dockerfile.stage(dockerfile_data["stage"])
    #     for dockerfile_command in dockerfile_data["dockerfiles"]:
    #         method = dockerfile_command["method"]
    #         if method == "from_":
    #             dockerfile.from_(dockerfile_command["data"])                
    #         elif method == "env":
    #             for env_data in dockerfile_command["data"]:
    #                 dockerfile.env(env_data["key"], env_data["value"])
    #         elif method == "apt_install":
    #             dockerfile.apt_install(dockerfile_command["data"])
    #         elif method == "run":
    #             dockerfile.run(dockerfile_command["data"])
    #         elif method == "workdir":
    #             dockerfile.workdir(dockerfile_command["data"])
    #         elif method == "expose":
    #             dockerfile.expose(dockerfile_command["data"])
    #         elif method == "cmd":
    #             dockerfile.cmd(dockerfile_command["data"])
            # Add more conditions for other methods if needed

    # Get the content of the generated Dockerfile
    # generated_dockerfile = dockerfile.get_content()
    return jsonify({'data': dockerfile_list}) 