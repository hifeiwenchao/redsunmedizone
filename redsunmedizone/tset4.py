'''
Created on 2016年2月13日

@author: root
'''
from imapclient.imapclient import IMAPClient


client = IMAPClient('imap.alibaba.com',ssl=False)
client.login('matt@heershi.com.cn', 'as501180920')
folders_list = client.list_folders()
for item in folders_list:
    print(item)





client.logout()


