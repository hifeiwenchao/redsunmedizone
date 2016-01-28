from django.http.response import HttpResponse
from crm.models import *



def add_communication_situation(requset):
    CommunicationSituation.objects.create(situation = requset.POST.get('data'))
    return HttpResponse('done')

def add_payment_term(requset):
    PaymentTerm.objects.create(term = requset.POST.get('data'))
    return HttpResponse('done')

def add_religion(requset):
    Religion.objects.create(religion = requset.POST.get('data'))
    return HttpResponse('done')

def add_source_of_customer(requset):
    SourceOfCustomer.objects.create(source = requset.POST.get('data'))
    return HttpResponse('done')

