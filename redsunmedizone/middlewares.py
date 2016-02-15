from django.http.response import HttpResponseRedirect



# 中间件,即filter,同tomcat filter
class AppclicationMiddleware(object):
    def process_request(self, request):
        if request.path == '/':
            return 
        
        if request.session.__contains__('username') == None:
            return HttpResponseRedirect('/')
        
    def process_response(self, request, response):
        # static = [404,403,405,500]
        static = []
        if response.status_code in static:
            return HttpResponseRedirect('/404.html')
        else:
            return response
            
