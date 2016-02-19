$(function($){
    
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
		fitColumns:true,
		url:'',
		method:'get',
		rownumbers:false,
		columns:[[
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
			if(data.type == 'all' || data == '全部种类' || $.trim(data.content) == '' || $.trim(data.title) == ''){return}
			//email_subject_template_content
			
			console.log(data)
			return
			$('#loading').show();
			$.ajax({url:'/add_body_template/',type:'POST',data:data,success:function(data){
		        $.messager.show({title:'<span style="color:green">保存成功</span>',
		            msg:'Body保存成功!(窗口自动关闭)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
		        $('div[data=email_subject_template]').datagrid('reload')
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
	
	
	
	
});





function addTemplateSettings(){
	alert('1')
}





function openTaskWindow(){
	$('#email_task').dialog('open')
}



function addTesk(){
	alert('1')
}