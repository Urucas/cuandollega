var extPhonegap = {
	saveValue: function(name, value) {
		try { window.localStorage.setItem(name, value); }catch(e) {};
	},
	getValue: function(name) {
		try { return window.localStorage.getItem(name); }catch(e) {};
	},
	clearValues: function() {
		try { window.localStorage.clear();} catch(e) {};
	}
}
