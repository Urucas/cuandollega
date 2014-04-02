var app = {
	
	baseURL: "http://cinema.urucas.com/api",
	modules: [
		{ id: "consultar", view: "views/consultar.html"},
		{ id: "favoritos", view: "views/favoritos.html"},
		{ id: "configuracion", view: "views/configuracion.html"},
		{ id: "resultado", view: "views/resultado.html"},
		{ id: "search", view: "cartelera.html", callback: function() { app.search(); } },
	],
	load: function(hash) {
			//console.log("page to open -> "+hash);
		app.modules.forEach(function(m){
			if(hash == m.id) {
				app.loadView(m.view, m.callback, m.id);
				return;
			}
		});
	},
	loadView: function(view, callback, view_id) {

		try { scroll(0,0); }catch(e){};
		$("#wrapper").include(view, function(){
			try { toggle("menu"); }catch(e) {}
			try { callback(); } catch(e) {}
		});

	},
	share: function(){
		try {
			window.plugins.socialsharing.available(function(isAvailable) {
				if (isAvailable) {
					window.plugins.socialsharing.share(
						"Sos cinero? Descargate la app para tener la cartelera de cine en tu smartphone!", 
						null, 
						null, 
						"http://cineros.com.ar"
						);
				}
			});
		}catch(e){ console.log(e); }
	},

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
		console.log("binding events");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
		try { navigator.splashscreen.show(); }catch(e){ console.log(e); }
			// important event to autolod the modules and views
		window.onhashchange = function() {
			var hash = window.location.hash;
			hash = hash.replace("#","");
			app.load(hash);
		}
		try{ app.uuid = device.uuid; }catch(e){ console.log("cant get device uuid"+e.message); }

		try {
            admobCode = (device.platform=="Android") ? "ca-app-pub-7488172185490417/1616483686" : "ca-app-pub-7488172185490417/7015922082";
			admob.createBannerView(
					{'publisherId': admobCode, 'adSize': admob.AD_SIZE.BANNER}, 
					function(){
						app.adCreateBannerVewSuccess();
					}, function(){
					});

		}catch(e) { }

		document.location.href = "#consultar";
    },

	adCreateBannerVewSuccess: function() {
		try{
			admob.requestAd({
				'isTesting': false,
			'extras': {
				'color_bg': 'AAAAFF',
			'color_bg_top': 'FFFFFF',
			'color_border': 'FFFFFF',
			'color_link': '000080',
			'color_text': '808080',
			'color_url': '008000'
			}},
			function(){ },  
			function(){ }
			);
		}catch(e) { }
	},

};

function toggle(id){
	if (document.getElementById){ 
		var el = document.getElementById(id); 	
		if(el.style.display == 'none') {
			el.style.display = 'block'; 		
			el.style.zIndex = '99';
			general.style.marginLeft = '85%';
			// general.style.position = (general.style.position == 'absolute') ? 'fixed' : 'absolute';
		}else {
			el.style.display = 'none'; 	
			general.style.marginLeft = '0px';
			el.style.zIndex = '-1';
		}
	}
}

