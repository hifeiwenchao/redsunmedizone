$(function($){
	
	$('#mail_account_list').datalist({
		fit:true,
		border:true,
		url:'/mail_account_list/',
		columns:[[
          {field:'address',align:'left',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	emailAccountDetail(row.id)
        },
	});
	
	$('#email_send_from').combobox({
		url:'/mail_account_list/',
	    valueField:'id',
	    textField:'address',
	    editable:false,
	    width:270,
	    onLoadSuccess:function(){
	    	$(this).combobox('select',11)
	    },
	});
	
	$('#email_list_unread').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_unread/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="MarkSeen(this)">已读</a>' +
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailStatus('+row.id+',4)">垃圾</a>'
				}
			},
		]],
	});
	
	
	$('#email_list_read').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_read/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
            {field:'type',title:' ',width:fixWidth(0.01),align:'center',halign:'center',
            	formatter:function(value,row,index){
            		if(row.type == 1){
            			return '<img src="/static/img/inquiry.png" />'
            		}else{
            			return ''
            		}
            	}
            },
            {field:'reply',title:' ',width:fixWidth(0.01),align:'center',halign:'center',
            	formatter:function(value,row,index){
            		if(row.reply == 1){
            			return '<img src="/static/img/reply.png" />'
            		}else{
            			return ''
            		}
            	}
            },
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',
            	formatter:function(value,row,index){
					sent_list = value.split(';')
					content = ''
					for(i in sent_list){
						content += '<a href="#" style="text-decoration:none;color:blue;margin-right:15px;" email="'+value+'" row_index="'+index+'"  class="ReadSentFrom" onclick="openFromCustomerList(\''+value+'\')">'+sent_list[i]+'</a>'
					}
					return '<div style="word-break:break-all; word-wrap:break-word;">'+content+'</div>'
				}
			},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailType('+row.id+',1)">询盘</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailStatus('+row.id+',4)">垃圾</a>'
					
				}
			},
		]],
		onBeforeLoad:function(param){
        	$('.ReadSentFrom').tooltip('destroy')
        },
        onLoadSuccess:function(data){
    		$('.ReadSentFrom').each(function(){
    			$(this).tooltip({
            	    position:'top',
            	    content: $('<div></div>'),
            	    onUpdate: function(cc){
                        cc.panel({
                            width: 500,
                            loadingMessage:'用户信息检索中.....',
                            height:'auto',
                            border:false,
                            href: '/customer_detail_info/?email='+$(this).attr('email')
                        });
                    }
            	});
    		})	
        },
	});
	
	
	
	
	$('#email_list_send').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_sent/',
        method:'post',
        rownumbers:false,
		columns:[[
			{field:'type',title:' ',width:fixWidth(0.01),align:'center',halign:'center',
				formatter:function(value,row,index){
					if(row.type == 2){
						return '<img src="/static/img/quotation.png" />'
					}else{
						return ''
					}
				}
			},
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',
				formatter:function(value,row,index){
					sent_list = value.split(';')
					content = ''
					for(i in sent_list){
						content += '<a href="#" style="text-decoration:none;color:blue;margin-right:15px;"  onclick="openFromCustomerList(\''+value+'\')">'+sent_list[i]+'</a>'
					}
					return '<div style="word-break:break-all; word-wrap:break-word;">'+content+'</div>'
				}
			},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'发送日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailType('+row.id+',2)">报价</a>'
				}
			},
		]],
	});
	
	
	$('#email_list_draft').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_draft/',
        method:'post',
        rownumbers:false,
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'发送日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'
				}
			},
		]],
	});
	
	$('#email_list_trash').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_trash/',
        method:'post',
        rownumbers:false,
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'发送日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="MatchCustomer('+row.id+')">匹配客户</a>'
				}
			},
		]],
	});
	
	
	
	$('#email_list_inquiry').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_inquiry/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',
				formatter:function(value,row,index){
					sent_list = value.split(';')
					content = ''
					for(i in sent_list){
						content += '<a href="#" style="text-decoration:none;color:blue;margin-right:15px;"  onclick="openFromCustomerList(\''+value+'\')">'+sent_list[i]+'</a>'
					}
					return '<div style="word-break:break-all; word-wrap:break-word;">'+content+'</div>'
				}
			},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailType('+row.id+',1)">询盘</a>'
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailStatus('+row.id+',4)">垃圾</a>'
					
				}
			},
		]],
	});
	
	
	$('#email_list_quotation').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/email_list_quotation/',
        method:'post',
        rownumbers:false,
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',
				formatter:function(value,row,index){
					sent_list = value.split(';')
					content = ''
					for(i in sent_list){
						content += '<a href="#" style="text-decoration:none;color:blue;margin-right:15px;"  onclick="openFromCustomerList(\''+value+'\')">'+sent_list[i]+'</a>'
					}
					return '<div style="word-break:break-all; word-wrap:break-word;">'+content+'</div>'
				}
			},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.08),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'date',title:'发送日期',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetailRead(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'+
					'<a href="#" style="text-decoration:none;color:blue;"  onclick="ChangeEmailType('+row.id+',2)">报价</a>'
				}
			},
		]],
	});
	
	
	$('#trash_like_info').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:false,//分页控件 
        url:'/match_customer/',
        method:'post',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<span style="font-size:16px;font-weight: bold;">ID<span>',sortable:true,width:40,align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" style="text-decoration:none;color:blue;" onclick="customerDetail('+rowData.id+')">'+rowData.id+'</a>'
					//return $('<a/>').attr('href','#').css({'text-decoration':'none','color':'blue'})
				},
			},
			{field:'history',title:'历史',sortable:true,width:35,align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" style="text-decoration:none;color:blue;" class="icon-mail">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>'
				},
			},
			{field:'company_name',title:'<span style="font-size:16px;font-weight: bold;">公司名<span>',sortable:true,width:fixWidth(0.12),align:'left',halign:'center',},
			{field:'name',title:'<span style="font-size:16px;font-weight: bold;">人名<span>',sortable:true,width:fixWidth(0.1),align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" style="text-decoration:none;color:blue;" onclick="customerDetail('+rowData.id+')">'+rowData.name+'</a>'
				},
			},
			{field:'nation',title:'<span style="font-size:16px;font-weight: bold;">国家<span>',sortable:true,width:fixWidth(0.05),align:'center',halign:'center',
                                 formatter: function(value,rowData,rowIndex){
                                           if (rowData.sort == 100){
                                                  return '<span style="color:red">'+rowData.nation+'</span>';
                                           }else{
                                                  return rowData.nation;
                                           }
                                 },
                        },
			{field:'email',title:'<span style="font-size:16px;font-weight: bold;">邮箱<span>',sortable:true,width:fixWidth(0.15),align:'center',halign:'center',
                formatter:function(value,row,index){
                	var email = $.trim(row.email)
                	email = email.split('\n')
                	var content = ''
                	var format_address = ''
                	for(j in email){
                		format_address += email[j] +';'
                	}
                	for(i in email){
                		content += '<div><a style="text-decoration:none;color:blue;" href="#" onclick="openFromCustomerList(\''+format_address+'\')">'+email[i]+'</a></div>'
                	}
                	return content
                }
			},
			{field:'website',title:'<span style="font-size:16px;font-weight: bold;">网站<span>',sortable:true,width:fixWidth(0.11),align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					if($.trim(rowData.website) == ''){
						return rowData.website
					}else{
						return '<a style="text-decoration:none;color:blue;" href="http://'+rowData.website+'" target="_blank">'+rowData.website+'</a>'
					}
				},
			},
		]],
	});
	
	
	$('#email_searchbox').searchbox({
		searcher:function(value,name){
			if($.trim(value) == ''){return}
			$('#email_search').fadeIn();
			$('#email_search_info').datagrid({
				queryParams:{
					search:value,
				}
			});
			
		},
		width:250,
		prompt:'发件人,收件人,Subject,内容等'
	});
	
	
	
	$('#email_search_info').datagrid({
		fit:true,
		striped:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        url:'/search_email/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
            {field:'reply',title:' ',width:fixWidth(0.01),align:'center',halign:'center',
            	formatter:function(value,row,index){
            		if(row.reply == 1){
            			return '<img src="/static/img/reply.png" />'
            		}else{
            			return ''
            		}
            	}
            },
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',
            	formatter:function(value,row,index){
                	return  '<div><a style="text-decoration:none;color:blue;" href="#" onclick="openFromCustomerList(\''+row.sent_from+'\')">'+row.sent_from+'</a></div>'
                }
			},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',
				formatter:function(value,row,index){
                	return  '<div><a style="text-decoration:none;color:blue;" href="#" onclick="openFromCustomerList(\''+row.sent_to+'\')">'+row.sent_to+'</a></div>'
                }
			},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.14),align:'left',halign:'center',
				formatter:function(value,row,index){
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'customer_id',title:'关联客户',sortable:true,width:fixWidth(0.06),align:'left',halign:'center',
				formatter:function(value,row,index){
					if(row.customer_id != 0){
						return '<a href="#" style="text-decoration:none;color:blue;" onclick="customerDetail('+row.customer_id+')">'+row.customer_name+'</a>'
					}else{
						return ''
					}
				}
			},
			{field:'status',title:'所属邮箱',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',},
		]],
	});
	
	
	$('#send_email').dialog({
		openAnimation:'show',
		width:1200,
		height:$(window).height()*0.95,
		closed:true,
		collapsible:true,
		resizable:true,
		iconCls: 'icon-mail',
		buttons: [
		          {
		        	  text:'发送',iconCls:'icon-mail',handler:function(){
		        		  sendEmail();
		          }},{
		        	  text:'关闭',iconCls:'icon-cancel',handler:function(){
		        		  $('#send_email').dialog('close');
		        	  }}
		          ],
	});
	
	
	
	
	
});


