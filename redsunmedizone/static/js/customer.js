$(function($){
	//<a href="mailto:rsmedizone@yahoo.com">rsmedizone@yahoo.com</a>
	
	$('#customer_list').datagrid({
		fit:true,
		border:false,
		striped:true,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/customer_list/',
        method:'post',
        rownumbers:false,
        singleSelect:false,
        selectOnCheck:false,
        checkOnSelect:false,
        toolbar:'#customer_list_tools',
        rowStyler:function(index,row){
        	return 'background:white'
        },
		columns:[[
			{field:'ck',checkbox:true,},
			{field:'id',title:'<span style="font-size:16px;font-weight: bold;">ID<span>',sortable:true,width:40,align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" style="text-decoration:none;color:blue;" onclick="customerDetail('+rowData.id+')">'+rowData.id+'</a>'
					//return $('<a/>').attr('href','#').css({'text-decoration':'none','color':'blue'})
				},
			},
			{field:'history',title:'历史',sortable:true,width:35,align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					if(rowData.history != 0){
						return '<a href="#" style="text-decoration:none;color:blue;" onclick="OpenHistory('+rowData.id+')" class="icon-mail">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>'
					}else{
						return ''
					}
					
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
		onClickRow:function(row,data){
			//customerDetail(data.id)
		},
	});
	
	
	$('span[data=source_of_customer]').combobox({
	    url:'/get_source_of_customer/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	$('span[data=customer_grade]').combobox({
	    url:'/get_customer_grade/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	$('span[data=communication_situation]').combobox({
	    url:'/get_communication_situation/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	$('span[data=religion]').combobox({
	    url:'/get_religion/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	$('span[data=payment_term]').combobox({
	    url:'/get_payment_term/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	$('span[data=nation]').combobox({
	    url:'/get_nation/',
	    valueField:'id',
	    textField:'text',
	    editable:false,
	});
	
	
	$('#customer_list_tools').find('div[data=search]').searchbox({
		searcher:function(value,name){
			if(value == ''){
				return
			}
			$('#customer_list').datagrid({
				queryParams:{
					search:value,
				}
			});
		}
	});
	
	$('#customer_filter').combobox({
		valueField: 'id',
        textField: 'text',
		panelHeight:150,
		editable:false,
		url:'/get_customer_grade_filter/',
		method:'post',
		onSelect:function(record){
			$('#customer_list').datagrid({
				queryParams:{
					customer_grade:record['id'],
				}
			});
		},
		onLoadSuccess:function(){
			$('#customer_filter').combobox('select','all');
		}
	});
	
	
	//{0:'customer_grade',1:'communication_situation',2:'source_of_customer',3:'religion',4:'payment_term',5:'nation'}
	
	
	$('div[data=communication_situation]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_communication_situation/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">沟通情况<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	
	$('div[data=customer_grade]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_customer_grade/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">用户评级<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	
	$('div[data=source_of_customer]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_source_of_customer/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">来源<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	$('div[data=payment_term]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_payment_term/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">付款方式<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	$('div[data=religion]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_religion/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">付款方式<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	$('div[data=nation]').datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
        url:'/get_nation/',
        method:'get',
        rownumbers:false,
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">国家<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
	});
	
	
	$('#email_history').datagrid({
		fit:true,
		striped:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        url:'/email_history/',
        method:'post',
        rownumbers:false,
        toolbar:'#email_history_tools',
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
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
					return '<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailHistoryDetail(this)">'+row.subject+'</a>'
				}
			},
			{field:'status',title:'所属邮箱',sortable:true,width:fixWidth(0.03),align:'center',halign:'center',},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.06),align:'center',halign:'center',},
		]],
	});
	
});



function addUser(){
	
	$.messager.confirm('添加操作', '确定要添加用户吗?!(6个选项要全部选到才可以!)', function(r){
		if (r){
	
			var data = {}
			var source_of_customer = $('span[data=source_of_customer]').combobox('getValue')
			var customer_grade = $('span[data=customer_grade]').combobox('getValue')
			var communication_situation = $('span[data=communication_situation]').combobox('getValue')
			var religion = $('span[data=religion]').combobox('getValue')
			var payment_term = $('span[data=payment_term]').combobox('getValue')
			var nation = $('span[data=nation]').combobox('getValue')
			if(source_of_customer == ''){return}
			if(customer_grade == ''){return}
			if(communication_situation == ''){return}
			if(religion == ''){return}
			if(payment_term == ''){return}
			if(nation == ''){return}
			$('span[render=value]').each(function(){
				var key = $(this).attr('data')
				var value = $(this).textbox('getText')
				data[key] = value
			})
			
			
			data.source_of_customer = source_of_customer
			data.customer_grade = customer_grade
			data.communication_situation = communication_situation
			data.religion = religion
			data.payment_term = payment_term
			data.nation = nation
			data.sort = 100
			
			$('#loading').show();
			$.ajax({url:'/add_customer/',type:'POST',data:data,success:function(data){
				AlertInfo('green','保存成功','信息保存成功!(窗口自动关闭)')
		        $('#customer_list').datagrid('reload')
				$('#loading').fadeOut();
			},error:function(data){
				AlertInfo('red','保存失败','信息保存失败!(呼叫开发者)')
				$('#loading').fadeOut();
				}
			});
	
	
		}
	});
}

