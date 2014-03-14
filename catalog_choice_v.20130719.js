var default_open = { 'goods_type_id': 1, 'avail_id': 1, 'fabric_id': 1, 'sex_id' : 1, 'category_id' : 1, 'season' : 1 };
var deafult_sort = { 'new' : 'DESC', 'rate' : 'DESC', 'discount': 'DESC' };
// Backspace, Pause/Break, Space, Insert, Delete, цифры, буквы и знаки, NumLock-клавиши
var kk_hash = {8:1,19:1,32:1,45:1,46:1,59:1,61:1,109:1,110:1,111:1,188:1,190:1,191:1,192:1,219:1,220:1,221:1,222:1};
		for (var i=48; i < 58; i++){	kk_hash[i] = 1; };
		for (var i=65; i < 91; i++){	kk_hash[i] = 1; };
		for (var i=96; i < 106; i++){	kk_hash[i] = 1; };

$(document).ready( function(){
	// init_sliders();
	init_from_to_filters();
	init_default_params();
	show_max_dop_price();
	
	// установка открытых/закрытых блоков с фильтрами при старте страницы
	$("a.nameattribute").each( function () {
		if ( default_open[$(this).attr("name")]) 
			toggle_filter_options($(this));
	});
	
	// переключение фильтров при нажатии
	$("a.nameattribute").click ( function () {
		toggle_filter_options($(this)); 
	});
	
	$(".fltr").click( function () { toggle_checkbox($(this)) });
	$(".sortopt").click(toggle_sort_rule);
	
	$(".cutattribute_all").click(function () {
		clear_all_filters();
		update_search_location_link();
	});
	$("a.cutattribute").click( function () { 
		var filter_name = $(this).attr('id').replace(/^clear-/, '');
		clear_filter(filter_name);
		set_page(1);
		update_search_location_link();
	});
	
	$(".page").live('click', function () {
			var name = $(this).attr("name");	
			var page = name.replace(/^page_/, "");
			set_page(page);
			update_search_location_link();
			scroll_to_goods_head();
	});
	$(".goods_per_page").live('click', function () {
			var limit = $(".per_page_val").html();			
			var old_limit = get_page_limit();
			set_page_limit(limit);
			set_page(1);
			update_search_location_link();
			if (parseInt(old_limit) > parseInt(limit)) scroll_to_goods_head();
	});
	
	$("#save_search").click(function() {
		if ( $('#popup_div').is(':visible') ){
			$('#popup_div').slideUp('fast');
		}
		else {
			$('#popup_div').html('<p>Введите метку для сохранения поиска</p><p><input type="text" name="saved_search_name" id="saved_search_name"></p><p><span onClick="save_search_submit();" style="cursor:pointer;">Сохранить</span></p>').slideDown('fast');
		}
		return false;
	});
	
	$(window).hashchange( function () {
		set_search_params_from_link();
		disable_filters();
		search();
	});		
	$(window).hashchange();		
	
});

// ------------------------------------------------------------------------------
function hide_filters() 
{
	var is_adult = $('#is_adult').attr('value');
	var is_for_woman = $('#is_for_woman').attr('value');
	var is_for_man = $('#is_for_man').attr('value');
	// скрываем подошву везде, кроме женской обуви
	if ( !(is_adult==1 && is_for_woman==1) )
	{
		// $('#clear-sole_type_id').closest('div.filtritemname').hide();
		$('#sole_type_id-block').hide();
	}
	// скрываем возрастную категорию во взрослой обуви
	if (is_adult == 1)
	{
		// $('#clear-age').closest('div.filtritemname').hide();
		$('#age-block').hide();
	}
	// скрываем пол в каталогах по полу 
	if (is_for_woman==1 || is_for_man==1)
	{
		//$('#clear-sex_id').closest('div.filtritemname').hide();
		//$('#clear-sex_id').closest('div.attributeitemsfiltr').hide();
		$('#sex_id-block').hide();
	}
}

