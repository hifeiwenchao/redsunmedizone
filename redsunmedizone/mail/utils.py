'''
Created on 2016年2月14日

@author: root
'''
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
class SendEmail(object):
    
    #发送邮件初始化
    def __init__(self):
        self.server = smtplib.SMTP()
        
    #以set_info的形式来创建对象设置信息发送,可循环
    def set_info(self,smtp,username,password):
        self.server.connect(smtp)
        self.server.login(username, password)
        
    def send_email(self,from_addr=None, to_addr=None,cc=None,subject=None,content=None,attachment=[]):
        #mime类型
        msg = MIMEMultipart()
        #构造邮件件头
        msg['from'] = from_addr
        msg['to'] = to_addr
        msg['subject'] = subject
        msg['cc'] = cc
        #设置body为html格式
        txt = MIMEText(content,_subtype='html',_charset='utf8')
        msg.attach(txt)
    
        #构造附件
        for item in attachment:
            att = MIMEBase('application','octet-stream')
            att.set_payload(open(item.get('path'),'rb').read())
            att.add_header('Content-Disposition','attachment',filename=('gbk','',item.get('name')))
            encoders.encode_base64(att)
            msg.attach(att)
                    
        if cc:
            self.server.sendmail(msg['from'], [msg['to'],msg['cc']], msg.as_string())
        else:
            self.server.sendmail(msg['from'], msg['to'], msg.as_string())
    
    def logout(self):
        self.server.close()
