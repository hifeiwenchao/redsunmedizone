$(function($){
	 UE.getEditor('editor');
	 
	//初始化搜索框
	$('input[data=search_product]').searchbox({
		prompt:'请输入关键词',
		searcher:function(value,name){
			if(value == ''){
				return
			}
			$('#products').datagrid({
				queryParams:{
					search:value,
				}
			})
			
		},
	});
	
	//主题
	$('#ith').combobox({
        panelHeight:100,
        onChange:function(newVal, oldVal){
           var oldHref = $('#uiTheme').attr('href');
           var newHref = oldHref.substring(0,oldHref.indexOf('themes')) + 'themes/' + newVal + '/easyui.css';
           $('#uiTheme').attr('href', newHref);
           //设置cookie值，并设置7天有效时间
           $.cookie('theme', newVal,{expires: 7});
        }
    });
	
	//主题
	var theme = $.cookie('theme')
	var default_theme = ["default","black","gray","bootstrap","metro","cupertino","dark-hive","metro-blue","metro-gray","metro-green","metro-orange","metro-red","pepper-grinder","sunny"]
	if(default_theme.indexOf(theme) == -1){
		$.cookie('theme', 'metro',{ expires: 7 }); // 存储一个带7天期限的 cookie 
		theme = 'metro'
	}
	
	//主目录
	$('#main_tree').tree({
	    onClick: function(node){
	    	  if(node.id != undefined){return false}
              var tabObj = $('#main_tabs').tabs('getTab',node.text);
              index = $('#main_tabs').tabs('getTabIndex',tabObj);
              $('#main_tabs').tabs('select',index);
	    },
	            data: [{text: 'Rs Medi Zone',"iconCls":"icon-server",id:"a1",children:[{text: 'Home',"iconCls":"icon-home",},{text: 'Products',"iconCls":"icon-product"},{text: 'Blog',"iconCls":"icon-diary"}]}],
	            animate:true,
	});
	
	//商品表刷新方法
	$('a[data=ReloadProducts]').click(function(){
		var node = $('#category').tree('getSelected')
		if(node == null){
			$('#products').datagrid('reload')
		}else{
			$('#products').datagrid({
				queryParams:{
					category:node.text,
				}
			});
			
		}
	});
	
	//商品表添加方法
	$('a[data=AddProducts]').click(function(){
		var node = $('#category').tree('getSelected')
		var category = ''
		if(node == null){
		}else{
			if(node.text == 'All' || node.text == 'Hot' || node.text == 'None Category'){
				
			}else{
				category = node.text
			}
		}
		
		$('#products').datagrid('loading')
		
		$.ajax({url:'/admin/add_product/',type:'post',data:{'category':category,},timeout:30000,success:function(data){
			
			
			$('#products').datagrid('loaded')
			$('a[data=ReloadProducts]').click()
			$.messager.alert('成功','添加成功!','success');
		},error:function(data){
			
			$('#products').datagrid('loaded')
			$.messager.alert('错误','添加失败!','error');
		},
		
		});
		
		
	})
	
	
	$('#home').datagrid({
        nowrap: true, 
        striped: true, 
        border: false, 
        collapsible:false,//是否可折叠的
        fit: true,//自动大小 
        url:'/admin/home_page/',
        method:'get',
        fitColumns:true,
        remoteSort:false,
        singleSelect:true,//是否单选 
        columns:[[
            {field:'title',title:'title',width:fixWidth(0.05),align:'center'},
            {field:'url',title:'url',width:fixWidth(0.1),align:'center'},
            {field:'picture',title:'picture',width:fixWidth(0.1),align:'center',
            	styler:function(value,row,index){
            		return "color:red"
            	}
            },
            {field:'size',title:'size',width:fixWidth(0.1),align:'center',
            	styler:function(value,row,index){
            		return "color:blue"
            	}
            },
            ]],
        onClickRow:function(index,row){
    		$('#home').datagrid('expandRow',index);
        },
        view:detailview,
        detailFormatter: function(rowIndex, rowData){
        	return '<table style="width:100%;height:300px">\
        				<tr>\
        					<td width="50%">\
        						<div style="color:blue;font-size:15px;font-size:16px;padding-left:10px;">首页图片</div>\
        						<div style="width:50%;padding:10px;border:1px solid red">\
        							<img src="'+rowData.picture+'" width="80%">\
        						</div>\
        					</td>\
        					<td width="50%">\
        						<div>\
	        						<div style="padding:10px;color:red;">\
										文件尺寸为:'+rowData.size+' &nbsp;,单位/像素\
									</div>\
        							<div style="padding:10px;">\
        								url:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="easyui-textbox"  type="text" data="url" style="width:40%;" value="'+rowData.url+'"/>\
        							</div>\
        							<div style="padding:10px;">\
        								替换文件:<input type="file" style="width:40%" data="file">\
        							</div>\
        							<div style="padding:10px;">\
        								<span style="padding-left:20%;"></span>\
    									<a href="#" class="easyui-linkbutton c5" index="'+rowIndex+'" title="'+rowData.title+'" data-options="'+"iconCls:'icon-save'"+'" onclick="HomeSave(this);">保存</a>\
        								<span style="padding-left:20px;"></span>\
    									<a href="#" class="easyui-linkbutton c2" onclick="CloseDetail(this)" index="'+rowIndex+'" table="home" data-options="'+"iconCls:'icon-undo'"+'">收起</a>\
        							</div>\
        						</div>\
        					</td>\
        				</tr>\
        			</table>'
        },
        onExpandRow: function(index,row){
        	var table = $(this).datagrid('getRowDetail',index).find('table');
        	$.parser.parse(table);
        },
        onCollapseRow:function(index,row){
        	
        },
        toolbar:'#home_datagrid_toolbar',
	}); 
	//初始化他的toolbar按钮功能
	$('#home_datagrid_toolbar').children('a:eq(0)').bind('click',function(){
		var length = $('#home').datagrid('getRows').length
		if($(this).attr('data') == 'false'){
			for(var i = 0;i<length;i++){
		    	$('#home').datagrid('expandRow',i)
			}
			$(this).attr('data','true')
			$(this).removeClass('c6')
			$(this).addClass('c5')
			//$.parser.parse('#home_datagrid_toolbar')
			$(this).find('.l-btn-text').text('全部收起')
			$(this).find('.l-btn-icon').removeClass('icon-undo')
			$(this).find('.l-btn-icon').addClass('icon-redo')
		}else{
			for(var i = 0;i<length;i++){
		    	$('#home').datagrid('collapseRow',i)
			}
			$(this).attr('data','false')
			$(this).removeClass('c5')
			$(this).addClass('c6')
			//$.parser.parse('#home_datagrid_toolbar')
			$(this).find('.l-btn-text').text('全部展开')
			$(this).find('.l-btn-icon').removeClass('icon-redo')
			$(this).find('.l-btn-icon').addClass('icon-undo')
		}
	});
	
	
	
	
	
	
	
	//product功能初始化s
	
	$('#category').tree({
		url:'/admin/get_category/',
		method:'post',
		border:true,
		onClick:function(node){
			$('#products').datagrid({
				queryParams:{
					category:node.text,
				}
			});
			
		},
		onBeforeCheck:function(node,checked){
			if(node.text == 'Hot' || node.text == 'All' || node.text == 'None Category'){
				return false;
			}
		},
		onAfterEdit:function(node){
			var node = $(this).tree('getSelected')
			if(node.text != node.data){
				SaveCategory()
			}
		},
		onContextMenu: function(e, node){
			e.preventDefault();
			// select the node
			$('#category').tree('select', node.target);
			// display context menu
			$('#category_right_click').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		},
		
	});
	
	
	$('#products').datagrid({
        nowrap: true, 
        striped: true, 
        border: false, 
        collapsible:false,//是否可折叠的
        fit: true,//自动大小 
        url:'/admin/products_list/',
        method:'post',
        fitColumns:true,
        remoteSort:false,
        singleSelect:true,//是否单选 
        columns:[[
            {field:'id',title:'id',width:fixWidth(0.02),align:'center',
            	styler:function(value,row,index){
	        		return "border:0px;"
	        	},
            },
            {field:'main_picture',title:'product_title',width:fixWidth(0.05),align:'center',
            	formatter:function(value,rowData,rowIndex){
		            return '<img  src="'+rowData.main_picture+'" width="25%" height="25%">'; 
	            },
	            styler:function(value,row,index){
	        		return "border:0px;"
	        	},
            },
            {field:'product_title',title:'product_title',width:fixWidth(0.1),align:'center',
            	styler:function(value,row,index){
            		return "color:blue;border:0px"
            	}
            },
            {field:'product_price',title:'product_price',width:fixWidth(0.1),align:'center',
            	styler:function(value,row,index){
            		return "color:red;border:0px;"
            	}
            },
            ]],
        onClickRow:function(index,row){
    		$('#products').datagrid('expandRow',index);
        },
        onRowContextMenu:function(e, rowIndex, rowData){
        	e.preventDefault();
        	$('#products').datagrid('selectRow',rowIndex);
			// display context menu
			$('#product_datagrid_menu').menu('show', {
				left: e.pageX,
				top: e.pageY
			});
        },
        view:detailview,
        detailFormatter: function(rowIndex, rowData){
        	var detail_picture_list = eval(rowData.detail_picture)
        	
        	var detail_dom = ''
    		for(var i= 0;i<detail_picture_list.length;i++){
        		detail_dom= detail_dom + '<div style="background-repeat:no-repeat;height:110px;width:135px;background-size:110px 120px; border:1px solid red;float:left;margin-left:15px;background-image:url(\''+detail_picture_list[i]+'\');"><a class="icon-cancel" style="float:right;" onclick="RemoveDetail(this)" data="'+detail_picture_list[i]+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>'
        	}
        	
        	var resource_list = eval(rowData.resource)
        	var resource_dom  = ''
    		for(var i= 0;i<resource_list.length;i++){
    			var new_list = resource_list[i].split('/')
    			resource_dom += '<a href="'+resource_list[i]+'" target="blank" style="float:left;margin-left:10px;margin-top:5px;">'+new_list[new_list.length-1]+'</a>'
        	}
        	
        	return '<table style="width:100%;height:950px;">\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">product_title</span>\
	</td>\
	<td width="310">\
    	<input class="easyui-textbox" style="width:300px;" data="product_title" value="'+rowData.product_title+'">\
	</td>\
	<td width="120" rowspan="3">\
    	<span style="color:blue;font-size:15px">remark</span>\
	</td>\
    <td rowspan="3">\
    	<input class="easyui-textbox" data-options="width:330,height:100,multiline:true" data="remark" >\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">product_storage</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="product_storage" value="'+rowData.product_storage+'">\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">product_price</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="product_price" value="'+rowData.product_price+'">\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">pruchasing_price</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="purchasing_price" value="'+rowData.purchasing_price+'">\
	</td>\
	<td rowspan="3">\
    	<span style="color:blue;font-size:15px">product<br>package</span>\
	</td>\
	<td rowspan="3">\
    	<input class="easyui-textbox" data-options="width:330,height:100,multiline:true" data="product_package" >\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">delivery_time</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="delivery_time" value="'+rowData.delivery_time+'">\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">MOQ</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="MOQ" value="'+rowData.MOQ+'">\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
		<span style="color:blue;font-size:15px">warranty_of_overall_unit</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;" data="warranty_of_overall_unit" value="'+rowData.warranty_of_overall_unit+'">\
	</td>\
	<td rowspan="3">\
    	<span style="color:blue;font-size:15px">product<br>configuration</span>\
	</td>\
    <td rowspan="3">\
    	<input class="easyui-textbox" data-options="width:330,height:120,multiline:true"  data="product_configuration" >\
    </td>\
</tr>\
<tr height="30">\
	<td width="150">\
    	<span style="color:blue;font-size:15px">warranty_of_spare_parts</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;"  data="warranty_of_spare_parts" value="'+rowData.warranty_of_spare_parts+'">\
	</td>\
</tr>\
<tr height="30">\
	<td width="150">\
    	<span style="color:blue;font-size:15px">factory</span>\
	</td>\
	<td>\
    	<input class="easyui-textbox" style="width:300px;"  data="factory" value="'+rowData.factory+'">\
	</td>\
</tr>\
<tr height="120">\
	<td>\
		<span style="color:blue;font-size:15px">spare_parts</span>\
	</td>\
	<td colspan="3">\
		<input class="easyui-textbox" data-options="width:770,height:120,multiline:true" data="spare_parts" >\
	</td>\
</tr>\
<tr height="220">\
	<td width="150" >\
    	<span style="color:blue;font-size:15px">product<br>specifcation</span>\
	</td>\
	<td colspan="3">\
    	<input class="easyui-textbox" data-options="width:770,height:220,multiline:true"  data="product_specifcation" >\
	</td>\
</tr>\
<tr height="120">\
    <td colspan="4">\
       <div style="height:115px;width:140px;float:left;`">\
    		<img src="'+rowData.main_picture+'" height="100" data="main_picture">\
    	</div>\
       <div style="height:115px;width:45px;float:left">\
    		<a href="#" class="easyui-linkbutton c7" style="width:55px;margin-top:40px;" data="upload_main_picture" data-options="\'iconCls\':\'icon-upload\'">上传</a>\
       </div>\
       <div style="height:115px;width:670px;float:left" data="detail_field">'+detail_dom+'</div>\
	   <div style="height:115px;width:55px;float:left">\
        	<a href="#" class="easyui-linkbutton c7" style="width:55px;margin-top:40px;" data="upload_detail_picture" data-options="\'iconCls\':\'icon-upload\'">上传</a>\
	   </div>\
	</td>\
</tr>\
<tr height="130">\
	<td colspan="4">\
        	<div style="height:130px;width:400px;border:1px solid red;float:left" data="resource_field">'+resource_dom+'</div>\
    		<div style="float:left;width:515px">\
	        	<div style="height:35px;width:515px;float:left;">\
					<input data="upload_file" type="file" multiple=true style="margin-top:10px;margin-left:10px;" > \
	    		</div>\
	    		<div style="height:25px;width:515px;float:left;margin-top:14px;margin-left:20px">\
    				<span style="float:right;color:red;margin-right:150px;"data="HotValue">'+rowData.hot+'</span>\
	    			<span style="float:right;color:red;" >热度值:&nbsp;&nbsp;</span>\
        			<input class="easyui-slider" value="12"  style="width:300px;" data="hot">\
				</div>\
	        	<div style="height:40px;width:515px;float:left">\
		        	<a href="#" class="easyui-linkbutton c7" data-options="\'iconCls\':\'icon-upload\'" style="float:left;margin:10px 0 0 10px;" data="upload_resource">上传</a>\
		        	<a href="#" class="easyui-linkbutton c5" data-options="\'iconCls\':\'icon-save\'"style="float:left;margin:10px 0 0 10px;"  data="save_info">保存</a>\
		        	<span style="float:left;margin:10px 0 0 10px;"><input class="easyui-switchbutton" data-options="onText:\'Yes\',offText:\'No\'" data="switch"></span>\
		        	<a href="/'+rowData.id+'/products_detail.html" class="easyui-linkbutton c3" target="_blank" data-options="\'iconCls\':\'icon-search\'"style="float:left;margin:10px 0 0 10px;">查看</a>\
		        	<a href="#" class="easyui-linkbutton c2" data-options="\'iconCls\':\'icon-redo\'"style="float:left;margin:10px 0 0 10px;" index="'+rowIndex+'" data="collapse">收起</a>\
	        	</div>\
        	</div>\
	</td>\
</tr>\
        			</table>'
        },
        onExpandRow: function(index,row){
        	var table = $(this).datagrid('getRowDetail',index).find('table');
        	$.parser.parse(table);
        	$(table).find('a[data=collapse]').click(function(){
        		$('#products').datagrid('collapseRow',index)
        	})
        	
        	
        	//添加值
        	$(table).find('input[data=product_specifcation]').textbox('setText',row.product_specifcation)
        	$(table).find('input[data=spare_parts]').textbox('setText',row.spare_parts)
        	$(table).find('input[data=product_configuration]').textbox('setText',row.product_configuration)
        	$(table).find('input[data=product_package]').textbox('setText',row.product_package)
        	$(table).find('input[data=remark]').textbox('setText',row.remark)
        	//滚动
        	$(table).find('input[data=hot]').slider({
        		onChange:function(newValue,oldValue){
        			$(table).find('span[data=HotValue]').text(newValue)
        		}
        	})
        	$(table).find('input[data=hot]').slider('setValue',row.hot)
        	console.log(row.hot)
        	
        	//开关方法
			if(row.publish == 'true'){
				$(table).find('input[data=switch]').switchbutton('check')
        	}
        	$(table).find('input[data=switch]').switchbutton({
        			onChange:function(checked){
        				$.ajax({url:'/admin/product_switch/',type:'post',data:{'p_id':row.id,'checked':checked},timeout:30000,success:function(data){
        					
        				},error:function(data){
        				},
        				});
        			},
        		}
        	)
        	//目录图上传
        	$(table).find('a[data=upload_main_picture]').click(function(e){
        		e.preventDefault();
        		$.messager.confirm('上传', '确定上传<span style="color:red;font-size:16px;">目录主图</span>吗?', function(r){
    				if(r){
    					var data = new FormData();
    					var file = $(table).find('input[data=upload_file]')[0].files[0];
    					if(file == undefined){
    						$.messager.alert('错误','<span style="font-size:16px;color:red;">没有选择文件!</span>','error');
    						return
    					}
    					data.append("p_id",row.id)
    					data.append("file",file)
    					$('#products').datagrid('loading')
    					$.ajax({url:'/admin/save_main_picture/', type: 'POST',
    					    xhr: function() {  // custom xhr
    					        myXhr = $.ajaxSettings.xhr();
    					        if(myXhr.upload){myXhr.upload.addEventListener('progress',progressHandlingFunction, false);}
    					        return myXhr;
    					    },
    					    success: function(data){
    					    	$(table).find('img[data=main_picture]').prop('src',data)
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('成功','上传成功','success');
    					    },
    					    error: function(data){
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('错误','上传失败请稍后再试!','error');
    					    },
    					    data: data,
    					    cache: false,
    					    contentType: false,
    					    processData: false
    					});
    				}
    			});
        	});
        	//细节图上传
        	$(table).find('a[data=upload_detail_picture]').click(function(e){
        		e.preventDefault();
        		$.messager.confirm('上传', '确定上传<span style="color:red;font-size:16px;">细节图吗?,至多4张!</span>', function(r){
    				if(r){
    					var data = new FormData();
    					var file = $(table).find('input[data=upload_file]')[0].files;
    					if(file.length == 0){
    						$.messager.alert('错误','<span style="font-size:16px;color:red;">没有选择文件!</span>','error');
    						return
    					}else{
    						for(var i=0;i<file.length;i++){
    							data.append("file",file[i])
    						}
    					}
    					data.append("p_id",row.id)
    					$('#products').datagrid('loading')
    					$.ajax({url:'/admin/save_detail_picture/', type: 'POST',
    					    xhr: function() {
    					        myXhr = $.ajaxSettings.xhr();
    					        if(myXhr.upload){myXhr.upload.addEventListener('progress',progressHandlingFunction, false);}
    					        return myXhr;
    					    },
    					    success: function(data){
    					    	var detail_picture_list = eval(data)
    				    		for(var i in detail_picture_list){
    				        		$(table).find('div[data=detail_field]').append('<div style="background-repeat:no-repeat;height:110px;width:135px;background-size:110px 120px; border:1px solid red;float:left;margin-left:15px;background-image:url(\''+detail_picture_list[i]+'\');"><a class="icon-cancel" style="float:right;" onclick="RemoveDetail(this)" data="'+detail_picture_list[i]+'">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></div>')
    				    		}
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('成功','上传成功','success');
    					    },
    					    error: function(data){
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('错误','上传失败请稍后再试!','error');
    					    },
    					    data: data,
    					    cache: false,
    					    contentType: false,
    					    processData: false
    					});
    				}
    			});
        	});
        	//resource上传
        	$(table).find('a[data=upload_resource]').click(function(e){
        		e.preventDefault();
        		$.messager.confirm('上传', '确定上传<span style="color:red;font-size:16px;">资源吗?</span>', function(r){
    				if(r){
    					var data = new FormData();
    					var file = $(table).find('input[data=upload_file]')[0].files;
    					if(file.length == 0){
    						$.messager.alert('错误','<span style="font-size:16px;color:red;">没有选择文件!</span>','error');
    						return
    					}else{
    						for(var i=0;i<file.length;i++){
    							data.append("file",file[i])
    						}
    					}
    					data.append("p_id",row.id)
    					$('#products').datagrid('loading')
    					$.ajax({url:'/admin/save_resource/', type: 'POST',
    					    xhr: function() {
    					        myXhr = $.ajaxSettings.xhr();
    					        if(myXhr.upload){myXhr.upload.addEventListener('progress',progressHandlingFunction, false);}
    					        return myXhr;
    					    },
    					    success: function(data){
    					    	var resource = eval(data)
    					    	
    					    	for(var i= 0;i<resource.length;i++){
    				    			var new_list = resource[i].split('/')
    				    			$(table).find('div[data=resource_field]').append('<a href="'+resource[i]+'" target="blank" style="margin-top:5px;float:left;margin-left:10px;">'+new_list[new_list.length-1]+'</a>')
    				        	}
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('成功','上传成功','success');
    					    },
    					    error: function(data){
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('错误','上传失败请稍后再试!','error');
    					    },
    					    data: data,
    					    cache: false,
    					    contentType: false,
    					    processData: false
    					});
    				}
    			});
        	});
        	
        	
        	//信息上传
        	$(table).find('a[data=save_info]').click(function(e){
        		e.preventDefault();
        		$.messager.confirm('上传', '确定保存<span style="color:red;font-size:16px;">信息吗?</span>', function(r){
    				if(r){
    					var data = new FormData();
    					data.append("p_id",row.id)
    					
    					
    					
    					var factory = $(table).find('input[data=factory]').textbox('getText')
						var product_title = $(table).find('input[data=product_title]').textbox('getText')
						var product_configuration = $(table).find('input[data=product_configuration]').textbox('getText')
						var product_specifcation = $(table).find('input[data=product_specifcation]').textbox('getText')
						var product_package = $(table).find('input[data=product_package]').textbox('getText')
						var product_storage = $(table).find('input[data=product_storage]').textbox('getText')
						var product_price = $(table).find('input[data=product_price]').textbox('getText')
						var purchasing_price = $(table).find('input[data=purchasing_price]').textbox('getText')
						var delivery_time = $(table).find('input[data=delivery_time]').textbox('getText')
						var MOQ = $(table).find('input[data=MOQ]').textbox('getText')
						var warranty_of_overall_unit = $(table).find('input[data=warranty_of_overall_unit]').textbox('getText')
						var spare_parts = $(table).find('input[data=spare_parts]').textbox('getText')
						var warranty_of_spare_parts = $(table).find('input[data=warranty_of_spare_parts]').textbox('getText')
						var remark = $(table).find('input[data=remark]').textbox('getText')
						var hot = $(table).find('span[data=HotValue]').text()
						
						data.append('p_id',row.id)
    					data.append('factory',factory)
    					data.append('product_title',product_title)
    					data.append('product_configuration',product_configuration)
    					data.append('product_specifcation',product_specifcation)
    					data.append('product_package',product_package)
    					data.append('product_storage',product_storage)
    					data.append('purchasing_price',purchasing_price)
    					data.append('delivery_time',delivery_time)
    					data.append('MOQ',MOQ)
    					data.append('warranty_of_overall_unit',warranty_of_overall_unit)
    					data.append('spare_parts',spare_parts)
    					data.append('warranty_of_spare_parts',warranty_of_spare_parts)
    					data.append('remark',remark)
    					data.append('product_price',product_price)
    					data.append('hot',hot)
    					
    					$('#products').datagrid('loading')
    					$.ajax({url:'/admin/save_product_info/', type: 'POST',
    					    xhr: function() {
    					        myXhr = $.ajaxSettings.xhr();
    					        if(myXhr.upload){myXhr.upload.addEventListener('progress',progressHandlingFunction, false);}
    					        return myXhr;
    					    },
    					    success: function(data){
    					    	if(data == 'ok'){
    					    		$('#products').datagrid('updateRow',{
    						    		index: index,
    						    		row: {
    						    			factory:factory,
    						    			product_title:product_title,
    						    			product_configuration:product_configuration,
    						    			product_specifcation:product_specifcation,
    						    			product_package:product_package,
    						    			product_storage:product_storage,
    						    			purchasing_price:purchasing_price,
    						    			delivery_time:delivery_time,
    						    			MOQ:MOQ,
    						    			warranty_of_overall_unit:warranty_of_overall_unit,
    						    			spare_parts:spare_parts,
    						    			warranty_of_spare_parts:warranty_of_spare_parts,
    						    			remark:remark,
    						    			product_price:product_price,
    						    			hot:hot,
    						    		}
    						    	});
    					    	}
    					    	
    					    	$('#products').datagrid('collapseRow',index)
    					    	$('#products').datagrid('expandRow',index)
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('成功','信息保存成功','success');
    					    },
    					    error: function(data){
    					    	$('#products').datagrid('loaded')
    					    	$.messager.alert('错误','保存失败请稍后再试!','error');
    					    },
    					    data: data,
    					    cache: false,
    					    contentType: false,
    					    processData: false
    					});
    				}
    			});
        	});
        	
        	
        	
        },
        onCollapseRow:function(index,row){
        	
        },
        toolbar:'#product_datagrid_toolbar',
	}); 
	
	
	//初始化他的toolbar按钮功能
	$('#product_datagrid_toolbar').children('a[render=products]').bind('click',function(){
		var length = $('#products').datagrid('getRows').length
		if($(this).attr('data') == 'false'){
			for(var i = 0;i<length;i++){
		    	$('#products').datagrid('expandRow',i)
			}
			$(this).attr('data','true')
			$(this).removeClass('c6')
			$(this).addClass('c5')
			//$.parser.parse('#home_datagrid_toolbar')
			$(this).find('.l-btn-text').text('全部收起')
			$(this).find('.l-btn-icon').removeClass('icon-undo')
			$(this).find('.l-btn-icon').addClass('icon-redo')
		}else{
			for(var i = 0;i<length;i++){
		    	$('#products').datagrid('collapseRow',i)
			}
			$(this).attr('data','false')
			$(this).removeClass('c5')
			$(this).addClass('c6')
			//$.parser.parse('#home_datagrid_toolbar')
			$(this).find('.l-btn-text').text('全部展开')
			$(this).find('.l-btn-icon').removeClass('icon-redo')
			$(this).find('.l-btn-icon').addClass('icon-undo')
		}
	});
	
	
	
});
//宽度自适应
function fixWidth(percent){  
    return document.body.clientWidth * percent ; //这里你可以自己做调整  
}

