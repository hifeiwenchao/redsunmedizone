var public_file_path = null
var true_host = 'https://crm.redsunmedizone.com'
$(function($){
	
	$('#static_file_tree').tree({
		fit:true,
	    textField:'text',
	    editable:false,
	    lines:true,
	    animate:true,
	    onClick: function(node){
	    	static_file_tree_target = node.target
	    	if(node.type == 'directory'){return}
	    	var path = node.text
	    	var children_node = node
			while(true){
				var parent_node = $(this).tree('getParent',children_node.target)
				if(parent_node != null){
					path = parent_node.text +'/' + path
					children_node = parent_node
				}else{
					break;
				}
			}
	    	$('#public_url_info').text(true_host+'/static/'+path)
	    	$('#task_url_info').text('/static/'+path)
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
	    onContextMenu: function(e, node){
			e.preventDefault();
			$('#static_file_tree_all').tree('select', node.target);
		
			$('#static_file_tree_all_menu').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
			
		},
	});
	
	
	ReloadStaticFileTree()
	ReloadStaticFileTreeAll()
	
	
	$("#file_upload_input").fileupload({
		autoUpload: false,
	    sequentialUploads: true,
	    done:function(e,result){
	    	$.messager.show({title:'<span style="color:green">上传成功</span>',
	            msg:'上传文件成功!(窗口自动关闭)',showType:'slide',timeout:1200,
	            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
	        });
	    	
	    	ReloadStaticFileTree()
	    	ReloadStaticFileTreeAll()
	    },
	}).bind('fileuploadprogress', function (e, data) {  
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#upload_file_progressbar').progressbar('setValue',progress)
    }).on('fileuploadadd', function (e, data) {
        data.context = $('<div/>').appendTo('#upload_file_info');
        $.each(data.files, function (index, file) {
            var node = $('<p/>').append($('<span/>').text(file.name)).append($('<span/>').text('上传的路径为:'+public_file_path).css({'margin-left':'30px'}).attr('path',public_file_path))
            if (!index) {
                node.append('<br>').append(uploadButton.clone(true).data(data).tooltip({content:'点击上传文件'}));
            }
            node.appendTo(data.context);
        });
    });
	
});

uploadButton = $('<button/>').text('上传')
.on('click', function () {
	var $this = $(this),
	data = $this.data();
	var true_path = $this.parent('p').find('span[path]').attr('path')
	$("#file_upload_input").fileupload({
		formData:{'path':true_path},
	});
	$this.off('click').text('上传中').on('click', function () {
		//$this.remove();
		//data.abort();
	});
	data.submit().always(function () {
		$this.text('完成');
		$this.tooltip({content:'点击移除此任务'})
		$this.off('click').on('click',function(){
			$this.tooltip('destroy')
			$this.parent('p').parent('div').remove()
		});
	});
});

function ReloadStaticFileTree(){
	$.ajax({url:'/file_tree/',type:'GET',dataType:'json',success:function(data){
		data[0].state = 'open'
		$('#static_file_tree').tree('loadData',data);
	},error:function(data){
		}
	});
}

function ReloadStaticFileTreeAll(){
	$.ajax({url:'/file_tree/',data:{'type':'all'},type:'GET',dataType:'json',success:function(data){
		data[0].state = 'open'
		$('#static_file_tree_all').tree('loadData',data);
	},error:function(data){
		}
	});
}


function CreateDirectory(){
	
	node = $('#static_file_tree').tree('getSelected')
	
	if(node.type != 'directory'){
		node = $('#static_file_tree').tree('getParent',node.target)
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	
	var true_path = '/'+path
	$.messager.prompt('信息', '将在文件夹<span style="color:red">'+path+'</span>下新建文件夹,请输入文件夹名称,<span style="color:red">不可重复</span>', function(r){
		if(r){
			var data={}
			data.true_path = true_path
			data.directory_name = r
			if($.trim(data.directory_name) == ''){return}
			$('#loading').show();
			$.ajax({url:'/add_dir/',type:'POST',data:data,success:function(data){
				if(data == 'repeat'){
					$.messager.show({title:'<span style="color:red">新建失败</span>',
			            msg:'新建目录失败名字重复了!(呼叫开发者)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
				}else{
					$.messager.show({title:'<span style="color:green">新建成功</span>',
			            msg:'新建目录成功!(窗口自动关闭)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
					
					$('#static_file_tree').tree('append', {
						parent: node.target,
						data: [{
							iconCls:'tree-folder',
							text: r,
							state: 'open',
							type:'directory',
						}]
					});
					
				}
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">新建失败</span>',
		            msg:'新建目录失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
			
		}
	});
	
}

//删除目录需要将static_file_tree_target 改为他的父级目录
function DropDirectory(){
	node = $('#static_file_tree').tree('getSelected')
	if(node.type != 'directory'){
		node = $('#static_file_tree').tree('getParent',node.target)
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	var true_path = '/'+path
	
	
	
	
	$.messager.confirm('信息', '删除目录:<span style="color:red">'+path+'</span>,<span style="color:red">谨慎操作无法回退!!!</span>', function(r){
		if(r){
			var data={}
			data.true_path = true_path
			$('#loading').show();
			$.ajax({url:'/remove_dir/',type:'POST',data:data,success:function(data){
				$.messager.show({title:'<span style="color:green">删除成功</span>',
		            msg:'删除目录成功!(窗口自动关闭)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#static_file_tree').tree('remove',node.target)
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">删除失败</span>',
		            msg:'删除目录失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
		}
	});
}




function UploadStaticFile(){
	
	node = $('#static_file_tree').tree('getSelected')
	if(node.type != 'directory'){
		node = $('#static_file_tree').tree('getParent',node.target)
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	
	public_file_path = '/'+path
	
	console.log(public_file_path)
	
	
	$("#file_upload_input").fileupload({
		url: '/upload_file/',
		formData:{'path':public_file_path},
	});
	    
	$("#file_upload_input").click()
	
}



//删除目录需要将static_file_tree_target 改为他的父级目录
function DropStaticFile(){
	console.log('删除文件')
}





function DownStaticFile(){
	node = $('#static_file_tree_all').tree('getSelected')
	if(node.type == 'directory'){
		return
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree_all').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	public_file_path = '/'+path
	console.log(public_file_path);
	window.open('/get_file/?name='+node.text+'&path='+public_file_path);
}


function UploadStaticFileAll(){
	
	node = $('#static_file_tree_all').tree('getSelected')
	if(node.type != 'directory'){
		node = $('#static_file_tree_all').tree('getParent',node.target)
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree_all').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	
	public_file_path = '/'+path
	
	console.log(public_file_path)
	
	
	$("#file_upload_input").fileupload({
		url: '/upload_file_all/',
		formData:{'path':public_file_path},
	});
	    
	$("#file_upload_input").click()
	
}

function CreateDirectoryAll(){
	
	node = $('#static_file_tree_all').tree('getSelected')
	
	if(node.type != 'directory'){
		node = $('#static_file_tree_all').tree('getParent',node.target)
	}
	var path = node.text
	var children_node = node
	while(true){
		var parent_node = $('#static_file_tree_all').tree('getParent',children_node.target)
		if(parent_node != null){
			path = parent_node.text +'/' + path
			children_node = parent_node
		}else{
			break;
		}
	}
	
	var true_path = '/'+path
	$.messager.prompt('信息', '将在文件夹<span style="color:red">'+path+'</span>下新建文件夹,请输入文件夹名称,<span style="color:red">不可重复</span>', function(r){
		if(r){
			var data={}
			data.true_path = true_path
			data.directory_name = r
			if($.trim(data.directory_name) == ''){return}
			$('#loading').show();
			$.ajax({url:'/add_dir_all/',type:'POST',data:data,success:function(data){
				if(data == 'repeat'){
					$.messager.show({title:'<span style="color:red">新建失败</span>',
			            msg:'新建目录失败名字重复了!(呼叫开发者)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
				}else{
					$.messager.show({title:'<span style="color:green">新建成功</span>',
			            msg:'新建目录成功!(窗口自动关闭)',showType:'slide',timeout:1200,
			            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
			        });
					
					$('#static_file_tree_all').tree('append', {
						parent: node.target,
						data: [{
							iconCls:'tree-folder',
							text: r,
							state: 'open',
							type:'directory',
						}]
					});
					
				}
				$('#loading').fadeOut();
			},error:function(data){
				$.messager.show({title:'<span style="color:red">新建失败</span>',
		            msg:'新建目录失败!(呼叫开发者)',showType:'slide',timeout:1200,
		            style:{right:'',top:'',bottom:-document.body.scrollTop-document.documentElement.scrollTop}
		        });
				$('#loading').fadeOut();
				}
			});
			
		}
	});
	
}