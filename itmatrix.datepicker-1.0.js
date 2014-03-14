//==========================================================
// ����� ���������
// ������ 2.0 �������� � UI
// ��������� �������, 2012
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
			dayNames: [ "�����������", "�����������", "�������", "�����", "�������", "�������", "�������" ],
			dayNamesMin: [ "��", "��", "��", "��", "��", "��", "��" ],
			monthNames: [ "������", "�������", "����", "������", "���", "����", "����", "������", "��������", "�������", "������", "�������" ],
			monthNamesShort: [ "������", "�������", "����", "������", "���", "����", "����", "������", "��������", "�������", "������", "�������" ],
			showOtherMonths: true,
      selectOtherMonths: true,
			showButtonPanel: true,
			currentText: "�������",
			closeText : "X",
			nextText: "��������� �����",
			prevText: "���������� �����",
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


