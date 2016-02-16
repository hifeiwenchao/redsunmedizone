$(function($){
	
	$('#static_file_tree').tree({
		fit:true,
	    textField:'text',
	    editable:false,
	    lines:true,
	    animate:true,
	    onClick: function(node){
			console.log(node)
		},
		onContextMenu: function(e, node){
			e.preventDefault();
			$('#static_file_tree').tree('select', node.target);
		
			$('#static_file_tree_menu').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
			
		},
	
	});
	
	$('#static_file_tree_all').tree({
		fit:true,
	    textField:'text',
	    editable:false,
	    lines:true,
	    animate:true,
	    onClick: function(node){
			console.log(node)
		},
	});
	
	
	ReloadStaticFileTree()
	ReloadStaticFileTreeAll()
});

function ReloadStaticFileTree(){
	$.ajax({url:'/static_file_tree/',type:'GET',dataType:'json',success:function(data){
		data[0].state = 'open'
		$('#static_file_tree').tree('loadData',data);
	},error:function(data){
		}
	});
}

function ReloadStaticFileTreeAll(){
	$.ajax({url:'/static_file_tree/',data:{'type':'all'},type:'GET',dataType:'json',success:function(data){
		data[0].state = 'open'
		$('#static_file_tree_all').tree('loadData',data);
	},error:function(data){
		}
	});
}