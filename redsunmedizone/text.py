# -*- coding: utf-8 -*-
'''
Created on 2016年2月1日

@author: root
'''
from imbox import Imbox
import re

imbox = Imbox('imap.redsunmedizone.com','matt@redsunmedizone.com', 'hlj52764892',ssl=True)

# Gets all messages 
#all_messages = imbox.messages()

# Unread messages 
unread_messages = imbox.messages(unread=True)

# Messages sent FROM
#messages_from = imbox.messages(sent_from='martin@amon.cx')

# Messages sent TO
#messages_from = imbox.messages(sent_to='martin@amon.cx')

# Messages received before specific date
#messages_from = imbox.messages(date__lt='31-July-2013')

# Messages received after specific date
#messages_from = imbox.messages(date__gt='30-July-2013')

# Messages from a specific folder 


for uid, message in unread_messages:
    #print(message.sent_cc)
    #print(message.sent_from)
    #print(message.sent_to)
    #print(uid,message.subject)
    #print(message.headers)
    #print(message.message_id)
    #print(message.date)
    #print(message.parsed_date)
    #print(message.body['plain'][0].decode())
    '''
    print(message.body['html'][0].decode())
    body = message.body['html'][0].decode()
    img = re.findall(r"""<img.*?>""",body,re.I)
    for item in img:
        print(item)
    '''
    
    #print(message.attachments)
    #print(message)
    if len(message.attachments) != 0:
        for item in message.attachments:
            print(item)
            file_object = open('/soft/img/%s' % item['filename'], 'wb')
            io_obj = item['content'].getvalue()
            file_object.write(item['content'].getvalue())
            file_object.close()
    #print(message.message_id)
    
    
'''
{
'headers': 
[{
'Name': 'Received-SPF',
'Value': 'pass (google.com: domain of ......;'
}, 
{
'Name': 'MIME-Version',
'Value': '1.0'
}],
'body': {
'plain: ['ASCII'],
'html': ['HTML BODY']
},
'attachments': [{
'content': <stringio.stringio instance="" at="" 0x7f8e8445fa70="">, 
'filename': "avatar.png",
'content-type': 'image/png',
'size': 80264
}],
'date': u 'Fri, 26 Jul 2013 10:56:26 +0300',
'message_id': u '51F22BAA.1040606',
'sent_from': [{
'name': u 'Martin Rusev',
'email': 'martin@amon.cx'
}],
'sent_to': [{
'name': u 'John Doe',
'email': 'john@gmail.com'
}],
'subject': u 'Hello John, How are you today'
}
'''