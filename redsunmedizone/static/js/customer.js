$(function($){
	$('#customer_list').datagrid({
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
        url:'/customer_list/',
        method:'post',
        rownumbers:false,
        toolbar:'#customer_list_tools',
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" onclick="customerDetail('+rowData.id+')">'+rowData.id+'</a>'
				},
			},
			{field:'company_name',title:'<span style="font-size:16px;font-weight: bold;">公司名<span>',width:fixWidth(0.13),align:'left',halign:'center',},
			{field:'name',title:'<span style="font-size:16px;font-weight: bold;">人名<span>',width:fixWidth(0.1),align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					return '<a href="#" onclick="customerDetail('+rowData.id+')">'+rowData.name+'</a>'
				},
			},
			{field:'nation',title:'<span style="font-size:16px;font-weight: bold;">国家<span>',width:fixWidth(0.05),align:'center',halign:'center',
                                 formatter: function(value,rowData,rowIndex){
                                           if (rowData.sort == 100){
                                                  return '<span style="color:red">'+rowData.nation+'</span>';
                                           }else{
                                                  return rowData.nation;
                                           }
                                 },
                        },
			{field:'email',title:'<span style="font-size:16px;font-weight: bold;">邮箱<span>',width:fixWidth(0.15),align:'center',halign:'center'},
			{field:'website',title:'<span style="font-size:16px;font-weight: bold;">网站<span>',width:fixWidth(0.11),align:'center',halign:'center',
				formatter:function(value,rowData,rowIndex){
					if($.trim(rowData.website) == ''){
						return rowData.website
					}else{
						return '<a href="http://'+rowData.website+'" target="_blank">'+rowData.website+'</a>'
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
	
	$('#filter').combobox({
		panelHeight:100,
		editable:false,
		data:[{
		    "value":'all',
		    "text":"全部客户",
		},{
		    "value":1,
		    "text":"潜在客户"
		},{
		    "value":2,
		    "text":"意向客户"
		},{
		    "value":3,
		    "text":"合作客户",
		}],
		onSelect:function(record){
			$('#customer_list').datagrid({
				queryParams:{
					customer_grade:record['value'],
				}
			});
			
		},
	});
	
	$('#filter').combobox('select','all')
	
	
	
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
        $.messager.show({title:'<span style="color:green">保存成功</span>',
            msg:'信息保存成功!(窗口自动关闭)',showType:'slide',
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
	});
}

function customerDetail(id){
	$('#loading').show();
	$.ajax({url:'/customer_detail/',type:'POST',data:{'id':id},dataType:"json",success:function(data){
        $.messager.show({title:'<span style="color:green">获取成功</span>',
            msg:'获取成功!(窗口自动关闭)',showType:'slide',
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        
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
		
		$('#loading').fadeOut();
        
        $('#customer_window').dialog('open');
	},error:function(data){
		$.messager.show({title:'<span style="color:red">获取失败</span>',
            msg:'获取信息失败!(呼叫开发者)',showType:'slide',
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('#loading').fadeOut();
		}
	});
	
	
	
}



function saveUser(){
	
	$.messager.confirm('保存操作', '确定要保存用户吗?!(需要选中表格中任意一行!并且6个选项要全部选到才可以!)', function(r){
		if (r){
	
				var rowData = $('#customer_list').datagrid('getSelected')
				
				if(rowData == null){
					$.messager.show({title:'<span style="color:red">必须选择一条客户数据</span>',
			            msg:'必须选择一条客户数据!(窗口自动关闭)',showType:'slide',
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
					return
				}
				var data = {}
				data.id = rowData.id
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
			        $.messager.show({title:'<span style="color:green">保存成功</span>',
			            msg:'信息保存成功!(窗口自动关闭)',showType:'slide',
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
	});
}



function clearInfoCustomer(){
	$('span[render=value]').each(function(){
		$(this).textbox('setText','')
    });
}


function addSettings(){
	var obj = $('#customer_settings_tabs').tabs('getSelected')
	console.log($(obj).attr('related'))
}



