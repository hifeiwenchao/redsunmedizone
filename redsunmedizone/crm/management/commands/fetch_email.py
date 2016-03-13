'''
Created on 2016年3月13日

@author: root
'''
from django.core.management.base import BaseCommand
from crm.fetch_email import FetchMail
import logging
from crm.models import EmailAccount

class Command(BaseCommand):
    
    def add_arguments(self, parser):
        parser.add_argument('--receive',action='store_true',dest = 'receive',default = False,help = 'receive')
        parser.add_argument('--send',action='store_true',dest = 'send',default = False,help = 'send')
    def handle(self,*args,**options):
        if options['receive']:
            email = EmailAccount.objects.filter(address__contains = 'matt@heershi.com.cn').first()
            obj = FetchMail(email.imap,email.address, email.password)
            all_folder = obj.folder_dict_all(True)
            log = logging.getLogger('fetch')
            for key,value in all_folder.items():
                print('文件夹中文名为:%s  ,  utf7查询名为:%s' %(key,value))
                try:
                    obj.fetch_email_by_folder({'folder':value},None,key)
                except Exception as e :
                    log.info('异常!!!!!!!!!!%s!!!!!!!!!!!!!!!!!!!!!!%s' % (key,e))
        
        if options['send']:
            obj = FetchMail('imap.alibaba.com','matt@heershi.com.cn', 'hlj52764892')
            obj.fetch_email_by_folder({'folder':'&XfJT0ZAB-'},True,'发件箱')