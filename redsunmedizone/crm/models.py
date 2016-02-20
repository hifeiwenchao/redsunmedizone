from django.db import models


class Users(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    username = models.CharField(max_length=64,default='')
    password = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'users'

class Category(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    category = models.CharField(max_length=32,default='')
    class Meta:
        managed = False
        db_table = 'category' 

class CommunicationSituation(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    situation = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'communication_situation'
    
class CustomerGrade(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    grade = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'customer_grade'
        
    
class PaymentTerm(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    term = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'payment_term'
        
class Religion(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    religion = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'religion'
        
class SourceOfCustomer(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    source = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'source_of_customer'

class Nation(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    nation = models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'nation'

class Customer(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    customer_grade = models.IntegerField(default=1)
    company_name = models.CharField(max_length=256,default='')
    source_of_customer = models.IntegerField(default=1)
    nation = models.IntegerField(default=1)
    time_difference = models.CharField(max_length=256,default='')
    working_time = models.CharField(max_length=256,default='')
    name = models.CharField(max_length=256,default='')
    birthday = models.CharField(max_length=256,default='')
    job_title = models.CharField(max_length=256,default='')
    website = models.CharField(max_length=256,default='')
    office_address = models.CharField(max_length=512,default='')
    email = models.CharField(max_length=512,default='')
    phone = models.CharField(max_length=32,default='')
    facebook = models.CharField(max_length=512,default='')
    skype = models.CharField(max_length=512,default='')
    religion = models.IntegerField(default=1)
    hobby = models.CharField(max_length=1024,default='')
    family_member = models.CharField(max_length=32,default='')
    communication_situation = models.IntegerField(default=1)
    purchase_intention = models.CharField(max_length=1024,default='')
    payment_term = models.IntegerField(default=1)
    sort = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'customer'
        



class EmailAccount(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    address = models.CharField(max_length=64,default='')
    password = models.CharField(max_length=64,default='')
    imap = models.CharField(max_length=64,default='')
    smtp = models.CharField(max_length=64,default='')
    signature = models.CharField(max_length=1024,default='')
    status = models.IntegerField(default=0)
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_account'


class Finance(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    status = models.IntegerField(default=0)
    remark = models.CharField(max_length=1024,default='')
    order_id = models.IntegerField(default=0)
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'finance'
    
    
class EmailTask(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    status = models.IntegerField(default=0)
    name = models.CharField(max_length=128,default='')
    interval = models.IntegerField(default=5)
    remark = models.CharField(max_length=1024,default='')
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_task'
        
        
        
class EmailTaskDetail(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    email_task_id = models.IntegerField(default=0)
    customer_id = models.IntegerField(default=0)
    status = models.IntegerField(default=0)
    send_from = models.CharField(max_length=128,default='')
    send_to = models.CharField(max_length=128,default='')
    subject = models.CharField(max_length=256,default='')
    content = models.TextField(default='')
    remark = models.CharField(max_length=1024,default='')
    result = models.IntegerField(default=0)
    info = models.CharField(max_length=256,default='')
    update_time = models.IntegerField(default=0)
    process_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_task_detail'

class EmailLog(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    type = models.IntegerField(default=0)
    status = models.IntegerField(default=0)
    task = models.IntegerField(default=0)
    email_task_id = models.IntegerField(default=0)
    email_task_detail_id = models.IntegerField(default=0)
    email_id = models.IntegerField(default=0)
    info = models.CharField(max_length=256,default='')
    create_time =models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_log'

class EmailSubjectTemplate(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    type = models.IntegerField(default=0)
    content = models.CharField(max_length=512,default='')
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_subject_template'
        
class EmailBodyTemplate(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    category_id = models.IntegerField(default=0)
    type = models.IntegerField(default=0)
    content = models.TextField(default='')
    create_time = models.IntegerField(default=0)
    title =  models.CharField(max_length=64,default='')
    class Meta:
        managed = False
        db_table = 'email_body_template'    
        
class EmailAttachmentTemplate(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    file_name =  models.CharField(max_length=128,default='')
    path =  models.CharField(max_length=128,default='')
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email_attachment_template'        
    

class Attachment(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    email_id = models.IntegerField(default=0)
    email_task_detail_id = models.IntegerField(default=0)
    email_template_id = models.IntegerField(default=0)
    finance = models.IntegerField(default=0)
    file_name =  models.CharField(max_length=128,default='')
    path =  models.CharField(max_length=128,default='')
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'attachment'

class Email(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    status = models.IntegerField(default=0)
    type = models.IntegerField(default=0)
    read = models.IntegerField(default=0)
    uid = models.IntegerField(default=0)
    sent_from = models.CharField(max_length=1024,default='')
    send_to = models.CharField(max_length=1024,default='')
    send_cc = models.CharField(max_length=1024,default='')
    subject = models.CharField(max_length=1024,default='')
    server_id = models.CharField(max_length=256,default='')
    date = models.CharField(max_length=128,default='')
    content = models.TextField(default='')
    create_time = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'email'
    


class Memo(models.Model):
    id = models.IntegerField(blank=True,primary_key=True)
    date = models.CharField(max_length=64,default='')
    memo = models.CharField(max_length=1024,default='')
    class Meta:
        managed = False
        db_table = 'memo'
    












