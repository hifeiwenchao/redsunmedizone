'''
Created on 2016年2月1日

@author: root
'''
from imbox import Imbox
import re
import imaplib
from django.conf import settings
import time
import os
from crm.models import Customer, Email, Attachment
import datetime
imaplib._MAXLINE = 40000

#'imap.alibaba.com','matt@heershi.com.cn', 'hlj52764892'
class FetchMail(object):
    
    def __init__(self,imap,user,passsword):
        self.imap = imap
        self.user = user
        self.password = passsword
        
    def decode_content(self,message):
        try:
            content = message.get_payload(decode=True)
            charset = message.get_content_charset('utf-8')
            if charset != 'utf-8':
                return content.decode(charset)
            return content
        except Exception:
            return 'Could not parse content'
        
    def folder_dict_all(self,receive = None):
        eliminate = ['INBOX','草稿','已删除邮件','REDSUN测试邮件','垃圾邮件','已发送']
        list_pattern = re.compile(r'\((?P<flags>.*?)\) "(?P<delimiter>.*)" (?P<name>.*)')
        obj = imaplib.IMAP4(self.imap)
        obj.login(self.user, self.password)
        type_,folders = obj.list()
        receive_box = {}
        send_box = {}
        for folder in folders:
            try:
                flags, delimiter, folder_name = list_pattern.match(folder.decode()).groups()
                folder_name = folder_name.strip('"')
                if folder_name.replace('&', '+').replace(',', '/').encode('utf8').decode('utf7') in eliminate:
                    send_box.__setitem__(folder_name.replace('&', '+').replace(',', '/').encode('utf8').decode('utf7'),folder_name)
                else:
                    receive_box.__setitem__(folder_name.replace('&', '+').replace(',', '/').encode('utf8').decode('utf7'),folder_name)
            except BaseException as e:
                print("[-] Parse folder {0} failed: {1}".format(folder, e))
                continue
        obj.logout()
        if receive:
            return receive_box
        else:
            return send_box
        
    def fetch_email_by_folder(self,folder,send,remark):
        if settings.DEBUG:
            path = settings.STATIC_ROOT +'/static/attachment/'
        else:
            path = settings.STATIC_ROOT +'/attachment/'
        print('文件夹为%s抓取邮件,时间为%s' % (folder,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
        imbox = Imbox(self.imap,self.user,self.password,ssl=False)
        all_emails = imbox.messages(**folder)
        for uid, email in all_emails:
            uid = '%s' % (datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')[:-4])
            print('抓取邮件uid为%s,时间为%s' % (uid,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
            temp = {}
            temp.__setitem__('uid', uid)
            try:
                temp.__setitem__('sent_from', '%s' % email.sent_from)
            except Exception as e:
                temp.__setitem__('sent_from','')
            try:
                temp.__setitem__('send_to','%s' % email.sent_to)
            except Exception as e:
                temp.__setitem__('send_to','')
            try:
                temp.__setitem__('send_cc','%s' %  email.sent_cc)
            except Exception as e:
                temp.__setitem__('send_cc','')
            try:
                temp.__setitem__('subject',('%s' %  email.subject).replace('\n',",").replace('\r',''))
            except Exception as e:
                temp.__setitem__('subject','')
            try:
                temp.__setitem__('server_id','%s' %  email.message_id)
            except Exception as e:
                temp.__setitem__('server_id','')
            try:
                temp.__setitem__('date','%s' %  email.parsed_date)
            except Exception as e:
                temp.__setitem__('date','')
            if send:
                temp.__setitem__('status',2)
            else:
                temp.__setitem__('status',1)
            temp.__setitem__('type',0)
            temp.__setitem__('read',1)
            try:
                temp.__setitem__('content', str(email.body['html'][0].decode('utf-8')))
            except Exception as e:
                try:
                    temp.__setitem__('content', '%s' % email.body['html'][0])
                except:
                    temp.__setitem__('content', '%s' % email.body['plain'][0])
            temp.__setitem__('remark',remark)
            cs_obj = Customer.objects.filter(email__contains = email.sent_from[0]['email']).first()
            if cs_obj !=None:
                cs_obj.history = 1
                cs_obj.save()
                temp.__setitem__('customer_id', cs_obj.id)
            temp.__setitem__('create_time',int(time.time()))
            Email.objects.create(**temp)
            
            try:
                os.mkdir(path+uid)
            except Exception as e:
                pass
            
            if len(email.attachments) != 0:
                print('有附件,开始抓取附件')
                for att in email.attachments:
                    file_name =  att.get('filename').strip('"') if att.get('filename') else 'nonename%s' % time.time()
                    file_name = 'nonename%s' % time.time() if file_name.strip() == '' else file_name
                    print('附件名字为%s,大小为%s' % (file_name,att['size']))
                    Attachment.objects.create(create_time = int(time.time(  )),content_id = str(att.get('content_id')).strip().strip('<').strip('>')
                                              ,size = att['size'],email_id = uid,file_name = file_name,path='/static/attachment/'+uid+'/%s' % file_name)
                    file_object = open(path+uid+'/%s' % file_name, 'wb')
                    file_object.write(att['content'].getvalue())
                    file_object.close()
          
        imbox.logout()
        

    