function HomeSave(obj){
	//每一次上传前把进度条重置
	$('#progress').progressbar({value:0});
	//显示遮照
	$('#home').datagrid('loading')
	
	var url = $(obj).closest('td').find('input[data=url]').textbox('getValue')
	var index = $(obj).attr('index')
	var title = $(obj).attr('title')
	
	if($.trim(url) == ''){
		$.messager.alert('错误','url不能为空!','error');
		$('#home').datagrid('loaded')
		return
	}
	//formdata对象
	var data = new FormData();
	//单文件的情况
	var file = $(obj).closest('td').find('input[data=file]')[0].files[0];
	if(file == undefined){
		data.append("url",url)
		data.append("title",title)
	}else{
		data.append("file",file)
		data.append("url",url)
		data.append("title",title)
	}
	
	$.ajax({
			url:'/admin/home_page/',
		    type: 'POST',
		    xhr: function() {  // custom xhr
		        myXhr = $.ajaxSettings.xhr();
		        if(myXhr.upload){ // check if upload property exists
		            myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
		        }
		        return myXhr;
		    },
		    //Ajax事件
		    //beforeSend: alert(),
		    success: function(data){
		    	console.log(data)
		    	if(data == 'no_file'){
		    		$('#home').datagrid('updateRow',{
			    		index: index,
			    		row: {
			    			url:url,
			    		}
			    	});
		    	}else{
		    		$('#home').datagrid('updateRow',{
			    		index: index,
			    		row: {
			    			url:url,
			    			picture:'/static/images/'+data,
			    		}
			    	});
		    	}
		    	
		    	
		    	$('#home').datagrid('collapseRow',index)
		    	$('#home').datagrid('expandRow',index)
		    	//去除遮照
		    	$('#home').datagrid('loaded')
		    	
		    	
		    	$.messager.alert('成功','上传成功','success');
		    },
		    error: function(data){
		    	$('#home').datagrid('collapseRow',index)
		    	$('#home').datagrid('expandRow',index)
		    	//去除遮照
		    	$('#home').datagrid('loaded')
		    	$.messager.alert('错误','上传失败请稍后再试!','error');
		    },
		    // Form数据
		    data: data,
		    //Options to tell JQuery not to process data or worry about content-type
		    cache: false,
		    contentType: false,
		    processData: false
	});
	
	
	
	
	
}


