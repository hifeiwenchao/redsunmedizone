$(function($){
	
	
	$('#email_task_target').datalist({
		singleSelect:false,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		loadMsg:'加载中...',
		rownumbers:false,
		showHeader:true,
		columns:[[
			  {field:'ck',checkbox:true,},
			  {field:'email',align:'left',halign:'center',text:' ',fixed:true},
			  {field:'id',align:'center',hidden:true,}
        ]],
	});
	
	
	$('#email_task_send').datalist({
		singleSelect:false,
		checkbox: true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		loadMsg:'加载中...',
		url:'/mail_account_list/',
		method:'get',
		rownumbers:false,
		showHeader:true,
		columns:[[
          {field:'address',align:'left',},
          {field:'id',align:'center',hidden:true,}
	      ]],
	});
	
	
	
	$("#email_task_subject").datalist({
		singleSelect:false,
		checkbox: true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		loadMsg:'加载中...',
		url:'/get_subject_template/',
		method:'get',
		rownumbers:false,
		showHeader:true,
		columns:[[
	          {field:'text',title:' ',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	$("#email_task_body").datalist({
		singleSelect:false,
	    checkbox: true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		loadMsg:'加载中...',
		url:'/get_body_template/',
		method:'get',
		rownumbers:false,
		showHeader:true,
		columns:[[
	          {field:'title',title:' ',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	
	$('span[name=email_task_template_filter]').each(function(){
		$this = $(this)
		$this.combobox({
		    data:template_type,
		    valueField:'id',
		    textField:'text',
		    editable:false,
		    onSelect:function(record){
		    	var target  = $(this).attr('render')
		    	if(target  == 'subject'){
		    		$('#email_task_subject').datagrid({
			    		queryParams:{
			    			type:record.id
			    		}
			    	});
		    	}
		    	if(target == 'body'){
		    		$('#email_task_body').datagrid({
			    		queryParams:{
			    			type:record.id
			    		}
			    	});
		    	}
		    	if(target == 'attachment'){
		    		
		    	}
		    	
		    }
		});
		$this.combobox('setValue','全部种类');
	});
	
	
	
	
	
	
	
	
	
	$("div[data=email_subject_template]").datagrid({
		singleSelect:true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		url:'/get_subject_template/',
		method:'get',
		onSelect:function(index,row){
			LoadEmailSubjectTemplate(row.id)
		},
		rownumbers:false,
		columns:[[
	          {field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
	          {field:'text',title:'<span style="font-size:16px;font-weight: bold;">Subject<span>',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	$("div[data=email_body_template]").datagrid({
		singleSelect:true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		url:'/get_body_template/',
		method:'get',
		rownumbers:false,
		onSelect:function(index,row){
			LoadEmailBodyTemplate(row.id)
		},
		columns:[[
	          {field:'title',title:'<span style="font-size:16px;font-weight: bold;" class="easyui-tooltip" title="点击title名,可以加载信息">内容标题<span>',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	
	$("div[data=email_body_template_product]").datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		singleSelect:true,
		fitColumns:true,
		url:'/get_product_category/',
		method:'get',
		rownumbers:false,
		onDblClickRow:function(index,row){
    		$(this).datagrid('clearChecked')
    	},
		columns:[[
              {field:'ck',checkbox:true,},
	          {field:'category',title:'<span style="font-size:16px;font-weight: bold;" >关联商品分类<span>',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	
	//$("div[data=email_body_template]")
	//$("div[data=email_attachment_template]")
	
	
	$('span[data=template_type]').filter('span[target=subject]').each(function(){
		$this = $(this)
		$this.combobox({
		    data:template_type,
		    valueField:'id',
		    textField:'text',
		    editable:false,
		    onSelect:function(record){
		    	var param 
		    	if(record == undefined){
		    		param = 'all'
		    	}else{
		    		param = record.id
		    	}
    			$('div[data=email_subject_template]').datagrid({
		    		queryParams:{
		    			type:param
		    		}
		    	});	
	    		
		    }
		});
		$this.combobox('select','全部种类');
	});
	
	
	
	
	$('span[data=add_email_subject_template]').linkbutton({
		onClick:function(){
			$this = $(this)
			$obj = $this.parent('td').find('span[data=template_type]')
			data = {}
			data.type = $obj.combobox('getValue')
			data.content = $('div[data=email_subject_template_content]').textbox('getValue')
			
			if(data.type == 'all' || data == '全部种类' || $.trim(data.content) == ''){return}
			//email_subject_template_content
			$('#loading').show();
			$.ajax({url:'/add_subject_template/',type:'POST',data:data,success:function(data){
		        $.messager.show({title:'<span style="color:green">保存成功</span>',
		            msg:'Subject保存成功!(窗口自动关闭)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
		        $('div[data=email_subject_template]').datagrid('reload')
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">保存失败</span>',
		            msg:'Subject保存失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
		},
	});
	
	
	$('span[data=template_type]').filter('span[target=body]').each(function(){
		$this = $(this)
		$this.combobox({
		    data:template_type,
		    valueField:'id',
		    textField:'text',
		    editable:false,
		    onSelect:function(record){
		    	var param 
		    	if(record == undefined){
		    		param = 'all'
		    	}else{
		    		param = record.id
		    	}
    			$('div[data=email_body_template]').datagrid({
		    		queryParams:{
		    			type:param
		    		}
		    	});	
	    		
		    }
		});
		$this.combobox('select','全部种类');
	});
	
	
	
	$('span[data=add_email_body_template]').linkbutton({
		onClick:function(){
			$this = $(this)
			$obj = $this.parent('td').find('span[data=template_type]')
			data = {}
			data.type = $obj.combobox('getValue')
			data.title = $('span[data=email_body_template_title]').textbox('getText')
			data.content = email_body_template_content.window.getText()
			record = $("div[data=email_body_template_product]").datagrid('getSelected')
			data.category_id = record != null ? record.id : 0
			if(data.type == 'all' || data == '全部种类' || $.trim(data.content) == '' || $.trim(data.title) == ''){return}
			
			$('#loading').show();
			$.ajax({url:'/add_body_template/',type:'POST',data:data,success:function(data){
				if(data == 'repeat'){
					$.messager.show({title:'<span style="color:red">保存失败</span>',
			            msg:'Body保存失败同一类型有重复!(呼叫开发者)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
				}else{
					$.messager.show({title:'<span style="color:green">保存成功</span>',
			            msg:'Body保存成功!(窗口自动关闭)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
					$('div[data=email_body_template]').datagrid('reload')
				}
		        
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">保存失败</span>',
		            msg:'Body保存失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
		},
	});
	
	
	$('span[data=edit_email_body_template]').linkbutton({
		onClick:function(){
			target = $("div[data=email_body_template]").datagrid('getSelected')
			if(target ==  null){return}
			
			$this = $(this)
			$obj = $this.parent('td').find('span[data=template_type]')
			data = {}
			data.id = target.id
			data.type = $obj.combobox('getValue')
			data.title = $('span[data=email_body_template_title]').textbox('getText')
			data.content = email_body_template_content.window.getText()
			record = $("div[data=email_body_template_product]").datagrid('getSelected')
			data.category_id = record != null ? record.id : 0
			if(data.type == 'all' || data == '全部种类' || $.trim(data.content) == '' || $.trim(data.title) == ''){return}
			
			console.log(data)
			
			$('#loading').show();
			$.ajax({url:'/edit_body_template/',type:'POST',data:data,success:function(data){
				$.messager.show({title:'<span style="color:green">修改成功</span>',
		            msg:'Body修改成功!(窗口自动关闭)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$("div[data=email_body_template]").datagrid('reload')
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">保存失败</span>',
		            msg:'Body保存失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
		}
	});
	
	
	
	$('span[data=edit_email_subject_template]').linkbutton({
		onClick:function(){
			target = $("div[data=email_subject_template]").datagrid('getSelected')
			if(target ==  null){return}
			data = {}
			data.id = target.id
			data.content = $('div[data=email_subject_template_content]').textbox('getText')
			if($.trim(data.content) == ''){return}
			
			$('#loading').show();
			$.ajax({url:'/edit_subject_template/',type:'POST',data:data,success:function(data){
				$.messager.show({title:'<span style="color:green">修改成功</span>',
		            msg:'Subject修改成功!(窗口自动关闭)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$("div[data=email_subject_template]").datagrid('reload')
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">保存失败</span>',
		            msg:'Subject保存失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
		}
	});
	
	
	
	
	
	$('#task_list_main').datagrid({
		fit:true,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        url:'/task_list_main/',
        method:'post',
        rownumbers:false,
        rowStyler: function(index,row){
        	if(row.read == 0){
        		return 'font-weight: bold'
        	}
    	},
		columns:[[
	          {field:'id',align:'center',hidden:true,},
			  {field:'name',align:'center',halign:'center',fixed:true,title:"任务名",width:fixWidth(0.2),
	        	  formatter:function(value,row,index){
	        		  return '<a href="#" style="text-decoration:none;color:blue;" class="easyui-tooltip" title="'+row.remark+'">'+row.name+'</a>'
	        	  }
			  },
			  {field:'total',align:'center',halign:'center',fixed:true,title:"总量",width:fixWidth(0.09),},
			  {field:'finish',align:'center',halign:'center',fixed:true,title:"完成",width:fixWidth(0.09),},
			  {field:'operate',align:'center',halign:'center',fixed:true,title:"操作",width:fixWidth(0.07),
				  formatter:function(value,row,index){
					  if(row.status == 0){
						  return'<a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" data="1" onclick="ChangeTaskStatus(this)">开始</a>'
					  }else{
						  return'<a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" data="0"  onclick="ChangeTaskStatus(this)">暂停</a>'
					  }
					  
				  }
			  },
        ]],
	});
	
	
});


function LoadEmailBodyTemplate(id){
	
	$('#loading').show();
	$.ajax({url:'/get_body_template_detail/',type:'GET',data:{'id':id},dataType:'json',success:function(data){
		$.messager.show({title:'<span style="color:green">获取成功</span>',
            msg:'Body信息获取成功!(窗口自动关闭)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        console.log(data)
        email_body_template_content.window.setText(data.content)
        $('span[data=email_body_template_title]').textbox('setText',data.title)
        $('span[data=template_type]').filter('span[target=body]').combobox('setValue',data.type)
        rows = $("div[data=email_body_template_product]").datagrid('getRows')
        for(var i = 0;i<rows.length;i++){
        	if(rows[i].id == data.category_id){
        		$("div[data=email_body_template_product]").datagrid('checkRow',i)
        	}
        }
        if(data.category_id == 0){
        	$("div[data=email_body_template_product]").datagrid('uncheckAll')
        }
        
        
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">获取失败</span>',
            msg:'Body信息获取失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('#loading').fadeOut();
		}
	});
	
	
}

function LoadEmailSubjectTemplate(id){
	$('#loading').show();
	$.ajax({url:'/get_subject_template_detail/',type:'GET',data:{'id':id},dataType:'json',success:function(data){
		$.messager.show({title:'<span style="color:green">获取成功</span>',
            msg:'Subject信息获取成功!',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('div[data=email_subject_template_content]').textbox('setText',data.content)
        
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">获取失败</span>',
            msg:'Subject信息获取失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('#loading').fadeOut();
		}
	});
}


function openTaskWindow(){
	addEmailTaskTarget()
	
	$('#email_task').dialog('open')
}

function addEmailTaskTarget(){
	var new_data = $('#customer_list').datagrid('getChecked')
	var old_data = $('#email_task_target').datalist('getRows')
	for(j in new_data){
		if(old_data.indexOf(new_data[j]) == -1){
			$('#email_task_target').datalist('appendRow',new_data[j])
		}
	}
	
	
}


function addTesk(){
	var name = $('input[data=email_task_name]').textbox('getValue')
	var remark = $('input[data=email_task_remark]').textbox('getValue')
	var interval = $('input[data=email_task_interval]').numberbox('getValue')
	var status = $('input[data=email_task_status]').switchbutton('options').checked
	if($.trim(name) == '' || $.trim(interval) == '' ){
		AlertInfo('red','信息错误','任务名与任务间隔必须填')
		return;
	}
	data = {}
	data.name = name
	data.remark =remark
	data.interval = interval
	status = status==true?1:0
	data.status = status
	
	var target = $('#email_task_target').datalist('getChecked')
	if(target.length == 0){AlertInfo('red','信息错误','至少选择一个收件人');return}
	var send_from = $('#email_task_send').datalist('getChecked')
	if(send_from.length == 0){AlertInfo('red','信息错误','至少选择一个发件人');return}
	var subject = $("#email_task_subject").datalist('getChecked')
	if(subject.length == 0){AlertInfo('red','信息错误','至少选择一个subject模板');return}
	var body = $("#email_task_body").datalist('getChecked')		
	if(body.length == 0){AlertInfo('red','信息错误','至少选择一个body模板');return}
	
	data.target = GetDataId($('#email_task_target').datalist('getChecked'))
	data.subject = GetDataId($('#email_task_subject').datalist('getChecked'))
	data.body = GetDataId($('#email_task_body').datalist('getChecked'))
	data.send =  GetDataId($('#email_task_send').datalist('getChecked'))
	
	
	$('#loading').show();
	$.ajax({url:'/add_email_task/',type:'POST',data:data,success:function(data){
		if(data == 'repeat'){
			AlertInfo('red','发布任务失败','有重复发部')
		}else{
			AlertInfo('green','发布任务成功','发布任务成功!')
		}
		$('#loading').fadeOut();
	},error:function(data){
		AlertInfo('red','发布任务失败','发布任务失败!(呼叫开发者)')
		$('#loading').fadeOut();
		}
	});
	
}



function GetDataId(obj){
	id_list = []
	for(i in obj){
		id_list.push(obj[i].id)
	}
	return id_list.join(',')
}

function ChangeTaskStatus(obj){
	var status = $(obj).attr('data')
	var task_id = $(obj).attr('task')
	$('#task_list_main').datagrid('loading');
	$.ajax({url:'/change_task_status/',type:'POST',data:{'status':status,'task_id':task_id},success:function(data){
		if(status == 1){
			AlertInfo('green','修改成功','任务启动成功!')
		}else{
			AlertInfo('green','修改成功','任务暂停成功!')
		}
		$('#task_list_main').datagrid('reload');
	},error:function(data){
		AlertInfo('red','修改失败','状态修改成功!(呼叫开发者)')
		$('#task_list_main').datagrid('loaded');
		}
	});
	
	
	
}

