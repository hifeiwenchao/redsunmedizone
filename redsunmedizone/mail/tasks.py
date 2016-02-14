'''
Created on 2016年2月9日

@author: root
'''
from __future__ import absolute_import
from celery import shared_task
import logging
import time
from mail.models import *
from mail.utils import send_mail



demo1= '''
<div>This is Matt Hou from RED SUN MEDI ZONE HK. Please allow me introduce our company to you.</div><div>RED SUN MEDI ZONE HK is one of the professional dealer in medical equipments in Hongkong.</div><div>We have 3 years experience in cooperating with best chinese factories.Which are focusing on Patient Monitor/Anesthesia Machine/Medical Nebulizer/Oxygen Concentrator/Suction Apparatus/Delivery Bed for decades.</div><div>All goods are coming with certifications(ISO and CE).And we have a special team work for after-sale-service 7/24.Service is our major.</div><div>We willing for sign contract with you in case you need it. Trust is the priority to us.</div><div>TIME IS GOLD for you and us.Normally we can deliver your goods within 5-7 days with perfect quality for small quantity.</div><div>We can ship goods with sea/air/express(DHL and TNT).</div><div>QUALITY IS OUR CULTURE.We foucs on high quality products with suitable prices.</div><div>Please check our website for more information of products. Feel free to contact if you interesting in anyone of them.</div><div>Our website: www.redsunmedizone.com</div><div>Wish to have business with you in near future. Paypal is available.</div><div>Looking forward to hear from you.</div><div>Best regards</div>
'''








#celery -A mail worker -B -l info
@shared_task
def test():
    log = logging.getLogger('django')
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    '''
    imbox = Imbox('imap.redsunmedizone.com','matt@redsunmedizone.com', 'hlj52764892',ssl=True)
    all_messages = imbox.messages()
    for uid, message in all_messages:
        log.info('uid:%s , msg_id:%s , send_from:%s , sned:%s_to' % (uid,message.message_id,message.sent_from,message.sent_to))
    '''
    log.info('测试发送邮件1')
    send_mail('matt@redsunmedizone.com', 'hlj52764892', 'matt@redsunmedizone.com', 'info@redsunmedizone.com','test1 %s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())), demo1, [],True)
    log.info('测试发送邮件2')
    #send_mail('matt@redsunmedizone.com', 'hlj52764892', 'matt@redsunmedizone.com', 'info@redsunmedizone.com','test2 %s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())), demo2, [],True)
    
    log.info('当前时间,%s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())))
    
    
    
    

    

    
    
    
    
    