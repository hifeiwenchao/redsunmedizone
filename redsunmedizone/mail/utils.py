'''
Created on 2016年2月14日

@author: root
'''
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import time

demo2 = '''
<div>ASSALAM U ALAIKUM</div><div>BEFORE READING MY EMAIL . PLEASE BE SURE THAT AM REALLY HOPE TO BE GOOD FRIENDS WITH YOU EVEN THEN WE DO NOT HAVE ANY BUSINESS.</div><div>MY NAME IS MATT HOU FROM RED SUN MEDI ZONE HONGKONG. WE HAVE 3 YEARS EXPERIENCE WITH INTERNATIONAL TRADE IN MEDICAL AREA.</div><div>OUR PARTNERS ARE BEST CHINESE FACTORIES. THEY ARE FOCUSING ON PATIENT MONITORS/ANESTHESIA MACHINES/MEDICAL NEBULIZER/OXYGEN CONCENTRATOR/SUCTION APPARATUS/DELIVERY BED FOR DECADES.</div><div>WE ARE SURE YOU WILL LIKE OUR SERVICE AND QUALITY.</div><div>WE CAN OFFER YOU HIGH QUALITY MEDICAL DEVICES AND SUITABLE PRICES. AND SURE WE CAN SIGN CONTRACT WITH YOU FOR MORE SAFTY. AND WE CAN FULLY REFUND TO YOU IF ANY QUALITY PROBLEM. WE ARE SURE THAT WITH US YOUR MOMEY IS IN SAFE AND YOUR BUSINESS IS IN SAFE.</div><div>SO PLEASE GIVE US MORE CHANCE TO SERVE YOU . AND WE BELIEVE THAT YOU WILL BE HAPPY WITH US.</div><div>PLEASE FIND ATTACHMENTS FOR OUR PRODUCT LISTS. FEEL FREE TO CONTACT IF YOU LIKE ANYONE OF THEM.</div><div>PLEASE FEEL FREE TO CONTACT IF YOU NEED ANY HELP IN CHINA.</div><div>PLEASE REMEMBER THAT AM REALLY HOPE TO BE GOOD FRIENDS WITH YOU EVEN WE DON'T DO ANY BUSINESS.</div><div>THIS IS MATT HOU FROM HONGKONG</div><div>THANKS A LOT</div>
'''


def send_mail(username=None, password=None, from_addr=None, to_addr=None, subject=None, content=None, files=[], is_html=False):
    MAIL_SMTP_HOST = 'smtp.redsunmedizone.com'

    msg = MIMEMultipart()
    txt = MIMEText(content,'plain','utf8')
    if is_html:
        txt = MIMEText(content,_subtype='html',_charset='utf8')
    msg.attach(txt)

    for item in files:
        #构造附件
        att = MIMEText(open(item.get('url'), 'rb').read(), 'base64', 'utf8')
        att["Content-Type"] = 'application/octet-stream'
        att["Content-Disposition"] = 'attachment; filename=%s' % item.get('name') #这里的filename可以任意写，写什么名字，邮件中显示什么名字
        msg.attach(att)


    #发送邮件初始化
    server = smtplib.SMTP()
    server.connect(MAIL_SMTP_HOST)
    server.login(username, password)

    
    #加邮件头
    msg['to'] = to_addr
    msg['from'] = from_addr
    msg['subject'] = subject
    server.sendmail(msg['from'], msg['to'], msg.as_string())
    server.quit()

if __name__ == '__main__':
    send_mail('matt@redsunmedizone.com', 'hlj52764892', 'matt@redsunmedizone.com', 'info@redsunmedizone.com','test2 %s' % time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time())), demo2, [],True)
