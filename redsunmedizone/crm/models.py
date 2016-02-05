from django.db import models


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
    photo_url = models.CharField(max_length=256,default='')
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
    purchasing_preference = models.CharField(max_length=256,default='')
    payment_term = models.IntegerField(default=1)
    sort = models.IntegerField(default=0)
    class Meta:
        managed = False
        db_table = 'customer'
        






















