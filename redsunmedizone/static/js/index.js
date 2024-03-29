$(document).ready(function(){
	console.log($(window).width())
	$('#loading').fadeOut('slow')
	$('#mm3').hide()
})

$(document).keyup(function(e) { 
	if (e.keyCode == 27) {
		$('#customer_window').dialog('close');
		$('#customer_settings_window').dialog('close');
		$('#send_email').dialog('close');
		$('#email_account_settings').dialog('close');
		$('#email_task').dialog('close')
		$('#email_template_settings').dialog('close')
	}
});

window.setInterval(function(){$('#email_list_unread').datagrid('reload')},180000); 
window.setInterval(function(){$('#task_list_main').datagrid('reload')},120000);
window.setInterval(function(){$('#task_list').datagrid('reload')},180000);
var timeInterval = null;
var customer_tree = [{"id": 1,"text": "客户信息列表",}]
var mail_tree = [{"id": 0,"text": "未读",},{"id": 1,"text": "已读",},{"id": 2,"text": "发件箱",},{"id": 3,"text": "草稿箱",},{"id": 4,"text": "垃圾箱",},{"id": 5,"text": "询盘",},{"id": 6,"text": "报价",}]
var product_tree = [{"id": 1,"text": "产品列表",}]
var order_tree = [{"id": 1,"text": "订单信息",}]
var finance_tree = [{"id": 1,"text": "财务信息",}]
var files_tree = [{"id": 1,"text": "文件目录",}]
var task_tree = [{"id": 1,"text": "任务信息",}]
var tree_id_list = ['customer_tree','mail_tree','order_tree','finance_tree','files_tree','settings_tree','task_tree']
var template_type = [{'id':'all','text':'全部种类'},{'id':'0','text':'常规模板'},{'id':'1','text':'开发信'},{'id':'2','text':'新产品提醒'},{'id':'3','text':'展会提醒'},{'id':'4','text':'放假提醒'},{'id':'5','text':'节日'},{'id':'6','text':'生日'},{'id':'7','text':'跟踪'}]

$(function($) {
    $("#menu_accordion").accordion('getSelected').panel('collapse')
	$('#menu_button').click(function(e){
		var $obj = $(this)
		if($obj.attr('show') == 0){
			$obj.tooltip('update','隐藏菜单')
			$('#mm3').show('normal')
			$obj.attr('show',1).empty().append('<img src="/static/img/arrow_down.png" style="opacity:0.8;" alt="隐藏菜单">')
		}else{
			$obj.tooltip('update','呼出菜单')
			$('#mm3').hide('normal')
			$obj.attr('show',0).empty().append('<img src="/static/img/arrow_up.png" style="opacity:0.8;" alt="呼出菜单">')
		}
	});
	
	timeInterval = setTimeout(flushTime,1000);
	$('#customer_tree').datalist({
		fit:true,
		border:false,
		data:customer_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('customer_tree')
        	if(row.id == 1){
        		$('#main_tab').tabs('select','客户列表')
        	}
        },
	});
	
	$('#mail_tree').datalist({
		fit:true,
		border:false,
		data:mail_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('mail_tree')
        	$('#main_tab').tabs('select','邮件列表')
        	if(row.id == 0){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 1){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 2){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 3){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 4){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 5){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	if(row.id == 6){
        		$('#mail_tab').tabs('select',row.text)
        	}
        	
        },
	});
	
	$('#product_tree').datalist({
		fit:true,
		border:false,
		data:product_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('order_tree')
        	$('#main_tab').tabs('select','产品列表')
        },
	});
	
	$('#order_tree').datalist({
		fit:true,
		border:false,
		data:order_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('order_tree')
        	$('#main_tab').tabs('select','订单列表')
        },
	});
	
	$('#finance_tree').datalist({
		fit:true,
		border:false,
		data:finance_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('finance_tree')
        	$('#main_tab').tabs('select','财务列表')
        },
	});
	
	$('#files_tree').datalist({
		fit:true,
		border:false,
		data:files_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('files_tree')
        	$('#main_tab').tabs('select','静态文件')
        },
	});
	
	
	$('#task_tree').datalist({
		fit:true,
		border:false,
		data:task_tree,
		columns:[[
          {field:'text',align:'center',},
          {field:'id',align:'center',hidden:true,}
	      ]],
        onClickRow:function(inde,row){
        	unSelect('task_tree')
        	$('#main_tab').tabs('select','任务列表')
        },
	});
	
	
	
	$('div[data=memoCalendar]').calendar({
		border:false,
		onSelect:function(data){
			getMemo(data);
		}
	});
	
	
	//添加备忘录
	$('a[data=addMemo]').click(function(){
		var options = $('div[data=memoCalendar]').calendar('options')
		var date = options.current.Format("yyyy-MM-dd")
		var memo = $('span[data=memoInfo]').textbox('getText')
		if($.trim(memo) == ''){return}
		$.ajax({url:'/memo_handler/',type:'POST',data:{'date':date,'memo':memo},success:function(data){
	        $.messager.show({title:'<span style="color:green">保存成功</span>',
	            msg:'保存备忘信息成功!(窗口自动关闭)',showType:'slide',timeout:1200,
	            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
	        });
	        getMemoMark()
			$('#loading').fadeOut();
		},error:function(data){
			$.messager.show({title:'<span style="color:red">保存失败</span>',
	            msg:'保存备忘信息失败!(呼叫开发者)',showType:'slide',timeout:1200,
	            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
	        });
			$('#loading').fadeOut();
			}
		});
	});
	
	//一开始就获取当前备忘录信息
	loadMemo()
	getMemoMark()
});

