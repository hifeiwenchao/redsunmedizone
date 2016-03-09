from django.shortcuts import render
from django.http.response import HttpResponse, HttpResponseRedirect,\
    StreamingHttpResponse
from crm.models import *
import json
import time
from django.conf import settings
import os
import shutil
import random
import re
from mail.utils import SendEmail
from crm.utils import exception_logger

@exception_logger
def index(request):
    if request.session.__contains__('username') == False:
        return render(request, 'login.html') 
    else:
        return render(request, 'index.html')

@exception_logger
def login(request):
    obj = Users.objects.filter(**{'username':request.POST.get('username'),'password':request.POST.get('password')}).first()
    if obj != None:
        request.session.__setitem__('username','adminhou')
        return HttpResponse('done')
    return HttpResponse('error')

@exception_logger
def logout(request):
    request.session.clear()
    return HttpResponseRedirect('/')

@exception_logger
def memo_handler(request):
    if request.method == "GET":
        obj = Memo.objects.filter(date = request.GET.get('date')).first()
        
        if obj == None:
            return HttpResponse('')
        else:
            return HttpResponse(obj.memo)
        
    if request.method == "POST":
        date = request.POST.get('date')
        obj = Memo.objects.filter(date = date).first()
        if obj != None:
            obj.memo = request.POST.get('memo')
            obj.save()
        else:
            Memo.objects.create(**request.POST.dict())
        return HttpResponse('done')

@exception_logger
def memo_mark(request):
    objs = Memo.objects.exclude(memo ='').all()
    date_list = [item.date for item in objs]
    return HttpResponse(json.dumps(date_list,ensure_ascii=False))

@exception_logger 
def customer_list(request):
    if request.method == "POST":
        
        customer_grade = request.POST.get('customer_grade')
        search = request.POST.get('search')
        
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        
        if search != None:
            sql='select t1.id,t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source \
            from customer t1 left join religion t2 on t1.religion = t2.id \
            left join nation t3 on t1.nation = t3.id \
            left join source_of_customer t4 on t1.source_of_customer = t4.id \
            where t1.customer_grade <> 4 and  1=1'
            search  = search.split(' ')
            for item in search:
                sql+=' and concat(t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source) like "%%'+item+'%%"'
            objs = Customer.objects.raw(sql +' order by t1.sort desc')
            objs = [item for item in objs]
            total = len(objs)
            
        elif customer_grade != None and customer_grade != 'all':
            total = Customer.objects.filter(customer_grade = int(customer_grade)).count()
            objs = Customer.objects.filter(customer_grade = int(customer_grade)).order_by('-sort')[start:end]
        else:
            total = Customer.objects.exclude(customer_grade = 4).count()
            objs = Customer.objects.raw('select id,sort,name,company_name,nation,email,website from customer where customer_grade <> 4 order by sort desc,id desc')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('company_name', item.company_name)
            temp.__setitem__('name', item.name)
            temp.__setitem__('nation', Nation.objects.filter(id = item.nation).first().nation)
            temp.__setitem__('email', item.email)
            temp.__setitem__('website',item.website)
            temp.__setitem__('sort',item.sort)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))


@exception_logger
def get_communication_situation(requset):
    objs = CommunicationSituation.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.situation)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))    

@exception_logger        
def get_customer_grade(requset):
    objs = CustomerGrade.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.grade)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def get_customer_grade_filter(requset):
    objs = CustomerGrade.objects.order_by('id').all()
    data = []
    data.append({'id':'all','text':'全部客户'})
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.grade)
        data.append(temp)
    
    return HttpResponse(json.dumps(data,ensure_ascii=False))  

@exception_logger
def get_payment_term(requset):
    objs = PaymentTerm.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.term)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def get_religion(requset):
    objs = Religion.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.religion)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def get_source_of_customer(requset):
    objs = SourceOfCustomer.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.source)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def get_nation(requset):
    objs = Nation.objects.order_by('nation').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.nation)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))

@exception_logger
def get_product_category(request):
    objs = Category.objects.order_by('id').using('website').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('category', item.category)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))

