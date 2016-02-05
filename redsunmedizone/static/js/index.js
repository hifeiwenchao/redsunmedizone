$(document).ready(function(){
	
	$('#loading').fadeOut()
})


var customer_tree = [{
    "id": 1,
    "text": "客户信息列表",
},{
    "id": 2,
    "text": "新建客户信息",
}]




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
        	console.log(row)
        },
	});
});
	











