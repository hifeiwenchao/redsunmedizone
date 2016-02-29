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
	});
	
	
	
	
	$('#email_list').datagrid({
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
        url:'/email_list/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
			// return inline style
			// the function can return predefined css class and inline style
			//return {class:'nothover'};	
    	},
		columns:[[
			{field:'sent_from',title:'发件人',sortable:true,width:fixWidth(0.07),align:'center',halign:'center',},
			{field:'sent_to',title:'收件人',sortable:true,width:fixWidth(0.04),align:'center',halign:'center',},
			{field:'subject',title:'Subject',sortable:true,width:fixWidth(0.15),align:'left',halign:'center',},
			{field:'date',title:'接收日期',sortable:true,width:fixWidth(0.08),align:'center',halign:'center',},
			{field:'operate',title:'操作',sortable:true,width:fixWidth(0.04),align:'center',halign:'center',
				formatter:function(value,row,index){
					return'<a href="#" style="text-decoration:none;color:blue;" data="'+row.id+'" onclick="EmailDetail(this)">查看</a>'+
					'<span style="margin:0 5px 0 5px"></span>'
					
				}
			},
		]],
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
	$('#email_send_to').textbox('setText',address)
	$('#send_email').dialog('open')
}



function sendEmail(){
	alert('1')
}
/**
 function emailAccountDetail(id){
	$('#loading').show();
	$.ajax({url:'/save_customer/',type:'POST',data:{'id':id},success:function(data){
        $.messager.show({title:'<span style="color:green">获取信息成功</span>',
            msg:'信息获取成功!(窗口自动关闭)',showType:'slide',
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        $('#customer_list').datagrid('reload')
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'信息保存失败!(呼叫开发者)',showType:'slide',
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('#loading').fadeOut();
		}
	});
}
 */

function EmailDetail(obj){
	$obj = $(obj)
	var iframe = '<div style="overflow-x:hidden;overflow-y:hidden;height:100%;width:100%"><iframe src="/email_detail/?id='+$obj.attr('data')+'" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="author" allowtransparency="yes"></iframe></div>'
	$('#mail_tab').tabs('add',{
		title:'邮件详情',
		closable:true,
		content:iframe,
	});
	
	$.ajax({url:'/email_mark_seen/',type:'GET',data:{'id':$obj.attr('data')},success:function(data){
        $('#email_list').datagrid('reload')
	},error:function(data){
		AlertInfo('red','标记失败','标记已读状态失败!(呼叫开发者)!')
		}
	});
	
}



