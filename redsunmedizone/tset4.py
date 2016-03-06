'''
Created on 2016年2月13日

@author: root
'''
from imapclient.imapclient import IMAPClient
import os
from functools import cmp_to_key
import random
import time

'''
client = IMAPClient('imap.alibaba.com',ssl=False)
client.login('matt@heershi.com.cn', 'as501180920')
folders_list = client.list_folders()
for item in folders_list:
    print(item)


client.logout()



path = '/soft/workbench'


#比较函数
def compare(e1,e2):
    if len(e1.split('.')) > len(e2.split('.')):
        return 1
    else:
        return 0


def path_to_dict(path):
    d = {'text': os.path.basename(path)}
    if os.path.isdir(path):
        d['type'] = "directory"
        d['state'] = "closed"
        d['iconCls'] = 'tree-folder'
        #os.listdir(path)
        
        if len([path_to_dict(os.path.join(path,x)) for x in os.listdir(path)]) == 0:
            d['children'] = []
        else:
            d['children'] = [path_to_dict(os.path.join(path,x)) for x in sorted(os.listdir(path),key=lambda obj:len(obj.split('.')))]
    else:
        d['type'] = "file"
        d['iconCls'] = 'tree-file'
    return d

data = path_to_dict(path)

print(data)
'''



print(random.choice())

