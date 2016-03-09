'''
Created on 2016年3月8日

@author: root
'''
import time
import logging
from functools import wraps
from django.http.response import HttpResponse

class ExceptionHandler(object):
    
    def __init__(self,request,e):
        self.logger = self.get_logger()
        self.exception_info = e
        self.request = request
        
    def write_log(self):
        path = self.request.path
        now_time = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))
        user = self.request.session.get('username')
        self.logger.info('################----------------------------------------异常情况----------------------------------------################')
        if self.request.method =='POST':
            self.logger.info('用户 %s ,POST请求参数 %s ,请求路径 %s ,请求时间 %s ,Exception信息: %s' % (user,self.request.POST.dict(),path,now_time,self.exception_info))
        if self.request.method =='GET':
            self.logger.info('用户 %s ,GET请求参数 %s ,请求路径 %s,请求时间 %s ,Exception信息: %s' % (user,self.request.GET.dict(),path,now_time,self.exception_info))
        self.logger.info('################----------------------------------------异常情况----------------------------------------################')
    def get_logger(self):
        return logging.getLogger('exception')
    
    
#不带参数装饰器
def exception_logger(func):  
    """ 
    异常输出日志,方便调试
    """
    @wraps(func)  
    def wrapper(request, *args, **kwargs):
        try:
            return func(request, *args, **kwargs)  
        except Exception as e:
            obj = ExceptionHandler(request,e)
            obj.write_log()
            return HttpResponse(status=500)
    return wrapper  