@exception_logger
def add_customer_settings_info(requset):
    
    #{0:'customer_grade',1:'communication_situation',2:'source_of_customer',3:'religion',4:'payment_term',5:'nation'}
    
    data_type = requset.POST.get('type')
    
    
    if data_type == '0':
        if CustomerGrade.objects.filter(grade__contains = requset.POST.get('data')).first() != None:
            return HttpResponse('repeat')
        else:
            CustomerGrade.objects.create(grade = requset.POST.get('data'))
    if data_type == '1':
        if CommunicationSituation.objects.filter(situation__contains = requset.POST.get('data')).first() !=None:
            return HttpResponse('repeat')
        else:
            CommunicationSituation.objects.create(situation = requset.POST.get('data'))
    if data_type == '2':
        if SourceOfCustomer.objects.filter(source__contains = requset.POST.get('data')).first() !=None:
            return HttpResponse('repeat')
        else:
            SourceOfCustomer.objects.create(source = requset.POST.get('data'))
    if data_type == '3':
        if Religion.objects.filter(religion__contains = requset.POST.get('data')).first() !=None:
            return HttpResponse('repeat')
        else:
            Religion.objects.create(religion = requset.POST.get('data'))
    if data_type == '4':
        if PaymentTerm.objects.filter(term__contains = requset.POST.get('data')).first() !=None:
            return HttpResponse('repeat')
        else:
            PaymentTerm.objects.create(term = requset.POST.get('data'))
    if data_type == '5':
        if Nation.objects.filter(nation__contains = requset.POST.get('data')).first() !=None:
            return HttpResponse('repeat')
        else:
            Nation.objects.create(nation = requset.POST.get('data'))
    return HttpResponse('done')

@exception_logger
def add_customer(request):
    if request.method == "POST":
        info = request.POST.dict()
        info['name'] = str(info['name']).upper()
        Customer.objects.create(**info)
        return HttpResponse('done')

@exception_logger        
def save_customer(request):
    if request.method == "POST":
        cid = request.POST.get('id')
        new_data = request.POST.dict()
        new_data['name'] = str(new_data['name']).upper()
        del new_data['id']
        Customer.objects.filter(id = int(cid)).update(**new_data)
        return HttpResponse('done')

@exception_logger   
def customer_detail(request):
    if request.method == "POST":
        obj = Customer.objects.filter(id = int(request.POST.get('id'))).first()
        data = {}
        for item in obj._meta.fields:
            data.__setitem__(item.name,eval('obj.'+item.name))
        return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def email_settings_editor(request):
    return render(request,'email_settings_editor.html')

@exception_logger
def email_send_editor(request):
    return render(request,'email_send_editor.html')

@exception_logger
def email_body_template_editor(request):
    return render(request,'email_body_template_editor.html')

@exception_logger
def email_reply_editor(request):
    return render(request,'email_reply_editor.html')

@exception_logger
def mail_account_list(request):
    objs = EmailAccount.objects.filter().all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('address', item.address)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))  

@exception_logger
def mail_account_detail(request):
    obj = EmailAccount.objects.filter(id = int(request.POST.get('id'))).first()
    data = {}
    for item in obj._meta.fields:
        data.__setitem__(item.name,eval('obj.'+item.name))
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

@exception_logger
def mail_account_add(request):
    info = request.POST.dict()
    if(EmailAccount.objects.filter(address__contains = info['address']).first() != None):
        return HttpResponse('repeat')
    info.__setitem__('create_time',int(time.time()))
    EmailAccount.objects.create(**info)
    return HttpResponse('done')
  
@exception_logger      
def mail_account_save(request):
    new_data = request.POST.dict()
    del new_data['id']
    EmailAccount.objects.filter(id = int(request.POST.get('id'))).update(**new_data)
    return HttpResponse('done')

@exception_logger   
def static_file_tree(request):
        
    if settings.DEBUG:
        if request.GET.get('type') == None:
            STATIC_ROOT = settings.STATIC_ROOT+'/static/public'
        else:
            STATIC_ROOT = '/soft/files'
    else:
        if request.GET.get('type') == None:
            STATIC_ROOT = settings.STATIC_ROOT +'/public'
        else:
            STATIC_ROOT = '/soft/files'
    
    dir_tree = path_to_dict(STATIC_ROOT)
    
    return HttpResponse(json.dumps([dir_tree],ensure_ascii=False))