function getMemo(date){
	date = date.Format("yyyy-MM-dd")
	$('#loading').show();
	$.ajax({url:'/memo_handler/',type:'GET',data:{'date':date},success:function(data){
        $.messager.show({title:'<span style="color:green">保存成功</span>',
            msg:'获取备忘信息成功!(窗口自动关闭)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
        $('span[data=memoInfo]').textbox('setText',data)
		$('#loading').fadeOut();
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'获取备忘信息失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		$('#loading').fadeOut();
		}
	});
}

function loadMemo(){
	date = new Date();
	date = date.Format("yyyy-MM-dd")
	$.ajax({url:'/memo_handler/',type:'GET',data:{'date':date},success:function(data){
        $('span[data=memoInfo]').textbox('setText',data)
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'获取备忘信息失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		}
	});
}

function getMemoMark(){
	$.ajax({url:'/memo_mark/',type:'GET',success:function(data){
        var memo_mark_list = eval(data)
        $('div[data=memoCalendar]').calendar({
    		styler: function(date){
    			if ($.inArray(date.Format("yyyy-MM-dd"), memo_mark_list) != -1){
    				return 'background-color:#95B8E7;';
    			} else {
    				return '';
    			}
    		},
    	});
        
	},error:function(data){
		$.messager.show({title:'<span style="color:red">保存失败</span>',
            msg:'获取备忘信息失败!(呼叫开发者)',showType:'slide',timeout:1200,
            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
        });
		}
	});
}




function unSelect(select){
	for(i in tree_id_list){
		if(tree_id_list[i] != select){
			$('#'+tree_id_list[i]).datalist('clearSelections')
		}
	}
}

//宽度自适应
function fixWidth(percent){
    return document.body.clientWidth * percent ; //这里你可以自己做调整  
}



function flushTime(){
   clearTimeout(timeInterval);//清除定时器
   dt = new Date();
   var y = dt.getFullYear()
   var month = dt.getMonth() + 1
   var d = dt.getDate()
   var h=dt.getHours();
   var m =dt.getMinutes();
   var s=dt.getSeconds();
   if(s < 10){
	   s = '0'+s
   }
   $('#memoNowTime').text(y+'年'+month+'月'+d+'日'+h+"时"+m+"分"+s+"秒")
   timeInterval = setTimeout(flushTime,1000);       
}




Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


function AlertInfo(color,title,body){
	$.messager.show({title:'<span style="color:'+color+'">'+title+'</span>',
        msg:body,showType:'slide',timeout:1200,
        style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
    });
}

function AlertInfoHard(color,title,body){
	$.messager.alert('<span style="color:'+color+'">'+title+'</span>',body,'info');
}


