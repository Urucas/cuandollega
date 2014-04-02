var app = {
	
	baseURL: "http://cinema.urucas.com/api",
	modules: [
		{ id: "consultar", view: "views/consultar.html"},
		{ id: "favoritos", view: "views/favoritos.html"},
		{ id: "configuracion", view: "views/configuracion.html"},
		{ id: "resultado", view: "views/resultado.html", callback: function() { app.showResult(); } },
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
			try {
				// hide menu
				menu.style.display = 'none'; 	
				general.style.marginLeft = '0px';
				menu.style.zIndex = '-1';

			}catch(e) {}
			try { callback(); } catch(e) {}
		});
	},
	share: function(){
		try {
			window.plugins.socialsharing.available(function(isAvailable) {
				if (isAvailable) {
					window.plugins.socialsharing.share(
						"No hagas cálculos de horarios, quedate en la cama hasta que llegue el cole!", 
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
		//console.log("binding events");
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
    startSpinning: function(){
        $("#btn-config").css("visibility","visible");
    },
    stopSpinning: function(){
        $("#btn-config").css("visibility","hidden");
    },
    showResult: function(){
        var idparada = 9781;
        var idlinea = 17;
        app.startSpinning();
        $("#linea-num").html("Linea "+etr.busqueda.idlinea);
        etr.cuandollega();
    },
	validarConsultar: function() {

		var idparada = parseInt($("#consultar-nroparada").val());
		var idlinea = parseInt(etr.busqueda.idlinea);
		if( isNaN(idlinea) || idlinea == 0) {
			alert("Debe seleccionar la linea");
			return;
		}	
		if( isNaN(idparada) || idparada == 0) {
			alert("Debe ingresar el nro. de parada");
			return;
		}
		etr.busqueda.idparada = idparada;
		alert(etr.busqueda.idparada);
		document.location.href = "#resultado";
	}
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

function alert(msj){
    navigator.notification.alert(msj);
}