function customerDetail(id){
	$('#loading').show();
	$.ajax({url:'/customer_detail/',type:'POST',data:{'id':id},dataType:"json",success:function(data){
		AlertInfo('green','获取成功','获取成功!(窗口自动关闭)')
        
        $('span[render=value]').each(function(){
			var key = $(this).attr('data')
			var value = $(this).textbox('setText',data[key])
        })
	
		
		$('span[data=sort]').slider('setValue',data.sort)
		$('span[data=source_of_customer]').combobox('select',data.source_of_customer)
		$('span[data=customer_grade]').combobox('select',data.customer_grade)
		$('span[data=communication_situation]').combobox('select',data.communication_situation)
		$('span[data=religion]').combobox('select',data.religion)
		$('span[data=payment_term]').combobox('select',data.payment_term)
		$('span[data=nation]').combobox('select',data.nation)
		$('#customer_selected').text(data.name)
		$('#customer_selected').attr('data',data.id)
		$('#loading').fadeOut();
        
        $('#customer_window').dialog('open');
	},error:function(data){
		AlertInfo('red','获取失败','获取信息失败!(呼叫开发者)')
		$('#loading').fadeOut();
		}
	});
	
	
}

function saveUser(){
	
	$.messager.confirm('保存操作', '确定要保存用户吗?!(需要选中表格中任意一行!并且6个选项要全部选到才可以!)', function(r){
		if (r){
	
				var data = {}
				data.id = $('#customer_selected').attr('data')
				var sort = $('span[data=sort]').slider('getValue')
				var source_of_customer = $('span[data=source_of_customer]').combobox('getValue')
				var customer_grade = $('span[data=customer_grade]').combobox('getValue')
				var communication_situation = $('span[data=communication_situation]').combobox('getValue')
				var religion = $('span[data=religion]').combobox('getValue')
				var payment_term = $('span[data=payment_term]').combobox('getValue')
				var nation = $('span[data=nation]').combobox('getValue')
				if(source_of_customer == ''){return}
				if(customer_grade == ''){return}
				if(communication_situation == ''){return}
				if(religion == ''){return}
				if(payment_term == ''){return}
				if(nation == ''){return}
				$('span[render=value]').each(function(){
					var key = $(this).attr('data')
					var value = $(this).textbox('getText')
					data[key] = value
				})
				
				
				data.source_of_customer = source_of_customer
				data.customer_grade = customer_grade
				data.communication_situation = communication_situation
				data.religion = religion
				data.payment_term = payment_term
				data.nation = nation
				data.sort = sort
				
				$('#loading').show();
				$.ajax({url:'/save_customer/',type:'POST',data:data,success:function(data){
					AlertInfo('green','保存成功','信息保存成功!(窗口自动关闭)')
			        $('#customer_list').datagrid('reload')
					$('#loading').fadeOut();
				},error:function(data){
					AlertInfo('red','保存失败','信息保存失败!(呼叫开发者)')
					$('#loading').fadeOut();
					}
				});
	
	
		}
	});
}



function clearInfoCustomer(){
	$('span[render=value]').each(function(){
		$(this).textbox('setText','')
    });
}

function addSettings(){
	var obj = $('#customer_settings_tabs').tabs('getSelected')
	data_type = $(obj).attr('related');
	param = $(obj).attr('param');
	title = $(obj).attr('call');
	
	$.messager.prompt('添加操作', '添加属性到  <span style="color:red;font-size:16px;">'+title+'</span>  属性中', function(r){
		if (r){
			if($.trim(r) == ''){return}
	    	$('#loading').show();
	    	$.ajax({url:'/add_customer_settings_info/',type:'POST',data:{'data':r,'type':data_type},success:function(data){
	    		if(data == 'repeat'){
	    			AlertInfo('red','添加失败','添加信息有重复!(窗口自动关闭)')
	    		}else{
	    			AlertInfo('green','添加成功','获取信息成功!(窗口自动关闭)')
		            reloadSettingsInfo(param)
	    		}
	            
	    		$('#loading').fadeOut();
	    	},error:function(data){
	    		AlertInfo('red','添加失败','添加信息失败!(呼叫开发者)')
	    		$('#loading').fadeOut();
	    		}
	    	});
		}
	});
	
}

function reloadSettingsInfo(param){
	if(param == 'customer_grade'){
		$('#customer_filter').combobox('reload')
	}
	$('div[data='+param+']').datagrid('reload')
	$('span[data='+param+']').combobox('reload')
}

function OpenHistory(id){
	$('#email_history_win').fadeIn()
	$('#history_tab').tabs()
	$('#email_history').datagrid({
		queryParams:{
			id:id,
		}
	});
}


function EmailHistoryDetail(obj){
	$obj = $(obj)
	var iframe = '<div style="overflow-x:hidden;overflow-y:hidden;height:100%;width:100%"><iframe src="/email_detail/?id='+$obj.attr('data')+'" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="author" allowtransparency="yes"></iframe></div>'
	$('#history_tab').tabs('add',{
		title:'邮件详情',
		closable:true,
		content:iframe,
	});
	
}




