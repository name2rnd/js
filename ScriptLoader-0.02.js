//==========================================================
// ����� ��������� ��������
// ������ 0.02
// ��������� �������, 2012
// callback �������� ���, ��������:

// var Ajax = new ItmatrixAjax;
// var callback = function() { Ajax.load() };
// loader.load('http://static.itmatrix.ru/js/itmatrix/form-0.02.js', callback);

//==========================================================
function ItmatrixScriptLoader()
{
	var _loaded = {};
	//==========================================================
	this.load = function (path, callback)
	{
		if (_loaded[path] == 1)
		{
			return;
		}
		_loaded[path] = 1;
		
		var that = this;
		$.ajax( {url: path, dataType: "script", async : false, crossDomain: true,
							success: callback
						}
					);
		return 1;
	};
	return this;
};