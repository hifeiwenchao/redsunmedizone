'''
Created on 2016年2月1日

@author: root
'''
from datetime import datetime
import imaplib
from django.conf import settings
import time
import os
from crm.models import Customer, Email, Attachment
import imapy
import email.utils as e_utils
from imapy.query_builder import Q
import re
imaplib._MAXLINE = 40000

class FetchMail(object):
    
    def __init__(self,imap,user,passsword):
        self.imap = imap
        self.user = user
        self.password = passsword
        
    def fetch_email_by_folder(self,send):
        #['INBOX' 'REDSUN测试邮件','已发送',]
        box = imapy.connect(host=self.imap,username=self.user,password=self.password,ssl=False)
        #q = Q()
        for item in ['已发送']: 
            print('文件夹为%s抓取邮件,时间为%s' % (item,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
            status = box.folder(item).info()
            total = status['total']
            for i in range(total+10):
                if (i+1)<1995:
                    continue
                print('抓取第:%s封邮件' % (i+1))
                emails = box.folder(item).emails(i+1,i+1)
                if isinstance(emails,bool) :continue
                self.save_email(emails,send,item)
        box.logout()

    def save_email(self,emails,send,item):
        if settings.DEBUG:
            path = settings.STATIC_ROOT +'/static/attachment/'
        else:
            path = settings.STATIC_ROOT +'/attachment/'
        for email in emails:
            uid = '%s' % (datetime.now().strftime('%Y%m%d%H%M%S%f')[2:])
            print('抓取邮件uid为%s,时间为%s' % (uid,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
            temp = {}
            temp.__setitem__('uid', uid)
            temp.__setitem__('headers','%s' % email['headers'])
            temp.__setitem__('from_whom','%s' % email['from_whom'])
            temp.__setitem__('sent_from','%s' % email['from_email'])
            temp.__setitem__('to','%s' % email['to'])
            try:
                match = re.findall(r'[\w\.-]+@[\w\.-]+',email['to'])
                temp.__setitem__('send_to','%s' % ';'.join(match))
            except Exception:
                temp.__setitem__('send_to','%s' % email['to'])
            temp.__setitem__('send_cc','%s' % email['cc'])
            temp.__setitem__('subject','%s' % email['subject'])
            temp.__setitem__('date','%s' % email['date'])
            timetuple = e_utils.parsedate(temp['date'])
            try:
                temp.__setitem__('format_date','%s' % datetime.fromtimestamp(time.mktime(timetuple)))
            except Exception:
                temp.__setitem__('format_date',temp.get('date'))
            if len(email['text']) != 0:
                temp.__setitem__('content','' if email.get('text')[0].get('text') == None else email.get('text')[0].get('text'))
                temp.__setitem__('content_normalized', '' if email.get('text')[0].get('text_normalized') == None else email.get('text')[0].get('text_normalized'))
            if len(email['html']) != 0:
                temp.__setitem__('content_html', email['html'][0])
            temp.__setitem__('uid', uid)
            temp.__setitem__('create_time',int(time.time()))
            
            if send:
                temp.__setitem__('status',2)
            else:
                temp.__setitem__('status',1)
            temp.__setitem__('type',0)
            temp.__setitem__('read',1)
            
            temp.__setitem__('remark',item)
            cs_obj = Customer.objects.filter(email__contains = temp['sent_from']).first()
            if cs_obj !=None:
                cs_obj.history = 1
                cs_obj.save()
                temp.__setitem__('customer_id', cs_obj.id)
            temp.__setitem__('create_time',int(time.time()))
            Email.objects.create(**temp)
            
            if len(email['attachments']) != 0:
                try:
                    os.mkdir(path+uid)
                except Exception :
                    pass
                for attachment in email['attachments']:
                    file_name = attachment['filename']
                    content_type = attachment['content_type']
                    content_id = attachment['content_id']
                    data = attachment['data']
                    if data == None:continue
                    print('附件名字为%s' % file_name)
                    Attachment.objects.create(create_time = int(time.time(  )),content_id = str(content_id).strip().strip('<').strip('>')
                            ,content_type = content_type,email_id = uid,file_name = file_name,path='/static/attachment/'+uid+'/%s' % file_name)
                    with open(path+uid+'/%s' % file_name, 'wb') as f:
                        f.write(data)