@exception_logger    
def path_to_dict(path):
    d = {'text': os.path.basename(path)}
    if os.path.isdir(path):
        d['type'] = "directory"
        d['state'] = "closed"
        d['iconCls'] = 'tree-folder'
        if len([path_to_dict(os.path.join(path,x)) for x in os.listdir(path)]) == 0:
            d['children'] = []
        else:
            d['children'] = [path_to_dict(os.path.join(path,x)) for x in sorted(os.listdir(path),key=lambda obj:len(obj.split('.')))]
    else:
        d['type'] = 'file'
        d['iconCls'] = 'tree-file'
    
    return d
    

@exception_logger    
def add_dir(request):
    true_path = request.POST.get('true_path')
    directory_name = request.POST.get('directory_name')
    
    if settings.DEBUG:
        STATIC_ROOT = settings.STATIC_ROOT +'/static'
    else:
        STATIC_ROOT = settings.STATIC_ROOT
        
    path_list = os.listdir(path=STATIC_ROOT+true_path)
    
    if directory_name in path_list:
        return HttpResponse('repeat')
    else:
        os.mkdir(STATIC_ROOT+true_path+'/'+directory_name)
        return HttpResponse('done')

@exception_logger
def add_dir_all(request):
    true_path = request.POST.get('true_path')
    directory_name = request.POST.get('directory_name')
    
    STATIC_ROOT = '/soft'
        
    path_list = os.listdir(path=STATIC_ROOT+true_path)
    
    if directory_name in path_list:
        return HttpResponse('repeat')
    else:
        os.mkdir(STATIC_ROOT+true_path+'/'+directory_name)
        return HttpResponse('done')  

@exception_logger
def remove_dir(request):
    true_path = request.POST.get('true_path')
    
    if settings.DEBUG:
        STATIC_ROOT = settings.STATIC_ROOT +'/static'
    else:
        STATIC_ROOT = settings.STATIC_ROOT
    shutil.rmtree(STATIC_ROOT+true_path)
    return HttpResponse('done')
        



@exception_logger
def upload_file(request):
    
    path = request.POST.get('path')
    if '..' in path:
        return HttpResponse('done')
    
    file_obj = request.FILES.getlist('files')
    
    if settings.DEBUG:
        file_path = settings.STATIC_ROOT +'/static'+path +'/'
    else:
        file_path = settings.STATIC_ROOT + path +'/'
    
    for item in file_obj:
        
        with open(file_path + item.name,'wb') as up:
            for chunk in item.chunks():
                up.write(chunk)
        up.close()
            
    return HttpResponse('done')

@exception_logger
def upload_file_all(request):
    
    path = request.POST.get('path')
    if '..' in path:
        return HttpResponse('done')
    
    file_obj = request.FILES.getlist('files')
    
    file_path = '/soft'+path +'/'
    
    for item in file_obj:
        
        with open(file_path + item.name,'wb') as up:
            for chunk in item.chunks():
                up.write(chunk)
        up.close()
            
    return HttpResponse('done')

@exception_logger
def file_iterator(file_name,buf_size=8192):
    with open(file_name,'w+') as f:
        while True:
            c = f.read(buf_size)
            if c:
                yield c
            else:
                break
    f.close()

@exception_logger
def get_file(request):
    if request.method == 'GET':
        path = request.GET.get('path')
        name = request.GET.get('name')
        path = '/soft'+path
        c = open(path,'rb').read()
        response = HttpResponse()
        response['Content-Disposition'] = 'attachment;filename="%s"' % name
        response.write(c)
        return response
        '''
        response = HttpResponse(content_type ='application/force-download')
        response['Content-Disposition'] = 'attachment;filename="%s"'% smart_str(name)
        response['X-Sendfile'] = smart_str(path)
        
        return response
            
        
    
        response = StreamingHttpResponse(file_iterator(path))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="%s"'% name
     
        return response
        '''

@exception_logger       
def remove_file(request):
    pass


