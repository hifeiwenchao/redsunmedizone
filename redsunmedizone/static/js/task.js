$(function($){
    
	//$("div[data=email_body_template]")
	//$("div[data=email_attachment_template]")
	
	$('span[data=template_type]').each(function(){
		$this = $(this)
		$this.combobox({
		    data:template_type,
		    valueField:'id',
		    textField:'text',
		    editable:false,
		});
		$this.combobox('select','全部种类');
		console.log($this.attr('target'))
	});
	
	$('span[data=add_email_subject_template]').linkbutton({
		onClick:function(){
			$this = $(this)
			console.log($this.attr('target'))
		},
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
		columns:[[
			{field:'id',title:'<div style="font-size:16px;font-weight: bold;">ID<div>',width:40,align:'center',halign:'center'},
			{field:'text',title:'<span style="font-size:16px;font-weight: bold;">Body<span>',width:fixWidth(0.13),align:'center',halign:'center',},
		]],
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