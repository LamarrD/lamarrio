def lambda_handler(event, context):
    request = event['Records'][0]['cf']['request']
    uri = request['uri']

    if uri == '/':
        # turns "/" to "/index.html"
        request['uri'] += 'index.html'
    elif uri.endswith('/'):
        # turns "/foo/" to "/foo.html"
        request['uri'] = uri[:-1] + '.html'
    elif '.' not in uri:
        # turns "/foo" to "/foo.html"
        request['uri'] += '.html'
    return request