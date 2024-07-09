from flask import request

def get_param(key, default=None):
    """
    Retrieve a parameter value from form data, query string, or other sources.
    
    Args:
    - key (str): The parameter key to retrieve.
    - default: The default value to return if the parameter is not found.
    
    Returns:
    - The parameter value if found, otherwise the default value.
    """
    value = request.form.get(key)
    if value is None:
        value = request.args.get(key)
    if value is None:
        value = default
    return value