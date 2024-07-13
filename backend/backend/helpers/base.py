from flask import request, jsonify

def get_param(key=None):
    """
    Retrieve a parameter value from form data, query string, or JSON body.
    
    Args:
    - key (str): Optional parameter key to retrieve. If None, returns all parameters.
    
    Returns:
    - The parameter value if found, otherwise None.
    """
    data = {}

    # Check request.form for form data
    data.update(request.form)

    # Check request.args for query string parameters
    data.update(request.args)

    # Check if the request has JSON data
    if request.is_json:
        data.update(request.json)

    # Return specific key if provided, otherwise return all data
    if key:
        return data.get(key)
    else:
        return data
