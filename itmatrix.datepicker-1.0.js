//==========================================================
// Класс Календарь
// Версия 2.0 Работает с UI
// Савенкова Наталья, 2012
//==========================================================

function ItmatrixDatepicker()
{
	this.bind = function (elem)
	{
		var path = 'http://static.itmatrix.ru/js/plugins/datepicker/min-1.9.1.js';
		var loader = new ItmatrixScriptLoader();
		var self = this;
		var callback = function() { self._bind(elem) };
		loader.load(path, callback);
	};
	
	this._bind = function (elem)
	{		
		elem.datepicker(
		{ 
			dateFormat: "yy-mm-dd",
			firstDay: 1,
			dayNames: [ "Воскресенье", "Понедельник", "Вторник", "Среда", "Четверт", "Пятница", "Суббота" ],
			dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
			monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
			monthNamesShort: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
			showOtherMonths: true,
      selectOtherMonths: true,
			showButtonPanel: true,
			currentText: "Сегодня",
			closeText : "X",
			nextText: "Следующий месяц",
			prevText: "Предыдущий месяц",
			changeMonth: true,
      changeYear: true
		}
		
		);
	};
	return this;
}

$(function() 
{
	var picker = new ItmatrixDatepicker();
	picker.bind($('.ItmatrixDatepicker'));				
});


