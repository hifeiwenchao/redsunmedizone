'''
Created on 2016年3月13日

@author: root
'''
from django.core.management.base import BaseCommand
from crm.fetch_email import FetchMail
import logging
from crm.models import EmailAccount, Customer, Email

class Command(BaseCommand):
    
    def add_arguments(self, parser):
        parser.add_argument('--receive',action='store_true',dest = 'receive',default = False,help = 'receive')
        parser.add_argument('--send',action='store_true',dest = 'send',default = False,help = 'send')
        parser.add_argument('--inbox',action='store_true',dest = 'inbox',default = False,help = 'inbox')
        parser.add_argument('--history',action='store_true',dest = 'history',default = False,help = 'history')
    
    def handle(self,*args,**options):
        if options['receive']:
            objs = Customer.objects.all()
            for item in objs:
                item.name = (item.name).upper()
                print(item.name)
                item.save()
                    
    '''    
        if options['send']:
            email = EmailAccount.objects.filter(address__contains = 'matt@heershi.com.cn').first()
            obj = FetchMail(email.imap,email.address, email.password)
            obj.fetch_email_by_folder({'folder':'&XfJT0ZAB-'},True,'发件箱')
        
        if options['inbox']:
            email = EmailAccount.objects.filter(address__contains = 'info@heershi.com.cn').first()
            obj = FetchMail(email.imap,email.address, email.password)
            obj.fetch_email_by_folder({'folder':'INBOX'},False,'收件箱')
        
        if options['history']:
            objs = Customer.objects.all()
            for item in objs:
                email = item.email.strip()
                email = [e.strip().strip(',') for e in email.split('\n')]
                print(email)
                for each in email:
                    if each.strip() == '':continue
                    sql = 'select id,subject,sent_from,send_to,send_cc,content from email where concat(subject,sent_from,send_to,send_cc,content) like "%%'+each+'%%"'
                    emails = Email.objects.raw(sql)
                    emails = [e_obj for e_obj in emails]
                    
                    if len(emails) !=0:
                        item.history = 1
                item.save()
    '''        
                
                
                
            
            
            
            
            
            