function emailAccountDetail(id){
	$('#loading').show();
	$.ajax({url:'/mail_account_detail/',type:'POST',data:{'id':id},dataType:'json',success:function(data){
        $.messager.show({title:'<span style="color:green">获取信息成功</span>',
            msg:'信息获取成功!(窗口自动关闭)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        
        $('input[data=mail_settings_email]').textbox('setText',data.address)
		$('input[data=mail_settings_password]').textbox('setText',data.password)
		$('input[data=mail_settings_imap]').textbox('setText',data.imap)
		$('input[data=mail_settings_smtp]').textbox('setText',data.smtp)
		if(data.status == 0){
			$('#mail_settings_status').switchbutton('uncheck')
		}else{
			$('#mail_settings_status').switchbutton('check')
		}
        mail_signature.window.setText(data.signature)
        //nicEditors.findEditor('mail_signature').setContent(data.signature)
        $('#mail_settings_load_info').attr('data',data.id)
        $('#mail_settings_load_info').html(data.address)
        
		$('#loading').fadeOut();
	},error:function(data){
		AlertInfo('red','保存失败','获取信息失败!(呼叫开发者)')
		$('#loading').fadeOut();
		}
	});
}

function addMailAccount(){
	var data = {}
	if($('#mail_settings_status').switchbutton('options').checked == true){
		data.status = 1
	}else{
		data.status = 0
	}
	data.address = $('input[data=mail_settings_email]').textbox('getText')
	data.password = $('input[data=mail_settings_password]').textbox('getText')
	data.imap = $('input[data=mail_settings_imap]').textbox('getText')
	data.smtp = $('input[data=mail_settings_smtp]').textbox('getText')
	data.signature = mail_signature.window.getText()
	
	if($.trim(data.address) == '' || $.trim(data.password) == '' || $.trim(data.imap) == '' || $.trim(data.smtp) == '' ){
		return
	}
	
	$('#loading').show();
	$.ajax({url:'/mail_account_add/',type:'POST',data:data,success:function(data){
		if(data == 'repeat'){
			AlertInfo('red','添加失败','邮件地址有重复!(窗口自动关闭)')
		}else{
			AlertInfo('greed','添加成功','信息添加成功!(窗口自动关闭)')
	        $('#mail_account_list').datalist('reload')
		}
        
		$('#loading').fadeOut();
	},error:function(data){
		AlertInfo('red','保存失败','信息添加失败!(呼叫开发者)');
		$('#loading').fadeOut();
		}
	});
}

function saveMailAccount(){
	var data = {}
	data.id = $('#mail_settings_load_info').attr('data')
	if(data.id == ''){return}
	if($('#mail_settings_status').switchbutton('options').checked == true){
		data.status = 1
	}else{
		data.status = 0
	}
	data.address = $('input[data=mail_settings_email]').textbox('getText')
	data.password = $('input[data=mail_settings_password]').textbox('getText')
	data.imap = $('input[data=mail_settings_imap]').textbox('getText')
	data.smtp = $('input[data=mail_settings_smtp]').textbox('getText')
	data.signature = mail_signature.window.getText()
	
	if($.trim(data.address) == '' || $.trim(data.password) == '' || $.trim(data.imap) == '' || $.trim(data.smtp) == '' ){
		return
	}
	
	$('#loading').show();
	$.ajax({url:'/mail_account_save/',type:'POST',data:data,success:function(data){
		AlertInfo('greed','保存成功','信息保存成功!(窗口自动关闭)');
        $('#mail_account_list').datalist('reload')
		$('#loading').fadeOut();
	},error:function(data){
		AlertInfo('red','保存失败','信息保存失败!(呼叫开发者)');
		$('#loading').fadeOut();
		}
	});
}

function openFromCustomerList(address){
	$('#email_send_to').textbox('setValue',address)
	$('#send_email').dialog('open')
}



function sendEmail(){
	var send_from = $('#email_send_from').combobox('getValue')
	if(send_from == ''){AlertInfoHard('red','发件人必须选择','发件人必须选择!')}
	var send_to = $('#email_send_to').textbox('getValue')
	if($.trim(send_to) == ''){AlertInfoHard('red','收件人必须填写','收件人必须填写!')}
	var send_cc = $('#email_send_cc').textbox('getValue')
	var subject = $('#email_subject').textbox('getValue')
	var content = email_send_content.window.getText()
	var data = new FormData();
	var file = $('#files')[0].files;
	if(file.length != 0){
		for(var i=0;i<file.length;i++){
			data.append("files",file[i])
		}
	}
	data.append('send_from',send_from)
	data.append('send_to',send_to)
	data.append('send_cc',send_cc)
	data.append('subject',subject)
	data.append('content', content)
	
	$('#loading').show()
	$.ajax({url:'/send_email/', type: 'POST',
		xhr: function() {
	        myXhr = $.ajaxSettings.xhr();
	        return myXhr;
	    },
	    success: function(data){
	    	$('#email_list_send').datagrid('reload')
	    	$('#loading').fadeOut('slow')
	    	AlertInfoHard('greed','发送成功','邮件发送成功!')
	    },
	    error: function(data){
	    	$('#loading').fadeOut('slow')
	    	AlertInfoHard('red','发送失败','邮件发送失败!(请联系管理员)')
	    },
	    data: data,
	    cache: false,
	    contentType: false,
	    processData: false
	});
	
	
}

function EmailDetail(obj){
	$obj = $(obj)
	var iframe = '<div style="overflow-x:hidden;overflow-y:hidden;height:100%;width:100%"><iframe src="/email_detail/?id='+$obj.attr('data')+'" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="author" allowtransparency="yes"></iframe></div>'
	$('#mail_tab').tabs('add',{
		title:'邮件详情',
		closable:true,
		content:iframe,
	});
	
	$.ajax({url:'/email_mark_seen/',type:'GET',data:{'id':$obj.attr('data')},success:function(data){
        $('#email_list_unread').datagrid('reload')
	},error:function(data){
		AlertInfo('red','标记失败','标记已读状态失败!(呼叫开发者)!')
		}
	});
	
}

function EmailDetailRead(obj){
	$obj = $(obj)
	var iframe = '<div style="overflow-x:hidden;overflow-y:hidden;height:100%;width:100%"><iframe src="/email_detail/?id='+$obj.attr('data')+'" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="author" allowtransparency="yes"></iframe></div>'
	$('#mail_tab').tabs('add',{
		title:'邮件详情',
		closable:true,
		content:iframe,
	});
}

function MarkSeen(obj){
	$obj = $(obj)
	$.ajax({url:'/email_mark_seen/',type:'GET',data:{'id':$obj.attr('data')},success:function(data){
        $('#email_list_unread').datagrid('reload')
        $('#email_list_read').datagrid('reload')
	},error:function(data){
		AlertInfo('red','标记失败','标记已读状态失败!(呼叫开发者)!')
		}
	});
}

function ChangeEmailStatus(id,status){
	$.ajax({url:'/change_email_status/',type:'POST',data:{'email_id':id,'status':status},success:function(data){
        $('#email_list_unread').datagrid('reload')
        $('#email_list_read').datagrid('reload')
	},error:function(data){
		AlertInfo('red','标记失败','标记状态失败!(呼叫开发者)!')
		}
	});
}

function ChangeEmailType(id,type){
	$.ajax({url:'/change_email_type/',type:'POST',data:{'email_id':id,'type':type},success:function(data){
        $('#email_list_send').datagrid('reload')
        $('#email_list_read').datagrid('reload')
        $('#email_list_quotation').datagrid('reload')
        $('#email_list_inquiry').datagrid('reload')
        AlertInfo('green','标记成功','标记类型成功!')
	},error:function(data){
		AlertInfo('red','标记失败','标记类型失败!(呼叫开发者)!')
		}
	});
}

function MatchCustomer(id){
	$('#trash_customer_info').fadeIn()
	
	$('#trash_like_info').datagrid({
		queryParams:{
			email_id:id,
		}
	});
	/*
	$('#loading').show()
	$.ajax({url:'/match_customer/',type:'POST',data:{'email_id':id},success:function(data){
		$('#loading').fadeOut()
		
		AlertInfo('green','匹配成功','匹配成功!')
	},error:function(data){
		$('#loading').fadeOut()
		AlertInfo('red','匹配失败','匹配失败,服务器出错!(呼叫开发者)!')
		}
	});
	*/
}

function AddBlackList(){
	var row_data = $('#trash_like_info').datagrid('getSelected')
	if(row_data == null){return}
	console.log(row_data.id)
	
	$('#loading').show()
	$.ajax({url:'/add_black_list/',type:'POST',data:{'id':row_data.id},success:function(data){
		$('#loading').fadeOut()
		AlertInfo('green','转移成功','转移到无效客户中!')
	},error:function(data){
		$('#loading').fadeOut()
		AlertInfo('red','转移失败','转移失败,服务器出错!(呼叫开发者)!')
		}
	});
}



