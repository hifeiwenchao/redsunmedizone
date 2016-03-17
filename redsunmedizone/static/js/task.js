$(function($){
	$('#email_task').dialog({
		openAnimation:'show',
		width:1200,
		height:$(window).height()*0.95,
		closed:true,
		collapsible:true,
		resizable:true,
		iconCls: 'icon-save',
	});
	
	$('a[data=normal_task]').click(function(){
		$obj = $(this)
		if($obj.attr('show') == 0){
			$('.TaskInfo').show('normal');
			$('.SpecialTaskInfo').hide('normal');
			$('a[data=specical_task]').attr('show',0);
			$obj.attr('show',1);
		}else{
			$('.TaskInfo').hide('normal');
			$obj.attr('show',0);
			$('.SpecialTaskInfo').hide('normal');
			$('a[data=specical_task]').attr('show',0);
		}
	});
	
	$('a[data=specical_task]').click(function(){
		$obj = $(this)
		if($obj.attr('show') == 0){
			$('.SpecialTaskInfo').show('normal');
			$('.TaskInfo').hide('normal');
			$('a[data=normal_task]').attr('show',0);
			$obj.attr('show',1);
		}else{
			$('.TaskInfo').hide('normal');
			$('.SpecialTaskInfo').hide('normal');
			$('a[data=normal_task]').attr('show',0);
			$obj.attr('show',0);
		}
	});
	
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
	
	
	$("#email_task_attachment").datalist({
		singleSelect:false,
	    checkbox: true,
		fit:true,
		border:false,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		loadMsg:'加载中...',
		method:'get',
		rownumbers:false,
		showHeader:true,
		columns:[[
	          {field:'url',title:' ',width:fixWidth(0.13),align:'center',halign:'center',},
        ]],
	});
	
	$('#remove_task_attachment').click(function(e){
		$obj = $("#email_task_attachment")
		var rows = $obj.datalist('getChecked')
		for(i in rows){
			$obj.datalist('deleteRow',$obj.datalist('getRowIndex',rows[i]))
		}
	});
	
	$('#empty_task_attachment').click(function(e){
		$("#email_task_attachment").datalist('loadData',[])
	});
	
	$('#add_att_to_template').click(function(e){
		if($("#task_url_info").text() == '未有选中'){return;}
		$("#email_task_attachment").datalist('insertRow',{
			index:0,
			row:{
				url:$("#task_url_info").text(),
			}
		})
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
					  }
					  if(row.status == 1){
						  return'<a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" data="0"  onclick="ChangeTaskStatus(this)">暂停</a>'
					  }
					  if(row.status == 2){
						  return'已完成'
					  }
					  
				  }
			  },
        ]],
        
	});
	
	
	
	
	$('#task_list').datagrid({
		fit:true,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/task_list/',
        method:'post',
        rownumbers:true,
		columns:[[
	          {field:'id',align:'center',hidden:true,},
			  {field:'name',align:'center',halign:'center',fixed:true,title:"任务名",width:fixWidth(0.15),
	        	  formatter:function(value,row,index){
	        		  return '<a href="#" style="text-decoration:none;color:blue;" class="task_main_info" row_index="'+index+'" >'+row.name+'</a>'
	        	  }
			  },
			  {field:'interval',align:'center',halign:'center',fixed:true,title:"间隔",width:fixWidth(0.03),},
			  {field:'operate',align:'center',halign:'center',fixed:true,title:"情况",width:fixWidth(0.08),
				  formatter:function(value,row,index){
					  if(row.status == 0){
						  return'<a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" data="1" onclick="ChangeTaskStatus(this)">开始</a><span style="margin-left:10px;"></span><a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" class="openTaskDetail"   onclick="TaskDetail(this)">详情</a>'
					  }
					  if(row.status == 1){
						  return'<a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" data="0"  onclick="ChangeTaskStatus(this)">暂停</a><span style="margin-left:10px;"></span><a href="#" style="text-decoration:none;color:blue;" task="'+row.id+'" class="openTaskDetail"   onclick="TaskDetail(this)">详情</a>'
					  }
					  if(row.status == 2){
						  return'已完成<span style="margin-left:10px;"></span><a href="#" class="openTaskDetail" style="text-decoration:none;color:blue;" task="'+row.id+'"  onclick="TaskDetail(this)">详情</a>'
					  }
				  }
			  },
        ]],
        onLoadSuccess:function(data){
        	var pager = $(this).datagrid('getPager')
        	$(pager).pagination({
        		buttons: [{
        			iconCls:'icon-edit',
        			handler:function(){ChangeInterval()}
        		}],
        		displayMsg:'',
        	})
        	$('.openTaskDetail').each(function(){
        		$(this).tooltip({
        			position:'right',
            		content:'<div style="color:white;">单击加载对应任务详情</div>',
        			onShow: function(){
            	        $(this).tooltip('tip').css({
            	            backgroundColor: '#666',
            	            borderColor: '#95B8E7',
            	        })
            	    },
        		});
        	});
        	$('.task_main_info').each(function(){
    			row_data = data['rows'][$(this).attr('row_index')]
    			$(this).tooltip({
            	    position: 'right',
            	    onShow: function(){
            	        $(this).tooltip('tip').css({
            	            backgroundColor: '#666',
            	            borderColor: '#95B8E7',
            	        });
            	    },
    				content: '<div style="color:white;">任务名:'+row_data['name']+'</div>\
    	        		<div style="color:white;">间隔:'+row_data['interval']+'分钟</div>\
    	        		<div style="color:white;">备注:'+row_data['remark']+'</div>\
    	        		<div style="color:white;">总共:'+row_data['total']+'条</div>\
    	        		<div style="color:white;">创建时间:'+row_data['create_time']+'</div>',
            	});
    		});
        },
        onBeforeLoad:function(param){
        	$('.task_main_info').tooltip('destroy')
        	$('.openTaskDetail').tooltip('destroy')
        	
        },
        
	});
	
	
	$('#task_detail_list').datagrid({
		fit:true,
		remoteSort:false,
		nowrap:false,
		autoRowHeight:true,
		fitColumns:true,
		singleSelect:true,//是否单选 
        pagination:true,//分页控件 
        pageSize:20,
        pageList:[20,40,60,100],
        url:'/task_detail/',
        method:'post',
        rownumbers:false,
		columns:[[
	          {field:'id',align:'center',hidden:true,},
			  {field:'name',align:'center',halign:'center',fixed:true,title:"客户名",width:fixWidth(0.10),},
			  {field:'send_to',align:'center',halign:'center',fixed:true,title:"发往",width:fixWidth(0.18),},
			  {field:'subject',align:'center',halign:'center',fixed:true,title:"Subject",width:fixWidth(0.23),},
			  {field:'status',align:'center',halign:'center',fixed:true,title:"状态",width:fixWidth(0.05),
				  formatter:function(value,row,index){
					  if(row.status == 0){
						  return '<span style="color:gray">等待中</span>'
					  }
					  if(row.status == 1){
						  return '<span style="color:#95B8E7">执行完成</span>'
					  }
				  }
			  },
			  {field:'result',align:'center',halign:'center',fixed:true,title:"结果",width:fixWidth(0.05),
				  formatter:function(value,row,index){
					  if(row.result == 0){
						  return '<span style="color:green">成功</span>'
					  }
					  if(row.result == 1){
						  return '<span style="color:red">失败</span>'
					  }
				  }
			  },
			  {field:'operate',align:'center',halign:'center',fixed:true,title:"操作",width:fixWidth(0.05),
				  formatter:function(value,row,index){
					  return'<a href="#" class="task_detail" style="text-decoration:none;color:blue;" row_index="'+index+'" >详情</a>'
				  }
			  },
        ]],
        onBeforeLoad:function(param){
        	$('.task_detail').tooltip('destroy')
        },
        onLoadSuccess:function(data){
    		$('.task_detail').each(function(){
    			row_data = data['rows'][$(this).attr('row_index')]
    			$(this).tooltip({
            	    position: 'left',
            	    onShow: function(){
            	        $(this).tooltip('tip').css({
            	            backgroundColor: '#666',
            	            borderColor: '#95B8E7',
            	        });
            	    },
    				content: '<div style="color:white;">客户名:'+row_data['name']+'</div>\
    	        		<div style="color:white;">send_from:'+row_data['send_from']+'</div>\
    	        		<div style="color:white;">send_to:'+row_data['send_to']+'</div>\
    	        		<div style="color:white;">发送结果信息:'+row_data['info']+'</div>',
            	});
    		})	
        },
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
	var atts = $('#email_task_attachment').datalist('getChecked')
	if( atts.length != 0){
		var atts_list = []
		for(i in atts){
			atts_list.push(atts[i]['url'])
		}
		data.atts = atts_list.join(',')
	}
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
		AlertInfo('red','修改失败','状态修改失败!(呼叫开发者)')
		$('#task_list_main').datagrid('loaded');
		}
	});
	
}

