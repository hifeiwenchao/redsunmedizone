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

#'imap.alibaba.com','matt@heershi.com.cn', 'hlj52764892'
class FetchMail(object):
    
    def __init__(self,imap,user,passsword):
        self.imap = imap
        self.user = user
        self.password = passsword
        
    def fetch_email_by_folder(self,send):
        if settings.DEBUG:
            path = settings.STATIC_ROOT +'/static/attachment/'
        else:
            path = settings.STATIC_ROOT +'/attachment/'
        #['INBOX' 'REDSUN测试邮件','已发送',]
        folder_list = ['INBOX','11111','info@heershi.com', 'Jeanne',  'RFQ',  '一大通', '万羽企业邮箱', '加拿大灯臂Rob', '北京长通国际科技有限公司', '合作客户', '合作客户/加拿大Shenoy', '合作客户/印尼Teddy', '合作客户/印度Bharat', '合作客户/厄瓜多尔Alvaro', '合作客户/哥伦比亚David', '合作客户/土耳其Cristian', '合作客户/埃及Osama', '合作客户/墨西哥Ruben', '合作客户/巴基斯坦Rashid', '合作客户/巴西Renato', '合作客户/意大利Monica', '合作客户/捷克Mr.Ondrej', '合作客户/摩洛哥Mr.Largab', '合作客户/斯洛伐克Kopriva', '合作客户/新加坡Robin', '合作客户/格鲁吉亚Goga', '合作客户/格鲁吉亚Mamuka', '合作客户/泰国pom', '合作客户/澳大利亚驻印尼大使馆', '合作客户/瑞士Dr.Jules', '合作客户/科威特Aly', '合作客户/罗马尼亚Sebastian', '合作客户/美国sunnexKim', '合作客户/英国Dr.Jean', '合作客户/菲律宾MayStar', '合作客户/蒙古Haley', '合作客户/越南Alex', '合作客户/阿尔及利亚Ms.Widad', '合作客户/韩国倪经理', '合作客户/香港Dixon', '同事客户', '同事客户/印尼Reza', '同事客户/巴基斯坦Aqib', '同事客户/美国Rudy', '同事客户/韩国Lee', '外国人来华邀请函', '实验室设备', '意向客户', '意向客户/丹麦Karina', '意向客户/孟加拉ferdowsh', '意向客户/孟加拉shafiqul', '意向客户/意大利Paride', '意向客户/波兰Janusz', '意向客户/泰国Anongnad', '意向客户/泰国Charin', '意向客户/罗马尼亚Iulius', '意向客户/韩国Kim', '意向客户/韩国金先生', '橡胶采购', '法国兽医展', '泰国行', '潜在客户', '潜在客户/A埃及Aly', '潜在客户/A埃及fathy', '潜在客户/A埃塞俄比亚', '潜在客户/A阿尔及利亚ADIB', '潜在客户/A阿尔及利亚Amina', '潜在客户/A阿尔及利亚Mr.Guett', '潜在客户/A阿尔及利亚平常道', '潜在客户/B博茨瓦纳Tracy', '潜在客户/B巴基斯坦Rehan', '潜在客户/B巴基斯坦Shahid', '潜在客户/B巴基斯坦Zafar', '潜在客户/B巴基斯坦Zain', '潜在客户/B巴基斯坦手术室', '潜在客户/B巴西Abdon', '潜在客户/B比利时Hassan', '潜在客户/B波兰Iwona', '潜在客户/B波兰Marta', '潜在客户/B玻利维亚Adolfo', '潜在客户/B秘鲁Maria', '潜在客户/D多哥Danklou', '潜在客户/D多米尼加', '潜在客户/D德国Werner', '潜在客户/D迪拜Mohd', '潜在客户/E厄瓜多尔Ivan', '潜在客户/E厄瓜多尔Jhonathan', '潜在客户/F菲律宾Bedoria', '潜在客户/F菲律宾Reagan', '潜在客户/G哥伦比亚Natalia', '潜在客户/J加拿大Anthony', '潜在客户/J加拿大Joseph', '潜在客户/J加拿大Mark', '潜在客户/J捷克', '潜在客户/J捷克兽医', '潜在客户/L利比亚younis', '潜在客户/L罗马尼亚Roxana', '潜在客户/M墨西哥Andrea', '潜在客户/M墨西哥Carlos', '潜在客户/M墨西哥Jose', '潜在客户/M孟加拉', '潜在客户/M孟加拉Ms.Mukti', '潜在客户/M孟加拉Noor', '潜在客户/M孟加拉SteelCo', '潜在客户/M毛里塔尼亚Abdel', '潜在客户/M毛里求斯', '潜在客户/M美国Alexis', '潜在客户/M美国Eric', '潜在客户/M美国Javier', '潜在客户/M美国Michael', '潜在客户/M美国Susan', '潜在客户/M莫桑比克Analberto', '潜在客户/M蒙古zolboo', '潜在客户/M马来西亚Mohd', '潜在客户/M马来西亚Stan', '潜在客户/M马来西亚黄妮兹', '潜在客户/M马达加斯加Rakotom', '潜在客户/N南非Ms.Mariolize', '潜在客户/N尼日利亚Saliu', '潜在客户/N尼珀尔Binaya', '潜在客户/R日本June', '潜在客户/R日本新井田', '潜在客户/R瑞典Abtin', '潜在客户/S塞尔瓦多Stanley', '潜在客户/S塞浦路斯Dr.Christian', '潜在客户/S斯里兰卡', '潜在客户/S沙特Abin', '潜在客户/T土耳其', '潜在客户/T土耳其Cagdas', '潜在客户/T土耳其H.Cihan', '潜在客户/T土耳其Ibrahim', '潜在客户/T土耳其Idris', '潜在客户/T土耳其Zeki', '潜在客户/T泰国Arlene', '潜在客户/T突尼斯Karim', '潜在客户/W乌克兰Dasha', '潜在客户/W危地马拉Fernando', '潜在客户/W外贸公司Kylin', '潜在客户/W委内瑞拉Jose', '潜在客户/W委内瑞拉Renny', '潜在客户/W文莱William', '潜在客户/X新几内亚', '潜在客户/X新加坡Kumar', '潜在客户/X西班牙Felicidad', '潜在客户/X西班牙诊所Luis', '潜在客户/X香港Joy', '潜在客户/X香港YKLEE', '潜在客户/Y也门', '潜在客户/Y亚美尼亚Yervand', '潜在客户/Y以色列Lidor', '潜在客户/Y伊朗Homayoun', '潜在客户/Y伊朗Hossein', '潜在客户/Y伊朗Reza', '潜在客户/Y印尼Arief', '潜在客户/Y印尼Aryo', '潜在客户/Y印尼Dirjaya', '潜在客户/Y印尼Lukito', '潜在客户/Y印尼Prames', '潜在客户/Y印尼Rudi', '潜在客户/Y印度', '潜在客户/Y印度Ashish', '潜在客户/Y印度Hari', '潜在客户/Y印度Krishna', '潜在客户/Y印度Medsun', '潜在客户/Y印度Nancy张', '潜在客户/Y印度peter', '潜在客户/Y印度Peter助手wendy', '潜在客户/Y印度sanjay', '潜在客户/Y印度南', '潜在客户/Y意大利Albert', '潜在客户/Y约旦Mohammad', '潜在客户/Y英国David', '潜在客户/Y英国James', '潜在客户/Y英国Phillip', '潜在客户/Y越南Dzung', '潜在客户/Y越南Mr.Dung', '潜在客户/Z中东bakir', '潜在客户/Z中东EMAD', '环球市场', '谷歌广告', '麻醉机供应商Wicky']
        box = imapy.connect(host=self.imap,username=self.user,password=self.password,ssl=False)
        #q = Q()
        for item in folder_list: 
            print('文件夹为%s抓取邮件,时间为%s' % (item,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
            emails = box.folder(item).emails()
            if isinstance(emails,bool) :continue
            for email in emails:
                uid = '%s' % (datetime.now().strftime('%Y%m%d%H%M%S%f')[2:])
                print('抓取邮件uid为%s,时间为%s' % (uid,time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(time.time()))))
                temp = {}
                temp.__setitem__('uid', uid)
                temp.__setitem__('headers','%s' % email['headers'])
                temp.__setitem__('from_whom','%s' % email['from_whom'])
                temp.__setitem__('sent_from','%s' % email['from_email'])
                temp.__setitem__('to','%s' % email['to'])
                match = re.findall(r'[\w\.-]+@[\w\.-]+',email['to'])
                temp.__setitem__('send_to','%s' % ';'.join(match))
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
        box.logout()
            