function CloseDetail(obj){
	var index = $(obj).attr('index')
	var table = $(obj).attr('table')
	$('#'+table).datagrid('collapseRow',index)
}


function progressHandlingFunction(e){
    if(e.lengthComputable){
        //$('progress').attr({value:e.loaded,max:e.total});
        //$('#progress').progressbar({value:e.loaded});
    	var howmuch = (e.loaded / e.total) * 100;
		    $('#progress').progressbar({value:Math.ceil(howmuch)}); 
    }
}




function RemoveCategory(){
	var node = $('#category').tree('getSelected');
		$.messager.confirm('Remove Category', '你确定要删除目录:'+node.text+'吗?', function(r){
	        if (r){
	        	$.ajax({url:'/admin/remove_category/',type:'post',timeout:80000,data:{'category':node.text,},success:function(data){
	        		if(data == 'ok'){
	        			$.messager.alert('成功','删除成功','success');
	        			$('#category').tree('reload')
	        			//表格右键功能
	        			var item = $('#product_datagrid_menu').menu('findItem',node.text);
	        			$('#product_datagrid_menu').menu('removeItem',item.target)
	        		}
	        	},error:function(data){
	        		$.messager.alert('错误','删除失败请稍后再试!','error');
	        	},
        	});
	        }
	    });
}


