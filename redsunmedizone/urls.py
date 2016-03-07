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
    url(r'email_reply_editor/$', views.email_reply_editor),
    url(r'email_body_template_editor/$', views.email_body_template_editor),
    url(r'file_tree/$', views.static_file_tree),
    url(r'add_dir/$', views.add_dir),
    url(r'add_dir_all/$', views.add_dir_all),
    url(r'upload_file/$', views.upload_file),
    url(r'upload_file_all/$', views.upload_file_all),
    url(r'get_file/$', views.get_file),
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
    url(r'email_list_unread/$', views.email_list_unread),
    url(r'email_list_read/$', views.email_list_read),
    url(r'email_list_sent/$', views.email_list_sent),
    url(r'email_list_draft/$', views.email_list_draft),
    url(r'email_list_trash/$', views.email_list_trash),
    url(r'email_list_inquiry/$', views.email_list_inquiry),
    url(r'email_list_quotation/$', views.email_list_quotation),
    url(r'email_mark_seen/$', views.email_mark_seen),
    url(r'email_detail/$', views.email_detail),
    url(r'change_email_status/$', views.change_email_status),
    url(r'change_email_type/$', views.change_email_type),
    url(r'task_list_main/$', views.task_list_main),
    url(r'change_task_status/$', views.change_task_status),
    url(r'task_list/$', views.task_list),
    url(r'task_detail/$', views.task_detail),
    url(r'reply_email/$', views.reply_email),
    url(r'send_email/$', views.send_email),
    url(r'match_customer/$', views.match_customer),
    url(r'add_black_list/$', views.add_black_list),
]