// ------------------------------------------------------------------------------
function scroll_to_goods_head()
{
	var destination = $('.main').offset().top;
	// тестить
	$('body, html').animate({ scrollTop: destination }, 400);
}

// ------------------------------------------------------------------------------
function init_default_params()
{
	if (!window.location.hash)
	{
		set_checkbox_value('avail_id-1', 1);
		var def_fabric_id = $('#default_fabric_id').val();
		var def_goods_type_id = $('#default_goods_type_id').val();
		if ( def_fabric_id > 0) 
		{
			set_checkbox_value('fabric_id-' + def_fabric_id, 1);
		}
		if (def_goods_type_id > 0) 
		{
			set_checkbox_value('goods_type_id-'+def_goods_type_id, 1);
		}
		update_search_location_link();
		show_search_string_value( $('#search_string').attr('value') );
		show_search_string_value( $('#search_id').attr('value') ); // клиент мог искать по id, в этой функции перезапишется текст
	}
}

function show_search_string_value(val)
{
	if (val) {
		$('#breadcrumb').show().find('td').html('<h2>Вы искали: ' + val + "</h2>");
	}
}

// ------------------------------------------------------------------------------
function toggle_filter_options(obj) 
{
	obj.toggleClass("nameattributesel");
	obj.parent().next().toggleClass("attributeitemsfiltrvisib");
}

// ------------------------------------------------------------------------------
function init_from_to_filters()
{
	init_from_to_filter('size');
	init_from_to_filter('stature');
	init_from_to_filter('price');
	init_from_to_filter('count_in_box');
	init_from_to_filter('age_range');
}

// ------------------------------------------------------------------------------
function init_from_to_filter(id)
{
	$('#clear-'+id).addClass('from_to_filter');
	init_from_filter(id);
	init_to_filter(id);
}

