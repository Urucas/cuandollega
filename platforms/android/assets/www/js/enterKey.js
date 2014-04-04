/**
* @copyright Urucas
* @license   MIT License
* @version   Release: 1.0.0
* @link       http://urucas.com
* @developers Bruno Alassia, Pamela Prosperi
*/

Element.prototype.enterKey = function(callback) {

	if(!(this instanceof HTMLInputElement && this.getAttribute("type") == "text")) {
		return;
	}

	// remove parent form default submit on enter
	var parent = this.parentNode;
	while(!(parent instanceof HTMLDocument) && parent != null) {
		if(parent instanceof HTMLFormElement) {
			parent.setAttribute("onsubmit","return false");
			break;
		}
		parent = parent.parentNode;    
	}

	this.addEventListener("keyup", function(e){
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			try { this.blur(); }catch(e) {}
			callback(this.value);
			e.stopPropagation();
		}
	}, false);
}

NodeList.prototype.enterKey = function(callback, preventDefault) {
	for(var i=0;i<this.length;i++){
		if(this.item(i) instanceof Element) {
			this.item(i).enterKey(callback);
		}
	}	
};

// jQuery extension
try {
	jQuery.fn.enterKey = function(callback) {
		for(var i=0; i<this.length;i++) {
			var el = this[i];
			el.enterKey(callback);
		}
		return this;
	}
}catch(e) {}
