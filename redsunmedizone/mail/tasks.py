'''
Created on 2016年2月9日

@author: root
'''
from __future__ import absolute_import
from celery import shared_task
import os
import logging
import time
import email.utils as e_utils
from datetime import datetime
from django.conf import settings
from mail.utils import SendEmail
from crm.models import EmailAccount,Email, Attachment, Customer, EmailTask, EmailTaskDetail
import re
import imapy
from imapy.query_builder import Q

#fetch_email.apply_async(countdown=10,retry=False)
#celery -A mail worker -B -l info
    
@shared_task
def process_task():
    log = logging.getLogger('task')
    log.info('执行发送邮件任务主程序')
    objs = EmailTask.objects.filter(status = 1).all()
    for obj in objs:
        process_task_detail.delay(obj)
    log.info('执行完毕')
    
@shared_task
def process_task_detail(obj):
    log = logging.getLogger('task')
    
    interval_second = obj.interval * 60
    
    process_obj = EmailTaskDetail.objects.filter(email_task_id = obj.id,status = 0,update_time__lt = int(time.time())).first()
    process_objs = EmailTaskDetail.objects.filter(email_task_id = obj.id,status = 0).all()
    if process_obj == None and len(process_objs) == 0:
        log.info('任务执行完毕,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
        obj.status = 2
        obj.save()
    else:
        if process_obj == None:return
        log.info('开始时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
        account = EmailAccount.objects.filter(id = process_obj.email_account_id).first()
        process_obj.status = 1
        process_obj.save()     
        EmailTaskDetail.objects.filter(email_task_id = obj.id,status = 0).update(update_time = int(time.time())+interval_second)
        mail_handler = SendEmail()
        mail_handler.set_info(account.smtp,account.address,account.password)
        log.info('发件人%s,收件人%s,' % (account.address, process_obj.send_to) )
        try:
            mail_handler.send_email(account.address, process_obj.send_to, None, process_obj.subject,process_obj.content,eval(process_obj.atts) if process_obj.atts != '' else [])
            process_obj.result = 0
            #process_obj.status = 1
            process_obj.process_time = int(time.time())
            process_obj.save()
            log.info('执行成功,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
        except Exception as e:
            process_obj.result = 1
            #process_obj.status = 1
            process_obj.info = str(e)
            process_obj.process_time = int(time.time())
            process_obj.save()
            log.info('执行失败,%s,信息:%s' % (time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())),str(e)))
        mail_handler.logout()
        
        #EmailTaskDetail.objects.filter(email_task_id = obj.id,status =0).update(update_time = int(time.time())+interval_second)
    
    
    
@shared_task
def main_fetch_email():
    log = logging.getLogger('fetch')
    log.info('执行抓取邮件主程序')
    objs = EmailAccount.objects.filter(status = 1).all()
    for obj in objs:
        fetch_email.delay(obj)
    
    
    
    
@shared_task
def fetch_email(obj):
    
    log = logging.getLogger('fetch')
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    log.info('邮件%s抓取邮件,时间为%s' % (obj.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
    
    #['INBOX' 'REDSUN测试邮件','已发送',]
    box = imapy.connect(host=obj.imap,username=obj.address,password=obj.password,ssl=False)
    q = Q()
    emails = box.folder('INBOX').emails(q.unseen())
    save_email(emails,'')
    box.logout()
    log.info('邮箱%s抓取完毕 ,时间为%s' % (obj.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
    
    
def save_email(emails,item):
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
        
        temp.__setitem__('status',1)
        temp.__setitem__('type',0)
        temp.__setitem__('read',0)
        
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
        email.mark('Seen')
    
    