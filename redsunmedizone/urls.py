"""rsmedizone URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url
from django.views.generic.base import RedirectView
from crm import views


urlpatterns = [
    url(r'^favicon.ico$', RedirectView.as_view(url='/static/favicon.ico')),
    url(r'^$', views.index),
    url(r'^login/$', views.login),
    url(r'^logout/$', views.logout),
    url(r'^memo_handler/$', views.memo_handler),
    url(r'^memo_mark/$', views.memo_mark),
    url(r'customer_list/$', views.customer_list),
    url(r'indexcustomer_detail/$', views.customer_detail),
    url(r'get_communication_situation/$', views.get_communication_situation),
    url(r'get_customer_grade/$', views.get_customer_grade),
    url(r'get_customer_grade_filter/$', views.get_customer_grade_filter),
    url(r'get_payment_term/$', views.get_payment_term),
    url(r'get_religion/$', views.get_religion),
    url(r'get_source_of_customer/$', views.get_source_of_customer),
    url(r'get_nation/$', views.get_nation),
    url(r'get_product_category/$', views.get_product_category),
    url(r'add_customer_settings_info/$', views.add_customer_settings_info),
    url(r'add_customer/$', views.add_customer),
    url(r'save_customer/$', views.save_customer),
    url(r'customer_detail/$', views.customer_detail),
    url(r'mail_account_list/$', views.mail_account_list),
    url(r'mail_account_detail/$', views.mail_account_detail),
    url(r'mail_account_add/$', views.mail_account_add),
    url(r'mail_account_save/$', views.mail_account_save),
    url(r'email_settings_editor/$', views.email_settings_editor),
    url(r'email_send_editor/$', views.email_send_editor),
    url(r'email_body_template_editor/$', views.email_body_template_editor),
    url(r'file_tree/$', views.static_file_tree),
    url(r'add_dir/$', views.add_dir),
    #url(r'remove_dir/$', views.remove_dir),
    url(r'upload_file/$', views.upload_file),
    url(r'get_subject_template/$', views.get_subject_template),
    url(r'add_subject_template/$', views.add_subject_template),
    url(r'edit_subject_template/$', views.edit_subject_template),
    url(r'get_subject_template_detail/$', views.get_subject_template_detail),
    url(r'get_body_template/$', views.get_body_template),
    url(r'add_body_template/$', views.add_body_template),
    url(r'get_body_template_detail/$', views.get_body_template_detail),
    url(r'edit_body_template/$', views.edit_body_template),
    url(r'get_attachment_template/$', views.get_attachment_template),
    url(r'add_email_task/$', views.add_email_task),
    url(r'email_list/$', views.email_list),
    
]


