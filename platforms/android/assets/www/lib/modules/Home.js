var Home = {	
	load: function() {
		if ($('#home_container').length) {
			Home.show();
			return;
		}
		_container(
			'home.html', 
			'main_container',
			'home_container',
			function() {
				Home.show();
			}						
		);
	},	
	show: function() {
		//$('#footer_menu').hide();
		view.show('home_container');
	}
}
