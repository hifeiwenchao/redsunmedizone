'''
Created on 2016年2月9日

@author: root
'''
from __future__ import absolute_import
from celery import shared_task
from imbox import Imbox
import os
import logging
import time
import random
from django.conf import settings
from mail.utils import SendEmail
from crm.models import EmailAccount, EmailSubjectTemplate, EmailBodyTemplate,\
    Email, Attachment, Customer, EmailTask, EmailTaskDetail, EmailLog
import datetime

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
            mail_handler.send_email(account.address, process_obj.send_to, None, process_obj.subject,process_obj.content, [])
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
    if settings.DEBUG:
        path = settings.STATIC_ROOT +'/static/attachment/'
    else:
        path = settings.STATIC_ROOT +'/attachment/'
    log = logging.getLogger('fetch')
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    log.info('邮件%s抓取邮件,时间为%s' % (obj.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
    imbox = Imbox(obj.imap,obj.address,obj.password,ssl=False)
    all_messages = imbox.messages(unread=True)
    for uid,email in all_messages:
        log.info('抓取邮件uid为%s,时间为%s' % (uid.decode(),time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
        data_uid = '%s' % (datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')[:-4])
        temp = {}
        temp.__setitem__('uid', data_uid)
        try:
            temp.__setitem__('sent_from', '%s' % email.sent_from)
        except Exception as e:
            pass
        try:
            temp.__setitem__('send_to','%s' % email.sent_to)
        except Exception as e:
            pass
        try:
            temp.__setitem__('send_cc','%s' %  email.sent_cc)
        except Exception as e:
            pass
        try:
            temp.__setitem__('subject',('%s' %  email.subject).replace('\n',",").replace('\r',''))
        except Exception as e:
            pass
        try:
            temp.__setitem__('server_id','%s' %  email.message_id)
        except Exception as e:
            pass
        try:
            temp.__setitem__('date','%s' %  email.parsed_date)
        except Exception as e:
            pass
        
        temp.__setitem__('status',1)
        temp.__setitem__('type',0)
        temp.__setitem__('read',0)
        try:
            temp.__setitem__('content', email.body['html'][0].decode('utf-8'))
        except Exception as e:
            try:
                temp.__setitem__('content', '%s' % email.body['html'][0])
            except:
                temp.__setitem__('content', '%s' % email.body['plain'][0])
            
        cs_obj = Customer.objects.filter(email__contains = email.sent_from[0]['email']).first()
        if cs_obj !=None:
            cs_obj.history = 1
            cs_obj.save()
            temp.__setitem__('customer_id', cs_obj.id)
        temp.__setitem__('create_time',int(time.time()))
        Email.objects.create(**temp)
        
        try:
            os.mkdir(path+data_uid)
        except Exception as e:
            pass
        
        if len(email.attachments) != 0:
            log.info('有附件,开始抓取附件')
            for att in email.attachments:
                file_name =  att.get('filename').strip('"') if att.get('filename') else 'nonename%s' % time.time()
                file_name = 'nonename%s' % time.time() if file_name.strip() == '' else file_name
                log.info('附件名字为%s,大小为%s' % (file_name,att['size']))
                Attachment.objects.create(create_time = int(time.time(  )),content_id = str(att.get('content_id')).strip().strip('<').strip('>')
                                              ,size = att['size'],email_id = data_uid,file_name = file_name,path='/static/attachment/'+data_uid+'/%s' % file_name)
                file_object = open(path+data_uid+'/%s' % file_name, 'wb')
                file_object.write(att['content'].getvalue())
                file_object.close()
                
        imbox.mark_seen(uid)
        
    imbox.logout()
    log.info('邮箱%s抓取完毕 ,时间为%s' % (obj.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    
    

    
    
    
    
    