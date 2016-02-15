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
	
	
	
	$('#send_email_from').combobox({
		url:'/mail_account_list/',
	    valueField:'id',
	    textField:'address',
	    editable:false,
	    width:270,
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
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'获取信息失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
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
			$.messager.show({title:'<span style="color:red">添加失败</span>',
	            msg:'邮件地址有重复!(窗口自动关闭)',showType:'slide',timeout:1200,
	            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
	        });
		}else{
			$.messager.show({title:'<span style="color:green">添加成功</span>',
	            msg:'信息添加成功!(窗口自动关闭)',showType:'slide',timeout:1200,
	            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
	        });
	        $('#mail_account_list').datalist('reload')
		}
		
        
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'信息添加失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
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
        $.messager.show({title:'<span style="color:green">保存成功</span>',
            msg:'信息保存成功!(窗口自动关闭)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        $('#mail_account_list').datalist('reload')
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'信息保存失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
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
