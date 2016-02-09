'''
Created on 2016年2月5日

@author: root
'''
#发送邮件,异常的捕捉,要在上层方法捕捉,不在本层, utils只做工具,不做其他任何行为
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib


demo1= '''
<div>This is Matt Hou from RED SUN MEDI ZONE HK. Please allow me introduce our company to you.</div><div>RED SUN MEDI ZONE HK is one of the professional dealer in medical equipments in Hongkong.</div><div>We have 3 years experience in cooperating with best chinese factories.Which are focusing on Patient Monitor/Anesthesia Machine/Medical Nebulizer/Oxygen Concentrator/Suction Apparatus/Delivery Bed for decades.</div><div>All goods are coming with certifications(ISO and CE).And we have a special team work for after-sale-service 7/24.Service is our major.</div><div>We willing for sign contract with you in case you need it. Trust is the priority to us.</div><div>TIME IS GOLD for you and us.Normally we can deliver your goods within 5-7 days with perfect quality for small quantity.</div><div>We can ship goods with sea/air/express(DHL and TNT).</div><div>QUALITY IS OUR CULTURE.We foucs on high quality products with suitable prices.</div><div>Please check our website for more information of products. Feel free to contact if you interesting in anyone of them.</div><div>Our website: www.redsunmedizone.com</div><div>Wish to have business with you in near future. Paypal is available.</div><div>Looking forward to hear from you.</div><div>Best regards</div>
'''



demo2 = '''
<div>ASSALAM U ALAIKUM</div><div>BEFORE READING MY EMAIL . PLEASE BE SURE THAT AM REALLY HOPE TO BE GOOD FRIENDS WITH YOU EVEN THEN WE DO NOT HAVE ANY BUSINESS.</div><div>MY NAME IS MATT HOU FROM RED SUN MEDI ZONE HONGKONG. WE HAVE 3 YEARS EXPERIENCE WITH INTERNATIONAL TRADE IN MEDICAL AREA.</div><div>OUR PARTNERS ARE BEST CHINESE FACTORIES. THEY ARE FOCUSING ON PATIENT MONITORS/ANESTHESIA MACHINES/MEDICAL NEBULIZER/OXYGEN CONCENTRATOR/SUCTION APPARATUS/DELIVERY BED FOR DECADES.</div><div>WE ARE SURE YOU WILL LIKE OUR SERVICE AND QUALITY.</div><div>WE CAN OFFER YOU HIGH QUALITY MEDICAL DEVICES AND SUITABLE PRICES. AND SURE WE CAN SIGN CONTRACT WITH YOU FOR MORE SAFTY. AND WE CAN FULLY REFUND TO YOU IF ANY QUALITY PROBLEM. WE ARE SURE THAT WITH US YOUR MOMEY IS IN SAFE AND YOUR BUSINESS IS IN SAFE.</div><div>SO PLEASE GIVE US MORE CHANCE TO SERVE YOU . AND WE BELIEVE THAT YOU WILL BE HAPPY WITH US.</div><div>PLEASE FIND ATTACHMENTS FOR OUR PRODUCT LISTS. FEEL FREE TO CONTACT IF YOU LIKE ANYONE OF THEM.</div><div>PLEASE FEEL FREE TO CONTACT IF YOU NEED ANY HELP IN CHINA.</div><div>PLEASE REMEMBER THAT AM REALLY HOPE TO BE GOOD FRIENDS WITH YOU EVEN WE DON'T DO ANY BUSINESS.</div><div>THIS IS MATT HOU FROM HONGKONG</div><div>THANKS A LOT</div>
'''


def send_gmail(username=None, password=None, from_addr=None, to_addr=None, subject=None, content=None, files=[], is_html=False):
    # 邮箱已为腾讯邮箱，username 与 from_addr 应相同
    # GMAIL_IMAP_HOST = 'imap.exmail.qq.com'
    GMAIL_SMTP_HOST = 'smtp.redsunmedizone.com'
    # GMAIL_SMTP_PORT = 465

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
    server.connect(GMAIL_SMTP_HOST)
    server.login(username, password)

    
    #加邮件头
    msg['to'] = to_addr
    msg['from'] = from_addr
    msg['subject'] = subject
    server.sendmail(msg['from'], msg['to'], msg.as_string())
    server.quit()


send_gmail('matt@redsunmedizone.com', 'hlj52764892', 'matt@redsunmedizone.com', 'info@redsunmedizone.com','test', demo1, [])
