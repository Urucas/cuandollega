function _container(path, parent, id, callback) {

//	try{ view.preloader(); }catch(e){ alert(e); }

	if(path == undefined || parent == undefined) return;	
	var par = document.getElementById(parent); 
	var elm = document.createElement('div');
		elm.id = id;
		elm.style.display = 'none';
	
	par.appendChild(elm);
	$('#' + elm.id).load(
		'lib/views/' + path, 
		'',
		function() {	
			callback();
		}
	);
}

function _view() {		
	this.current_view = null;	
	this.show = function(view_id) {
		if(this.current_view != null) {
			$('#' + this.current_view).hide();
		}
		this.current_view = view_id;
		scroll(0,0);
		$('#' + view_id).show();
//		$('#preloader').hide();
	}
	this.preloader = function() {
		$('#preloader').show();
	}
}
/**
 * @param {Object} str
 * 
 */
function trim(str) {
    return str.replace(/^\s+/g,'').replace(/\s+$/g,'')
}

function ucfirst (str) {
    // Makes a string's first character uppercase  
    // 
    // version: 1008.1718
    // discuss at: http://phpjs.org/functions/ucfirst
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}