@exception_logger        
def get_subject_template(request):
    
    if request.GET.get('type') != None and request.GET.get('type') != 'all':
        objs = EmailSubjectTemplate.objects.filter(type = request.GET.get('type')).order_by('id').all()
    else:
        objs = EmailSubjectTemplate.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.content)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False)) 

@exception_logger
def add_subject_template(request):
    EmailSubjectTemplate.objects.create(**{'type':request.POST.get('type'),'content':request.POST.get('content'),'create_time':int(time.time())})
    return HttpResponse('done')

@exception_logger    
def edit_subject_template(request):
    EmailSubjectTemplate.objects.filter(id = request.POST.get('id')).update(content = request.POST.get('content'))
    return HttpResponse('done')

@exception_logger
def get_subject_template_detail(request):
    obj = EmailSubjectTemplate.objects.filter(id = request.GET.get('id')).first()
    data = {}
    data.__setitem__('content',obj.content)
    return HttpResponse(json.dumps(data,ensure_ascii=False))  

@exception_logger    
def get_body_template(request):
    if request.GET.get('type') != None and request.GET.get('type') != 'all':
        objs = EmailBodyTemplate.objects.filter(type = request.GET.get('type')).order_by('id').all()
    else:
        objs = EmailBodyTemplate.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('title', item.title)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False)) 

@exception_logger
def add_body_template(request):
    data = {'title':request.POST.get('title'),'category_id':request.POST.get('category_id'),'type':request.POST.get('type'),'content':request.POST.get('content'),'create_time':int(time.time())}
    obj = EmailBodyTemplate.objects.filter(content__contains =request.POST.get('content'),type = request.POST.get('type')).first()
    if(obj != None):
        return HttpResponse('repeat')
    else:
        EmailBodyTemplate.objects.create(**data)
        return HttpResponse('done')

@exception_logger
def edit_body_template(request):
    data = {'title':request.POST.get('title'),'category_id':request.POST.get('category_id'),'type':request.POST.get('type'),'content':request.POST.get('content')}
    EmailBodyTemplate.objects.filter(id =request.POST.get('id')).update(**data)
    return HttpResponse('done')



@exception_logger
def get_body_template_detail(request):
    obj = EmailBodyTemplate.objects.filter(id = request.GET.get('id')).first()
    data = {}
    data.__setitem__('title', obj.title)
    data.__setitem__('category_id', obj.category_id)
    data.__setitem__('type', obj.type)
    data.__setitem__('content', obj.content)
    return HttpResponse(json.dumps(data,ensure_ascii=False))


    

@exception_logger
def get_attachment_template(request):
    pass



@exception_logger
def get_email_box(request):
    pass
    
    
    

@exception_logger    
def add_email_task(request):
    
    data = request.POST.dict()
    if EmailTask.objects.filter(name__contains = data['name']).first() != None:
        return HttpResponse('repeat')
    task_name = data['name']
    task_interval = data['interval']
    task_remark = data['remark']
    task_status = data['status']
    
    et = EmailTask.objects.create(status = task_status,name = task_name,interval = task_interval,remark=task_remark,create_time = int(time.time()))
    email_task = EmailTask.objects.filter(name = task_name).first()
    email_task_id = email_task.id
    
    
    send_pool = (data['send']).split(',')
    target_pool = (data['target']).split(',')
    subject_pool = (data['subject']).split(',')
    body_pool = (data['body']).split(',')
        
    for item in target_pool:
        
        to_obj = Customer.objects.filter(id =  item).first()
        send_tos = (to_obj.email).split('\n')
        for each in send_tos:
            send_to = each.replace(' ','').replace(',','').strip(' ')
            temp_send_id = random.choice(send_pool)
            account = EmailAccount.objects.filter(id = temp_send_id).first()
            subject = EmailSubjectTemplate.objects.filter(id = random.choice(subject_pool)).first()
            body = EmailBodyTemplate.objects.filter(id = random.choice(body_pool)).first()
            content =  body.content.replace('%s',to_obj.name)
            content = content + '<div style="margin:10px"></div>' + account.signature
            EmailTaskDetail.objects.create(email_account_id = temp_send_id,email_task_id = email_task_id,customer_id = item,
                send_from = account.address,send_to = send_to,subject = subject.content,content = content,update_time = int(time.time())+int(task_interval)*60)
    

    return HttpResponse('done')
    