function TaskDetail(obj){
	$('#task_detail_list').datagrid({
		queryParams: {
			task_id: $(obj).attr('task'),
		}
	})
}

function ChangeInterval(){
	var row = $('#task_list').datagrid('getSelected')
	if(row == null){return;}
	$.messager.prompt('改变时间间隔','改变任务名为:<span style="color:red;margin:0 5px 0 5px">'+row['name']+'</span>的任务间隔,当前为间隔为:<span style="color:red;margin:0 5px 0 5px">'+row['interval']+'</span>分钟', function(r){
		if (r){
			if(r <= 5 ){
				AlertInfo('red','修改失败','间隔要大于5!')
				return
			}
			$('.MainLoadInfo').toggle('normal')
			$('#task_list').datagrid('loading');
			$.ajax({url:'/change_task_interval/',type:'POST',data:{'interval':$.trim(r),'task_id':row.id},success:function(data){
				AlertInfo('green','修改成功','任务间隔成功!')
				$('#task_list').datagrid('reload');
				$('.MainLoadInfo').toggle('normal')
			},error:function(data){
				$('.MainLoadInfo').toggle('normal')
				AlertInfo('red','修改失败','间隔修改失败,可能不是数字!(呼叫开发者)')
				$('#task_list').datagrid('loaded');
				}
			});
		}
	});
}

