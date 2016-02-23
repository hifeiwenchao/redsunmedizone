from django.shortcuts import render
from django.http.response import HttpResponse, HttpResponseRedirect
from crm.models import *
import json
import time
from django.conf import settings
import os
import shutil


def index(request):
    if request.session.__contains__('username') == False:
        return render(request, 'login.html') 
    else:
        return render(request, 'index.html')

def login(request):
    obj = Users.objects.filter(**{'username':request.POST.get('username'),'password':request.POST.get('password')}).first()
    if obj != None:
        request.session.__setitem__('username','adminhou')
        return HttpResponse('done')
    return HttpResponse('error')

def logout(request):
    request.session.clear()
    return HttpResponseRedirect('/')

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
    
def memo_mark(request):
    objs = Memo.objects.exclude(memo ='').all()
    date_list = [item.date for item in objs]
    return HttpResponse(json.dumps(date_list,ensure_ascii=False))
    
def customer_list(request):
    try:
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
    except Exception as e:
        print(e)
    



def get_communication_situation(requset):
    objs = CommunicationSituation.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.situation)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))    
        
def get_customer_grade(requset):
    objs = CustomerGrade.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.grade)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

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

def get_payment_term(requset):
    objs = PaymentTerm.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.term)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

def get_religion(requset):
    objs = Religion.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.religion)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

def get_source_of_customer(requset):
    objs = SourceOfCustomer.objects.order_by('id').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.source)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

def get_nation(requset):
    objs = Nation.objects.order_by('nation').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('text', item.nation)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))


def get_product_category(request):
    objs = Category.objects.order_by('id').using('website').all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('category', item.category)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))

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

def add_customer(request):
    if request.method == "POST":
        info = request.POST.dict()
        info['name'] = str(info['name']).upper()
        Customer.objects.create(**info)
        return HttpResponse('done')
        
def save_customer(request):
    if request.method == "POST":
        cid = request.POST.get('id')
        new_data = request.POST.dict()
        new_data['name'] = str(new_data['name']).upper()
        del new_data['id']
        Customer.objects.filter(id = int(cid)).update(**new_data)
        return HttpResponse('done')
   
def customer_detail(request):
    if request.method == "POST":
        obj = Customer.objects.filter(id = int(request.POST.get('id'))).first()
        data = {}
        for item in obj._meta.fields:
            data.__setitem__(item.name,eval('obj.'+item.name))
        return HttpResponse(json.dumps(data,ensure_ascii=False))   

def email_settings_editor(request):
    return render(request,'email_settings_editor.html')

def email_send_editor(request):
    return render(request,'email_send_editor.html')

def email_body_template_editor(request):
    return render(request,'email_body_template_editor.html')


def mail_account_list(request):
    objs = EmailAccount.objects.filter().all()
    data = []
    for item in objs:
        temp = {}
        temp.__setitem__('id', item.id)
        temp.__setitem__('address', item.address)
        data.append(temp)
    return HttpResponse(json.dumps(data,ensure_ascii=False))  

def mail_account_detail(request):
    obj = EmailAccount.objects.filter(id = int(request.POST.get('id'))).first()
    data = {}
    for item in obj._meta.fields:
        data.__setitem__(item.name,eval('obj.'+item.name))
    return HttpResponse(json.dumps(data,ensure_ascii=False))   

def mail_account_add(request):
    info = request.POST.dict()
    if(EmailAccount.objects.filter(address__contains = info['address']).first() != None):
        return HttpResponse('repeat')
    info.__setitem__('create_time',int(time.time()))
    EmailAccount.objects.create(**info)
    return HttpResponse('done')
        
def mail_account_save(request):
    new_data = request.POST.dict()
    del new_data['id']
    EmailAccount.objects.filter(id = int(request.POST.get('id'))).update(**new_data)
    return HttpResponse('done')
    
def static_file_tree(request):
        
    if settings.DEBUG:
        if request.GET.get('type') == None:
            STATIC_ROOT = settings.STATIC_ROOT+'/static/public'
        else:
            STATIC_ROOT = settings.STATIC_ROOT+'/static'
    else:
        if request.GET.get('type') == None:
            STATIC_ROOT = settings.STATIC_ROOT +'/public'
        else:
            STATIC_ROOT = settings.STATIC_ROOT
    
    dir_tree = path_to_dict(STATIC_ROOT)
    
    return HttpResponse(json.dumps([dir_tree],ensure_ascii=False))
    
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

  

def remove_dir(request):
    try:
        true_path = request.POST.get('true_path')
        
        if settings.DEBUG:
            STATIC_ROOT = settings.STATIC_ROOT +'/static'
        else:
            STATIC_ROOT = settings.STATIC_ROOT
        shutil.rmtree(STATIC_ROOT+true_path)
        return HttpResponse('done')
    except Exception as e:
        print(e)
        



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


def remove_file(request):
    pass

        
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

def add_subject_template(request):
    EmailSubjectTemplate.objects.create(**{'type':request.POST.get('type'),'content':request.POST.get('content'),'create_time':int(time.time())})
    return HttpResponse('done')
    
def edit_subject_template(request):
    EmailSubjectTemplate.objects.filter(id = request.POST.get('id')).update(content = request.POST.get('content'))
    return HttpResponse('done')

def get_subject_template_detail(request):
    obj = EmailSubjectTemplate.objects.filter(id = request.GET.get('id')).first()
    data = {}
    data.__setitem__('content',obj.content)
    return HttpResponse(json.dumps(data,ensure_ascii=False))  
    
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

def add_body_template(request):
    data = {'title':request.POST.get('title'),'category_id':request.POST.get('category_id'),'type':request.POST.get('type'),'content':request.POST.get('content'),'create_time':int(time.time())}
    obj = EmailBodyTemplate.objects.filter(content__contains =request.POST.get('content'),type = request.POST.get('type')).first()
    if(obj != None):
        return HttpResponse('repeat')
    else:
        EmailBodyTemplate.objects.create(**data)
        return HttpResponse('done')

def edit_body_template(request):
    data = {'title':request.POST.get('title'),'category_id':request.POST.get('category_id'),'type':request.POST.get('type'),'content':request.POST.get('content')}
    EmailBodyTemplate.objects.filter(id =request.POST.get('id')).update(**data)
    return HttpResponse('done')



def get_body_template_detail(request):
    obj = EmailBodyTemplate.objects.filter(id = request.GET.get('id')).first()
    data = {}
    data.__setitem__('title', obj.title)
    data.__setitem__('category_id', obj.category_id)
    data.__setitem__('type', obj.type)
    data.__setitem__('content', obj.content)
    return HttpResponse(json.dumps(data,ensure_ascii=False))


    

def get_attachment_template(request):
    pass



def get_email_box(request):
    pass
    
    
    
    
def add_email_task(request):
    print(request.POST.dict())
    return HttpResponse('done')
    
    