@exception_logger    
def email_list_unread(request):
    if request.method == "POST":
        '''
        customer_grade = request.POST.get('customer_grade')
        search = request.POST.get('search')
        '''
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        '''
        if search != None:
            sql='select t1.id,t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source \
            from customer t1 left join religion t2 on t1.religion = t2.id \
            left join nation t3 on t1.nation = t3.id \
            left join source_of_customer t4 on t1.source_of_customer = t4.id \
            where 1=1'
            search  = search.split(' ')
            for item in search:
                sql+=' and concat(t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source) like "%%'+item+'%%"'
            objs = Customer.objects.raw(sql +' order by t1.sort desc')
            objs = [item for item in objs]
            total = len(objs)
            
        elif customer_grade != None and customer_grade != 'all':
            total = Customer.objects.filter(customer_grade = int(customer_grade)).count()
            objs = Customer.objects.filter(customer_grade = int(customer_grade)).order_by('-sort')[start:end]
        else:
            total = Customer.objects.count()
            objs = Customer.objects.raw('select id,sort,name,company_name,nation,email,website from customer order by sort desc,id desc')[start:end]
        data = []
        '''
        total = Email.objects.filter(read = 0,status=1).count()
        objs = Email.objects.filter(read = 0,status=1).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from', eval(item.sent_from)[0]['email'])
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            temp.__setitem__('sent_to', ','.join(to_list))
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))

@exception_logger
def email_list_read(request):
    if request.method == "POST":
        '''
        customer_grade = request.POST.get('customer_grade')
        search = request.POST.get('search')
        '''
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        '''
        if search != None:
            sql='select t1.id,t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source \
            from customer t1 left join religion t2 on t1.religion = t2.id \
            left join nation t3 on t1.nation = t3.id \
            left join source_of_customer t4 on t1.source_of_customer = t4.id \
            where 1=1'
            search  = search.split(' ')
            for item in search:
                sql+=' and concat(t1.company_name,t1.name,t1.nation,t1.email,t1.website,t2.religion,t3.nation,t4.source) like "%%'+item+'%%"'
            objs = Customer.objects.raw(sql +' order by t1.sort desc')
            objs = [item for item in objs]
            total = len(objs)
            
        elif customer_grade != None and customer_grade != 'all':
            total = Customer.objects.filter(customer_grade = int(customer_grade)).count()
            objs = Customer.objects.filter(customer_grade = int(customer_grade)).order_by('-sort')[start:end]
        else:
            total = Customer.objects.count()
            objs = Customer.objects.raw('select id,sort,name,company_name,nation,email,website from customer order by sort desc,id desc')[start:end]
        data = []
        '''
        total = Email.objects.filter(read = 1,status=1).count()
        objs = Email.objects.filter(read = 1,status=1).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from', eval(item.sent_from)[0]['email'])
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            temp.__setitem__('sent_to', ','.join(to_list))
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date', '2016-01-01 00:00:00' if item.date == 'None' else item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            temp.__setitem__('reply',item.reply)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))


@exception_logger
def email_list_sent(request):
    if request.method == "POST":
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        total = Email.objects.filter(read = 1,status=2).count()
        objs = Email.objects.filter(read = 1,status=2).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from',item.sent_from.split('@')[0])
            '''
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            '''
            temp.__setitem__('sent_to', item.send_to)
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))

@exception_logger
def email_list_draft(request):
    if request.method == "POST":
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        total = Email.objects.filter(read = 1,status=3).count()
        objs = Email.objects.filter(read = 1,status=3).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from',item.sent_from.split('@')[0])
            '''
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            '''
            temp.__setitem__('sent_to', item.send_to)
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))


@exception_logger
def email_list_trash(request):
    if request.method == "POST":
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        total = Email.objects.filter(read = 1,status=4).exclude(server_id = 'local').count()
        objs = Email.objects.filter(read = 1,status=4).exclude(server_id = 'local').order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from', eval(item.sent_from)[0]['email'])
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            temp.__setitem__('sent_to', ','.join(to_list))
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))

