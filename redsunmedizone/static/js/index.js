$(document).ready(function(){
	
	$.parser.parse()
	$('#loading').fadeOut('slow')
})


var customer_tree = [{"id": 1,"text": "客户信息列表",}]
var mail_tree = [{"id": 1,"text": "收件箱",},{"id": 2,"text": "发件箱",},{"id": 3,"text": "草稿箱",},{"id": 4,"text": "垃圾箱",},{"id": 5,"text": "询盘",},{"id": 6,"text": "报价",}]
var order_tree = [{"id": 1,"text": "订单信息",}]
var finance_tree = [{"id": 1,"text": "财务信息",}]
var files_tree = [{"id": 1,"text": "文件目录",}]
var task_tree = [{"id": 1,"text": "任务信息",}]
var tree_id_list = ['customer_tree','mail_tree','order_tree','finance_tree','files_tree','settings_tree','task_tree']


$(function($) {
	
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
        	console.log(row)
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
        	console.log(row)
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
        	console.log(row)
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
        	console.log(row)
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
        	console.log(row)
        },
	});
	
	
	
});
	


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






