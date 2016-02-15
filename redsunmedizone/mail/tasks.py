'''
Created on 2016年2月9日

@author: root
'''
from __future__ import absolute_import
from celery import shared_task
import logging
import time
from mail.models import *
from imapclient.imapclient import IMAPClient

#fetch_email.apply_async(countdown=10,retry=False)
#celery -A mail worker -B -l info
@shared_task
def fetch_email():
    
    print('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    '''
    client = IMAPClient('imap.alibaba.com',ssl=False)
    client.login('matt@heershi.com.cn', 'as501180920')
    folders_list = client.list_folders()
    for item in folders_list:
        print(item[2])
    
    client.logout()
    
    log = logging.getLogger('django')
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    
    imbox = Imbox('imap.redsunmedizone.com','matt@redsunmedizone.com', 'hlj52764892',ssl=True)
    all_messages = imbox.messages()
    for uid, message in all_messages:
        log.info('uid:%s , msg_id:%s , send_from:%s , sned:%s_to' % (uid,message.message_id,message.sent_from,message.sent_to))
    
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    '''
    
    
    

    

    
    
    
    
    