@exception_logger
def email_list_inquiry(request):
    if request.method == "POST":
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        total = Email.objects.filter(read = 1,type=1).count()
        objs = Email.objects.filter(read = 1,type=1).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from', eval(item.sent_from)[0]['email'])
            to_list = []
            for each in eval(item.send_to):
                to_list.append(each['email'].split('@')[0])
            temp.__setitem__('sent_to', ','.join(to_list))
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))

@exception_logger
def email_list_quotation(request):
    if request.method == "POST":
        page = request.POST.get('page')
        rows = request.POST.get('rows')
        rows = int(rows)
        page = int(page)
        start = (page-1)*rows
        end = page*rows
        total = Email.objects.filter(read = 1,type=2).count()
        objs = Email.objects.filter(read = 1,type=2).order_by('-date')[start:end]
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            temp.__setitem__('sent_from',item.sent_from.split('@')[0])
            temp.__setitem__('sent_to', item.send_to)
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date',item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('type',item.type)
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))


@exception_logger
def email_mark_seen(request):
    email_id = request.GET.get('id')
    Email.objects.filter(id = email_id).update(read = 1)
    
    return HttpResponse('done')

@exception_logger
def change_email_status(request):
    Email.objects.filter(id = request.POST.get('email_id')).update(status = request.POST.get('status'))
    return HttpResponse('done')

@exception_logger
def change_email_type(request):
    Email.objects.filter(id = request.POST.get('email_id')).update(type = request.POST.get('type'))
    return HttpResponse('done')


@exception_logger
def send_email(request):
    
    data = request.POST.dict()
    send_from = data['send_from']
    send_to = data['send_to'].strip(';')
    send_cc = None if data['send_cc'] == "" else data['send_cc']
    subject = data['subject']
    content = data['content']
    
    account = EmailAccount.objects.filter(id = send_from).first()
    content = content +'<br><br><br>'+account.signature
    
    now_time = int(time.time())
    uid = '1'+str(int(time.time()))[-5:]
    Email.objects.create(status=2,read=1,uid=uid,sent_from = account.address,send_to = send_to,send_cc = data['send_cc'],
         subject = subject,server_id = 'local',date = time.strftime('%Y-%m-%d %X', time.localtime(time.time())),
         content = content,create_time = now_time)
    
    if settings.DEBUG:
        path = settings.STATIC_ROOT +'/static/attachment/'
    else:
        path = settings.STATIC_ROOT +'/attachment/'
    
    file_obj = request.FILES.getlist('files')
    try:
        os.mkdir(path+str(uid))
    except Exception as e:
        pass
    attachment = []
    for item in file_obj:
        attachment.append({'path':path +str(uid)+'/'+ item.name,'name':item.name})
        Attachment.objects.create(create_time = int(time.time(  )),size = 0,email_id = str(uid),file_name = item.name,path='/static/attachment/'+str(uid)+'/'+ item.name)
        with open(path +str(uid)+'/'+ item.name,'wb') as up:
            for chunk in item.chunks():
                up.write(chunk)
        up.close()
    
    
    obj = SendEmail()
    obj.set_info(account.smtp,account.address,account.password)
    obj.send_email(account.address,send_to, send_cc, subject,content,attachment)
    obj.logout()
    
    
    return HttpResponse('done')



#需修改

@exception_logger
def email_detail(request):
    email_id = request.GET.get('id')
    
    obj = Email.objects.filter(id = email_id).first()
    try:
        sent_from = ','.join([item['email']for item in eval(obj.sent_from)])
    except Exception as e :
        sent_from = obj.sent_from
    
    try:
        send_to = ','.join([item['email']for item in eval(obj.send_to)])
    except Exception as e :
        send_to = obj.send_to
    try:
        send_cc = ','.join([item['email']for item in eval(obj.send_cc)])
    except Exception as e :
        send_cc = obj.send_cc
    subject = obj.subject
    
    '''
    imgs = re.findall('<img.*>', obj.content, re.I)
    
    
    for item in imgs:
        re_height = re.search('height:.*(\d+)px',item, re.I)
        height = ''.join([m.group() for m in re.compile(r'\d+').finditer(re_height.group(0))])
        print('高:',height)
    '''
        
    att = Attachment.objects.filter(email_id = obj.uid).all()
    
    return render(request, 'email_detail.html',{'att':att,'obj':obj,'sent_from':sent_from,'send_to':send_to,'send_cc':send_cc,'subject':subject})




