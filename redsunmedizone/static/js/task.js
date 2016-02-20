$(function($){
	$("#email_task_subject").datalist({
		singleSelect:false,
		checkbox: true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		url:'/get_subject_template/',
		method:'get',
		rownumbers:false,
		columns:[[
	          {field:'text',title:'<span style="font-size:16px;font-weight: bold;">Subject<span>',width:fixWidth(0.13),align:'center',halign:'center',},
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
		url:'/get_body_template/',
		method:'get',
		rownumbers:false,
		columns:[[
	          {field:'title',title:'<span style="font-size:16px;font-weight: bold;" class="easyui-tooltip" title="点击title名,可以加载信息">内容标题<span>',width:fixWidth(0.13),align:'center',halign:'center',},
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
		    	/*
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
	    		*/
		    }
		});
		$this.combobox('select','全部种类');
	});
	
	
	
	
	
	
	
	
	
	$("div[data=email_subject_template]").datagrid({
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		url:'/get_subject_template/',
		method:'get',
		rownumbers:false,
		columns:[[
	          {field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
	          {field:'text',title:'<span style="font-size:16px;font-weight: bold;">Subject<span>',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	$("div[data=email_body_template]").datagrid({
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



function addTemplateSettings(){
	alert('1')
}





function openTaskWindow(){
	$('#email_task').dialog('open')
}



function addTesk(){
	alert('1')
}