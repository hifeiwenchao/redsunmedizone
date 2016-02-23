'''
Created on 2016年2月9日

@author: root
'''
from __future__ import absolute_import
from celery import shared_task
import logging
import time
import random
from mail.utils import SendEmail
from crm.models import EmailAccount, EmailSubjectTemplate, EmailBodyTemplate,\
    Email, Attachment, Customer
from imbox import Imbox
from django.conf import settings
import os

#fetch_email.apply_async(countdown=10,retry=False)
#celery -A mail worker -B -l info
@shared_task
def fetch_email():
    if settings.DEBUG:
        path = settings.STATIC_ROOT +'/static/attachment/'
    else:
        path = settings.STATIC_ROOT +'/attachment/'
    log = logging.getLogger('django')
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    objs = EmailAccount.objects.filter(status = 1).all()
    for item in objs:
        log.info('邮件%s抓取邮件,时间为%s' % (item.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
        imbox = Imbox(item.imap,item.address,item.password,ssl=True)
        all_messages = imbox.messages(unread=True)
        for uid,email in all_messages:
            log.info('抓取邮件uid为%s,时间为%s' % (uid.decode(),time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
            temp = {}
            temp.__setitem__('uid', uid.decode())
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
                temp.__setitem__('subject','%s' %  email.subject)
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
                temp.__setitem__('content', email.body['html'][0])
            cs_obj = Customer.objects.filter(email__contains = email.sent_from[0]['email']).first()
            if cs_obj !=None:
                temp.__setitem__('customer_id', cs_obj.id)
            temp.__setitem__('create_time',int(time.time()))
            Email.objects.create(**temp)
            
            try:
                os.mkdir(path+uid.decode())
            except Exception as e:
                pass
            
            if len(email.attachments) != 0:
                log.info('有附件,开始抓取附件')
                for att in email.attachments:
                    log.info('附件名字为%s,大小为%s' % (att['filename'].strip('"'),att['size']))
                    Attachment.objects.create(create_time = int(time.time(  )),size = att['size'],email_id = uid.decode(),file_name = att['filename'].strip('"'),path='/static/attachment/'+uid.decode('utf-8')+'/%s' % att['filename'].strip('"'))
                    file_object = open(path+uid.decode('utf-8')+'/%s' % att['filename'].strip('"'), 'wb')
                    file_object.write(att['content'].getvalue())
                    file_object.close()
                    
            
            
        imbox.logout()
        log.info('邮箱%s抓取完毕 ,时间为%s' % (item.address,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
    
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    
    
@shared_task
def process_task():
    '''
    send_tos = ['matt0503@163.com','501180920@qq.com','matt@heershi.com.cn','yangyun0602@126.com']
    
    log = logging.getLogger('django')
    send_froms = EmailAccount.objects.all()
    subjects = EmailSubjectTemplate.objects.all()
    bodys = EmailBodyTemplate.objects.all()
    
    
    send_from = send_froms[random.randint(0,len(send_froms)-1)]
    send_to = send_tos[random.randint(0,len(send_tos)-1)]
    subject = subjects[random.randint(0,len(subjects)-1)]
    body = bodys[random.randint(0,len(bodys)-1)]
    
    
    print(send_from.smtp,send_from.address,send_from.password,send_to)
    print(subject.content,body.content)
    
    
    obj = SendEmail()
    obj.set_info(send_from.smtp,send_from.address,send_from.password)
    obj.send_email(send_from.address,send_to, None, subject.content,body.content, [])
    obj.logout()
    
    
    log.info('发送成功,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    '''
    
    
    
    
    
    

    

    
    
    
    
    