@exception_logger
def task_list_main(request):
    #EMAIL_TASK_STATUS = {0:'未开始',1:'执行中',2:'执行完成'}
    objs = EmailTask.objects.exclude(status = 2).all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('status', item.status)
        temp.__setitem__('name',item.name)
        temp.__setitem__('interval', item.interval)
        temp.__setitem__('remark', item.remark)
        temp.__setitem__('total', EmailTaskDetail.objects.filter(email_task_id = item.id).count())
        temp.__setitem__('finish', EmailTaskDetail.objects.filter(email_task_id = item.id,status=1).count())
        temp.__setitem__('create_time',time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(item.create_time)))
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))

@exception_logger
def change_task_status(request):
    task_id = request.POST.get('task_id')
    status = request.POST.get('status')
    
    EmailTask.objects.filter(id = task_id).update(status = status)
    
    return HttpResponse('done')
    
    

@exception_logger    
def task_list(request):
    #EMAIL_TASK_STATUS = {0:'未开始',1:'执行中',2:'执行完成'}
    page = request.POST.get('page')
    rows = request.POST.get('rows')
    rows = int(rows)
    page = int(page)
    start = (page-1)*rows
    end = page*rows
    total = EmailTask.objects.count()
    objs = EmailTask.objects.order_by('-create_time')[start:end]
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('status', item.status)
        temp.__setitem__('name',item.name)
        temp.__setitem__('interval', item.interval)
        temp.__setitem__('remark', item.remark)
        temp.__setitem__('total', EmailTaskDetail.objects.filter(email_task_id = item.id).count())
        temp.__setitem__('finish', EmailTaskDetail.objects.filter(email_task_id = item.id,status=1).count())
        temp.__setitem__('create_time',time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(item.create_time)))
        data.append(temp)
    return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))

@exception_logger
def task_detail(request):
    #EMAIL_TASK_STATUS = {0:'未开始',1:'执行中',2:'执行完成'}
    task_id = request.POST.get('task_id')
    page = request.POST.get('page')
    rows = request.POST.get('rows')
    rows = int(rows)
    page = int(page)
    start = (page-1)*rows
    end = page*rows
    
    if task_id == None:
        total = EmailTaskDetail.objects.count()
        objs = EmailTaskDetail.objects.order_by('-process_time')[start:end]
    else:
        total = EmailTaskDetail.objects.filter(email_task_id = task_id).count()
        objs = EmailTaskDetail.objects.filter(email_task_id = task_id).order_by('-process_time')[start:end]
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        cs_obj = Customer.objects.filter(id = item.customer_id).first()
        temp.__setitem__('name', cs_obj.name)
        temp.__setitem__('status', item.status)
        temp.__setitem__('send_from',item.send_from)
        temp.__setitem__('send_to', item.send_to)
        temp.__setitem__('subject', item.subject)
        temp.__setitem__('result', item.result)
        temp.__setitem__('info', item.info)
        temp.__setitem__('process_time',time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(item.process_time)))
        data.append(temp)
    return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))