// ------------------------------------------------------------------------------
function keycode_is_appropriate(keycode)
{
	if(kk_hash[keycode] == 1)
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

// ------------------------------------------------------------------------------
function init_from_filter(id)
{	
	var obj_from = $('#'+id+'_from');
	init_filter(obj_from)
}

// ------------------------------------------------------------------------------
function init_to_filter(id)
{	
	var obj_to = $('#'+id+'_to');
	init_filter(obj_to)
}

// ------------------------------------------------------------------------------
function init_filter(obj)
{	
	var timer;
	obj.removeClass("from_to_upd");
	obj.bind('keydown',function(e){
		if(keycode_is_appropriate(e.which)){
			clearTimeout(timer);
			timer = setTimeout(function() {
				onchange_from_to_filter(obj);
			}, 750);
		}
		else{return}
	});
}

// ------------------------------------------------------------------------------
function set_page(page)
{	
	$('#page').data("val", page);	
}

// ------------------------------------------------------------------------------
function set_page_limit(limit)
{
	$('#goods_per_page').data("val", limit);	
}

// ------------------------------------------------------------------------------
function get_page_limit()
{
	return $('#goods_per_page').data("val");	
}

// ------------------------------------------------------------------------------
function set_from_to_filter_values_manual(id, min, max) 
{
	if (!min) min = '';
	if (!max) max = '';
	if (!$('#clear-'+id).hasClass('cutattributeactiv'))
	{
		$("#"+id+"_from").attr("value", Math.floor(min));
		$("#"+id+"_to").attr("value", Math.ceil(max));
		$("#"+id+"_minval_default").html(Math.floor(min));
		$("#"+id+"_maxval_default").html(Math.ceil(max));
	}
}

// ------------------------------------------------------------------------------
function onchange_from_to_filter(obj) 
{
	var id = obj.attr("id");		
	obj.data("val", obj.attr("value"));
	obj.addClass("from_to_upd");
	set_page(1);
	
	var filter_name = id.replace(/_from$|_to$/, '');
	update_clear_button(filter_name);
	
	update_search_location_link();
	return true;
}

// ------------------------------------------------------------------------------
function toggle_checkbox(obj) 
{
	if(obj.hasClass('disabled'))
	{
		return false;
	}
	else
	{
		var id = obj.attr("id");
		var value = obj.data("val") == 1 ? 0 : 1;
		set_checkbox_value(id, value);
		var filter_name = id.replace(/-\d+$/, '');
		update_clear_button(filter_name);
		set_page(1);
		update_search_location_link();
		return true;
	}
}

// ------------------------------------------------------------------------------
function set_checkbox_value(id, value)
{
	var obj = $('#'+id);
	obj.data("val", value);
	if (value == 1) 
		obj.addClass("checkattribut");
	else
		obj.removeClass("checkattribut");
	toggle_checkbox_filter_attrs_info(id, value);
}

// ------------------------------------------------------------------------------
function update_clear_button(filter_name) 
{
	var clear_but = $('#clear-'+filter_name);
	var need_show_button = 0;
	if ( clear_but.hasClass('from_to_filter') )
	{
		var min_def = $("#"+filter_name+"_minval_default").html();
		var max_def = $("#"+filter_name+"_maxval_default").html();
		var _from = $('#'+filter_name+'_from').data('val');
		var _to = $('#'+filter_name+'_to').data('val');
		if (_from || _to)
		{
			if ( min_def != _from || max_def != _to )
			{
				need_show_button = 1;
			}
		}
	}
	else {
		if ( $('.checkattribut[id^='+filter_name+']').length > 0 ) 
			need_show_button = 1;
	}
	
	if ( need_show_button )
	{
		clear_but.addClass("cutattributeactiv");
	}
	else
	{
		clear_but.removeClass("cutattributeactiv");
		$('#filter_attrs').find('#info-'+filter_name).remove();
	}
}

// ------------------------------------------------------------------------------
function update_all_clear_buttons()
{
	$('[id^=clear]').each(function() {
		var filter_name = $(this).attr('id').replace(/^clear-/, '');
		update_clear_button(filter_name);
	});
}

// ------------------------------------------------------------------------------
function clear_filter(filter_name) 
{
	var clear_but = $('#clear-'+filter_name);
	if ( clear_but.hasClass('from_to_filter') ) {
		$("#"+filter_name+"_from").data("val", '').removeClass("from_to_upd");
		$("#"+filter_name+"_to").data("val", '').removeClass("from_to_upd");
		$('#filter_attrs').find('#info-'+filter_name).remove();
	}
	else {
		$('.checkattribut[id^='+filter_name+']').each( function () {
			set_checkbox_value($(this).attr('id'), 0);
		});
	}
	clear_but.removeClass("cutattributeactiv");
}

// ------------------------------------------------------------------------------
function clear_all_filters()
{
	$('.cutattribute').each(function() {
		var filter_name = $(this).attr('id').replace(/^clear-/, '');
		clear_filter(filter_name);
		clear_sort_rule();
		set_page(1);
	});
}

// ------------------------------------------------------------------------------
function clear_sort_rule() 
{
	$('.sortopt').removeClass("activsort").removeClass("activsortup");
	$('#sort_attr').data("val", '');
	$('#sort_rule').data("val", '');
}

// ------------------------------------------------------------------------------
function set_sort_rule(sort_attr, sort_rule) 
{
	var obj = $('a[name=sort-'+sort_attr+']');
	var sort_attr_obj = $('#sort_attr');
	var sort_rule_obj = $('#sort_rule');

	$('.sortopt').removeClass("activsort").removeClass("activsortup"); // убираем отображение всех полей для сортировки
		
	sort_attr_obj.data("val", sort_attr);
	obj.addClass("activsort");
	
	if (sort_rule == 'ASC')	 {
		sort_rule_obj.data("val", 'ASC');
		obj.addClass("activsortup");
		obj.attr("title", "Сортировать по убыванию");
	}
	else {
		sort_rule_obj.data("val", 'DESC');
		obj.removeClass("activsortup");
		obj.attr("title", "Сортировать по возрастанию");
	}
}

// ------------------------------------------------------------------------------
function toggle_sort_rule()
{
	var sort_attr = $(this).attr("name").replace(/^sort-/, '');
	
	var sort_rule = 'ASC';
	if (deafult_sort[sort_attr] && $('#sort_attr').data('val') != sort_attr) // если сортировка по этому параметру не задана вообще
	{
		sort_rule = deafult_sort[sort_attr];
	}
	else if ( $('#sort_rule').data('val') == 'ASC' && $('#sort_attr').data('val') == sort_attr )
	{
		sort_rule = 'DESC';
	}
	set_sort_rule(sort_attr, sort_rule);
	set_page(1);
	update_search_location_link();
}	

// ------------------------------------------------------------------------------
function update_search_location_link() {
	var link = get_search_location_link();
	window.location.hash = link;
}

// ------------------------------------------------------------------------------
function get_search_location_link() 
{
	var params = get_search_form_params();
	
	var location_link = "";
	for (key in params) {
		if (key != 'cl' && key != 'event')
			location_link += key + "=" + params[key] + "&";
	}
	location_link = location_link.replace(/&$/, "");
	return location_link;
} 

// ------------------------------------------------------------------------------
function get_search_form_params() {
	var	params = get_form_params("#catalog_choice");
	//params['cl'] = 'search_sph';
	//params['event'] = 'run';
	
	$('.fltr').each(function() {	
		if ($(this).data("val") != undefined && $(this).data("val") != '')
		{
			params[$(this).attr("id")] = $(this).data("val");
		}
	});	
	params['utf8'] = 1;
	return params;
}

// ------------------------------------------------------------------------------
function toggle_checkbox_filter_attrs_info(attr, checked)
{
	var contaner = $('#filter_attrs');
	if (checked == 0 && contaner.find('#info-'+attr).length > 0) {
		contaner.find('#info-'+attr).remove();
	}
	else if (checked == 1 && contaner.find('#info-'+attr).length == 0) {
		var title = $('a#'+attr).html();
		if (title) {
			contaner.append("<a id='info-"+attr+"' onclick=\"toggle_checkbox($('#"+attr+"'));\"><span>"+title+"</span></a>");
		}
	}
	if (contaner.has('a')) contaner.show(); 
	else contaner.hide();
}

// ------------------------------------------------------------------------------
function toggle_from_to_filter_attrs_info(id)
{
	var container = $('#filter_attrs');
	var value_from = $('#'+id+'_from').data("val");
	var value_to = $('#'+id+'_to').data("val");
	var text = '';
	if (id.match(/^size/))
	{
		text = 'Размер';
		if(value_from){text=text+' от '+value_from};
		if(value_to){text=text+' до '+value_to};
	}
	else if (id.match(/^age_range/))
	{
		text = 'Возраст';
		if(value_from){text=text+' от '+value_from};
		if(value_to){text=text+' до '+value_to};
	}
	else if (id.match(/^stature/))
	{
		text = 'Рост';
		if(value_from){text=text+' от '+value_from};
		if(value_to){text=text+' до '+value_to};
	}
	else if (id.match(/^price/))
	{
		text = 'Цена';
		if(value_from){text=text+' от '+value_from+' руб'};
		if(value_to){text=text+' до '+value_to+' руб'};
	}
	else if (id.match(/^count_in_box/))
	{
		text = 'В коробке';
		if(value_from){text=text+' от '+value_from};
		if(value_to)
		{
			if(value_to==1){text=text+' до '+value_to+' пары'}
			else{text=text+' до '+value_to+' пар'}
		}
		else
		{
			if(value_from==1){text=text+' пары'}
			else{text=text+' пар'}
		};
	}
	container.find('#info-'+id).remove();
	container.append("<a id='info-"+id+"' onclick=\"$('#clear-"+id+"').trigger('click');\"><span>"+text+"</span></a>");

	if (container.has('a')) container.show(); 
	else container.hide();
}

// ------------------------------------------------------------------------------
function set_search_params_from_link()
{
	clear_all_filters();
	
	var sort_rule = '';
	var sort_attr = '';
	var param_list = window.location.hash.replace(/^#/, '').split(/&/);

	for (var i=0; i < param_list.length; i++) 
	{
		var param = param_list[i].split(/=/);
		var param_name = param[0];
		var param_value = param[1];
		if (param_value && param_name != 'utf8' && param_name != 'rnd')
		{
			if (param_name == 'search_string') 
			{
				param_value = decodeURI(param_value).replace(/\+/g, ' ');
				$('#search_string').val(param_value);
				show_search_string_value( param_value );
			}
			else if (param_name == 'search_id') 
			{				
				$('#search_id').val(param_value);
				show_search_string_value( param_value );
			}
			// сортировка
			else if (param_name == 'sort_rule') {
				sort_rule = param_value;
			}
			else if (param_name == 'sort_attr') {
				sort_attr = param_value;
			}
			else if (param_name == 'page') {
				set_page(param_value);
			}
			else if (param_name == 'goods_per_page') {
				set_page_limit(param_value);
			}
			else if (param_name.match(/_from$/) || param_name.match(/_to/) )
			{
				// вписать данные в инпут из адресной строки
				$('#'+param_name).data("val", param_value);
				$('#'+param_name).attr("value", param_value).addClass("from_to_upd");

				var search_field = param_name.replace(/_from$|_to$/, '');
				$('#clear-'+search_field).addClass('cutattributeactiv');
				toggle_from_to_filter_attrs_info(search_field);
			}
			// обычные параметры
			else 
			{
				set_checkbox_value(param_name, param_value);
			}
		}
	}
	// сортировка
	if (sort_attr)
		set_sort_rule(sort_attr, sort_rule);
	
	update_all_clear_buttons();
}

// ------------------------------------------------------------------------------
function search()
{
	var width = $('#catalog_choice_td').width();
	var height = $('#catalog_choice_td').height()+10;

	$('#catalog_choice_content_loading').width(width);
	$('#catalog_choice_content_loading').height(height);
	$('#catalog_choice_content_loading').show();
	
	var form_params = get_search_form_params();
	
	_search_goods(form_params);
	_search_filters_value(form_params);
}
// ------------------------------------------------------------------------------
function _search_goods(form_params)
{
	form_params['cl'] = 'search_sph';
	form_params['event'] = 'search_goods';

	$.post("/cgi-bin/dsp.pl", form_params, 
					function(data) { 
						$('#catalog_choice_content_loading').hide();
						$('#catalog_choice_content').html(data.content).css("height", "1600px");
						$('.pages_list').html(data.page_list);
					}, "json");
}
// ------------------------------------------------------------------------------
function _search_filters_value(form_params)
{
	form_params['cl'] = 'search_sph';
	form_params['event'] = 'search_filters_value';

	$.post("/cgi-bin/dsp.pl", form_params, 
					function(data) { 
						mark_possible_filter_options(data.fltr);
						hide_empty_filters(data.attr_founded);
						hide_filters(); // скрываем фильтры, которые не должны отображаться в каталога
					}, "json");
}
// ------------------------------------------------------------------------------
function mark_possible_filter_options(filters)
{
	var size_from = 0; var size_to = 0;
	var stature_from = 0; var stature_to = 0;
	var price_from = 0; var price_to = 0;
	var count_in_box_from = 0; var count_in_box_to = 0;
	var age_range_from = 0; var age_range_to = 0;
	
	for (var i=0; i < filters.length; i++)
	{
		if(filters[i].match(/^size_from/)) { size_from = filters[i].replace(/^size_from-/, ''); }
		else if(filters[i].match(/^size_to/)) { size_to = filters[i].replace(/^size_to-/, ''); 	}
		else if(filters[i].match(/^price_from/)) { price_from = filters[i].replace(/^price_from-/, ''); 	}
		else if(filters[i].match(/^price_to/)) { price_to = filters[i].replace(/^price_to-/, ''); 	}
		else if(filters[i].match(/^stature_from/)) { stature_from = filters[i].replace(/^stature_from-/, ''); 	}
		else if(filters[i].match(/^stature_to/)) { stature_to = filters[i].replace(/^stature_to-/, ''); 	}
		else if(filters[i].match(/^count_in_box_from/)) { count_in_box_from = filters[i].replace(/^count_in_box_from-/, ''); 	}
		else if(filters[i].match(/^count_in_box_to/)) { count_in_box_to = filters[i].replace(/^count_in_box_to-/, ''); 	}
		else if(filters[i].match(/^age_range_from/)) { age_range_from = filters[i].replace(/^age_range_from-/, ''); 	}
		else if(filters[i].match(/^age_range_to/)) { age_range_to = filters[i].replace(/^age_range_to-/, ''); 	}
		else
		{
			allow_filter_option($(".fltr[id="+filters[i]+"]"));
		}
	}
	if (size_from && size_to) {set_from_to_filter_values_manual('size', size_from, size_to)}
	if (stature_from && stature_to) {set_from_to_filter_values_manual('stature', stature_from, stature_to)}
	if (price_from && price_to) {set_from_to_filter_values_manual('price', price_from, price_to)}
	if (count_in_box_from && count_in_box_to) {set_from_to_filter_values_manual('count_in_box', count_in_box_from, count_in_box_to)}
	if (age_range_from && age_range_to) {set_from_to_filter_values_manual('age_range', age_range_from, age_range_to)}
	$("a.disabled").closest('li').addClass('hidden')
}

function hide_empty_filters(filters)
{
	for (var name in filters)
	{
		var obj = $("#"+name+'-block');
		var visible = filters[name];
		if (visible == 1)
		{
			obj.show();
		}
		else
		{
			if (is_block_not_checked(obj))
			{
				obj.hide();
			}
		}
	}
}

// ------------------------------------------------------------------------------
function is_block_not_checked(obj)
{
	var children = obj.find(".from_to_upd, .checkattribut");
	if (children.length > 0) return false
	else return true;
}

// ------------------------------------------------------------------------------
function allow_filter_option(obj)
{
	obj.removeClass('disabled').closest('li').removeClass('hidden');
}

// ------------------------------------------------------------------------------
function disable_filters(id)
{
 	if (id)
	{
		$(".fltr:not([id^="+id+"]):not(.checkattribut)").addClass('disabled');
	}
	else
	{
		$(".fltr:not(.checkattribut)").addClass('disabled');
	}
}

// ------------------------------------------------------------------------------
function save_search_submit()
{
	if ($('#saved_search_name').attr("value") == '')
	{
		alert('Введите, пожалуйста, метку для сохранения.');
	}
	else
	{
		var form_params = get_search_form_params("#catalog_choice");
		form_params['cl'] = 'search_sph';
		form_params['event'] = 'save_search';
		form_params['saved_search_name'] = $('#saved_search_name').attr("value");
		
		$.post("/cgi-bin/dsp.pl", form_params, function(data) {
			if (data == "ok")
			{
				$('#popup_div').html("Параметры поиска сохранены");
			}
			else
			{
				if (data == "error_login")
				{
					$('#popup_div').html("Пожалуйста, авторизутесь");
				}
			}
			setTimeout("$('#popup_div').slideUp('fast')", 2000);
		});
	}
}