function AddCategory(){
	$.messager.prompt('Add Category', '请输入目录名', function(r){
        if (r){
        	var category = $.trim(r)
        	if(category == '' || category=='Hot' || category=='None Category' || category == 'All'){
        		return
        	}
        	$.ajax({url:'/admin/add_category/',type:'post',timeout:80000,data:{'category':category,},success:function(data){
	        		if(data == 'ok'){
	        			$.messager.alert('成功','添加成功','success');
	        			$('#category').tree('reload')
	        			var item = $('#product_datagrid_menu').menu('findItem', '切换目录');
	        			$('#product_datagrid_menu').menu('appendItem', {
	        				parent: item.target,  // the parent item element
	        				text: category,
	        				onclick: function(){ChangeCategory()}
	        			});
	        		}
	        		if(data == 'repeat'){
	        			$.messager.alert('错误','目录名重复','error');
	        			$('#category').tree('reload')
	        		}
	        	},error:function(data){
	        		$.messager.alert('错误','添加失败请稍后再试!','error');
	        	},
        	});
        }
    });
}


function EditCategory(){
	var node = $('#category').tree('getSelected')
	$('#category').tree('beginEdit',node.target)
	
}


function SaveCategory(){
	var node = $('#category').tree('getSelected')
	
	$.ajax({url:'/admin/edit_category/',type:'post',timeout:80000,data:{'category':node.text,'old':node.data},success:function(data){
		if(data == 'ok'){
			$.messager.alert('成功','修改成功','success');
			$('#category').tree('reload');
			var item = $('#product_datagrid_menu').menu('findItem',node.data);
			$('#product_datagrid_menu').menu('setText', {
				target: item.target,
				text: node.text
			});
		}
		if(data == 'repeat'){
			$.messager.alert('错误','目录名重复','error');
			$('#category').tree('reload')
		}
	},error:function(data){
		$.messager.alert('错误','添加失败请稍后再试!','error');
	},
	});
}