@exception_logger
def reply_email(request):
    
    data = request.POST.dict()
    send_from = data['send_from']
    send_to = data['send_to']
    send_cc = data['send_cc']
    subject = data['subject']
    content = data['content']
    
    account = EmailAccount.objects.filter(address__contains = send_from).first()
    content = content.replace('<div data="signature">签名位上下1格勿删,自动替换</div>',account.signature)
    
    now_time = int(time.time())
    uid = '1'+str(int(time.time()))[-5:]
    Email.objects.create(status=2,read=1,uid=uid,sent_from = send_from,send_to = send_to,send_cc = send_cc,
         subject = subject,server_id = 'local',date = time.strftime('%Y-%m-%d %X', time.localtime(time.time())),
         content = content,create_time = now_time)
    
    if settings.DEBUG:
        path = settings.STATIC_ROOT +'/static/attachment/'
    else:
        path = settings.STATIC_ROOT +'/attachment/'
    
    file_obj = request.FILES.getlist('files')
    try:
        os.mkdir(path+str(uid))
    except Exception as e:
        pass
    attachment = []
    for item in file_obj:
        attachment.append({'path':path +str(uid)+'/'+ item.name,'name':item.name})
        Attachment.objects.create(create_time = int(time.time(  )),size = 0,email_id = str(uid),file_name = item.name,path='/static/attachment/'+str(uid)+'/'+ item.name)
        with open(path +str(uid)+'/'+ item.name,'wb') as up:
            for chunk in item.chunks():
                up.write(chunk)
        up.close()
    
    
    obj = SendEmail()
    obj.set_info(account.smtp,account.address,account.password)
    obj.send_email(account.address,send_to, None, subject,content,attachment)
    obj.logout()
    
    Email.objects.filter(id = data['email_id']).update(reply = 1)
     
    return HttpResponse('done')

@exception_logger
def getMailAdd(content):
    regex = re.compile(r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b", re.IGNORECASE)
    mails = re.findall(regex, content)
    return mails


@exception_logger
def match_customer(request):
    email_id = request.POST.get('email_id')
    if email_id == None:
        return HttpResponse()
    obj = Email.objects.filter(id = email_id).first()
    emails = getMailAdd(obj.content)
    if len(emails) == 0:
        return HttpResponse('none')
    else:
        cus_list = []
        data = []
        for item in emails:
            cus_list.extend([cs for cs in Customer.objects.filter(email__contains = item).all()])
            
        for item in cus_list:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('company_name', item.company_name)
            temp.__setitem__('name', item.name)
            temp.__setitem__('nation', Nation.objects.filter(id = item.nation).first().nation)
            temp.__setitem__('email', item.email)
            temp.__setitem__('website',item.website)
            temp.__setitem__('sort',item.sort)
            data.append(temp)
            
        return HttpResponse(json.dumps(data,ensure_ascii=False))
    

@exception_logger
def add_black_list(request):
    cs_id = request.POST.get('id')
    obj = Customer.objects.filter(id = cs_id).first()
    obj.customer_grade = 4
    obj.save()
    return HttpResponse('done')


@exception_logger
def search_email(request):
    if request.method == "POST":
        search = request.POST.get('search')
        if search == None:return HttpResponse('')
        
        sql='select id,uid,sent_from,send_to,subject,`date`,`read`,reply,content,customer_id from email  where 1=1 '
        
        search  = search.split(' ')
        for item in search:
            sql+=' and concat(sent_from,send_to,subject,content) like "%%'+item+'%%"'
        
        objs = Email.objects.raw(sql +' order by date desc')
        objs = [item for item in objs]
        total = len(objs)
            
        
        data = []
        for item in objs:
            temp = {}
            temp.__setitem__('id', item.id)
            temp.__setitem__('uid', item.uid)
            try:
                temp.__setitem__('sent_from', eval(item.sent_from)[0]['email'])
            except Exception as e:
                temp.__setitem__('sent_from', item.sent_from)
            try:
                to_list = []
                for each in eval(item.send_to):
                    to_list.append(each['email'].split('@')[0])
                temp.__setitem__('sent_to', ','.join(to_list))
            except Exception as e :
                temp.__setitem__('sent_to',(item.send_to).strip(';'))
            temp.__setitem__('subject', item.subject)
            temp.__setitem__('date', '2016-01-01 00:00:00' if item.date == 'None' else item.date)
            temp.__setitem__('read',item.read)
            temp.__setitem__('reply',item.reply)
            temp.__setitem__('customer_id',item.customer_id)
            temp.__setitem__('customer_name',Customer.objects.filter(id = item.customer_id).first().name if item.customer_id !=0 else '')
            data.append(temp)
        return HttpResponse(json.dumps({'total':total,'rows':data},ensure_ascii=False))