function RemoveDetail(obj){
	$.messager.confirm('删除', '确定删除<span style="color:red;font-size:16px;">细节图吗?</span>', function(r){
		if(r){
			var url = $(obj).attr('data')
			var data = new FormData();
			data.append("url",url)
			$('#products').datagrid('loading')
			$.ajax({
				url:'/admin/remove_detail_picture/',
			    type: 'POST',
			    xhr: function() {  // custom xhr
			        myXhr = $.ajaxSettings.xhr();
			        if(myXhr.upload){ // check if upload property exists
			            myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
			        }
			        return myXhr;
			    },
			    success: function(data){
			    	//去除遮照
			    	$('#products').datagrid('loaded')
			    	$.messager.alert('成功','删除成功','success');
			    	$(obj).parent('div').remove()
			    },
			    error: function(data){
			    	//去除遮照
			    	$('#products').datagrid('loaded')
			    	$.messager.alert('错误','操作失败请稍后再试!','error');
			    },
			    // Form数据
			    data:data,
			    //Options to tell JQuery not to process data or worry about content-type
			    cache: false,
			    contentType: false,
			    processData: false
			});
		}
	})
}




function GetProductRightClickMenu(){
	$.ajax({url:'/admin/get_category/',type:'post',timeout:30000,success:function(data){
		var data_list = eval(data)
		for(var i in data_list){
			if(data_list[i].text == '' || data_list[i].text=='Hot' || data_list[i].text=='None Category' || data_list[i].text == 'All'){
			}else{
				var item = $('#product_datagrid_menu').menu('findItem','切换目录');
				$('#product_datagrid_menu').menu('appendItem', {
					parent: item.target,  // the parent item element
					text:data_list[i].text,
					onclick: function(){ChangeCategory()}
				});
				
			}
			
		}
	},error:function(data){
	},
	});
}



function ChangeCategory(e){
	if(!e){  
        var e = window.event;  
	} 
	var category = $(e.target).text()
	var rowData = $('#products').datagrid('getSelected')
	var p_id = rowData.id
	$.ajax({url:'/admin/change_category/',type:'post',data:{'p_id':p_id,'category':category},timeout:30000,success:function(data){
		$('a[data=ReloadProducts]').click()
	},error:function(data){
	},
	});
}





