var map, idaLine, vueltaLine;
var app = {

    modules: [
        { id: "consultar", view: "views/consultar.html", callback: function(){ app.loadBusqueda(); }},
        { id: "favoritos", view: "views/favoritos.html", callback: function(){ app.getFavs();}},
        { id: "configuracion", view: "views/configuracion.html"},
        { id: "recorridos", view: "views/recorridos.html", callback: function() { app.prepareRecorridos() }},
        { id: "resultado", view: "views/resultado.html", callback: function() { app.showResult(); } },
        { id: "noticias", view: "views/noticias.html", callback: function() { app.showNoticias(); } },
        { id: "recargas", view: "views/puntos-recarga.html", callback: function() { app.loadRecargas(); } },
        { id: "comollego", view: "views/comollego.html", callback: function() { app.loadComoLlego(); }  },
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
                $(".menu-option > div").removeClass().addClass("btn-izq");
                $("#"+view_id).addClass("btn-izq-selected");
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
                        "https://play.google.com/store/apps/details?id=com.cuandollegaandroid"
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
        try { navigator.splashscreen.hide(); }catch(e){ console.log(e); }
        // important event to autolod the modules and views
        window.onhashchange = function() {
            var hash = window.location.hash;
            hash = hash.replace("#","");
            app.load(hash);
        }
        try{ app.uuid = device.uuid; }catch(e){ console.log("cant get device uuid"+e.message); }

		/*
		try {
					var fileref=document.createElement('script')
						fileref.setAttribute("type","text/javascript")
						fileref.setAttribute("src", "js/iscroll.js");
						fileref.onload = function() {
						menuScroll = new IScroll(document.getElementById("wrapper-menu"));
						// containerScroll = new iScroll("container", {});
						// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
					}
					document.getElementsByTagName("head")[0].appendChild(fileref);

		}catch(e){}
*/
		/*
        try {
            admobCode = (device.platform=="Android") ? "ca-app-pub-7488172185490417/1616483686" : "ca-app-pub-7488172185490417/7015922082";
            admob.createBannerView(
                {'publisherId': admobCode, 'adSize': admob.AD_SIZE.BANNER}, 
                function(){
                    app.adCreateBannerVewSuccess();
                }, function(){
                });

        }catch(e) { }
		*/
        document.addEventListener("menubutton", function(){
            toggle('menu');
        }, false);

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

        if(etr.busqueda.linea == undefined){
            alert("Todavía no has consultado ninguna línea");
            window.location.href = "#consultar";
        }
        $("#linea-num").html("Linea "+etr.busqueda.linea);
        if(etr.busqueda.nomcalle != undefined && etr.busqueda.nominter != undefined) {
            $("#linea-num").append('<br /><span class="linea-addr">'+etr.busqueda.nomcalle+' - '+etr.busqueda.nominter+'</span>');
        }
        etr.cuandollega();
    },
    validarConsultar: function() {

        var idparada = $("#consultar-nroparada").val();
        var idlinea = etr.busqueda.idlinea;
        if( idlinea.length == 0) {
            alert("Debe seleccionar la linea");
            return;
        }	
        if( idparada.length == 0) {
            alert("Debe ingresar el nro. de parada");
            return;
        }
        etr.busqueda.idparada = idparada;
        document.location.href = "#resultado";
    },
    loadBusqueda: function() {

        var busqueda = etr.busqueda;
        if(busqueda.linea.length) {
            $("#consultar-linea").val(busqueda.linea);
            etr.obtenerCalle();
        }
        if(busqueda.idparada.length) {
            $("#consultar-nroparada").val(busqueda.idparada);
        }

		$("#consultar-nroparada").enterKey(function(){
			app.validarConsultar();
		});
    },
	loadComoLlego: function() {
	
		$("#calle-search").enterKey(function(val){
			$("#inter-select").html('<option value="0">Seleccionar interseccion</option>');
			app.searchCalle(val, function(data) {
				if(data.length) {
					var html = '';
					for(var i = 0; i< data.length; i++) {
						html += '<option value="'+data[i].id+'">'+data[i].nombre+'</option>';
					}
					$("#calle-select").html(html);
				}else{
					alert("No se encontraron resultados");
				}

			});
		});
		$("#inter-search").enterKey(function(val){
			app.searchCalle(val, function(data) {
				if(data.length) {
					var html = '';
					for(var i = 0; i< data.length; i++) {
						html += '<option value="'+data[i].id+'">'+data[i].nombre+'</option>';
					}
					$("#inter-select").html(html);
				}else{
					alert("No se encontraron resultados");
				}
			});
		});

		$("#dest-calle-search").enterKey(function(val){
			$("#dest-inter-select").html('<option value="0">Seleccionar interseccion</option>');
			app.searchCalle(val, function(data) {
				if(data.length) {
					var html = '';
					for(var i = 0; i< data.length; i++) {
						html += '<option value="'+data[i].id+'">'+data[i].nombre+'</option>';
					}
					$("#dest-calle-select").html(html);
				}else{
					alert("No se encontraron resultados");
				}

			});
		});

		$("#dest-inter-search").enterKey(function(val){
			app.searchCalle(val, function(data) {
				if(data.length) {
					var html = '';
					for(var i = 0; i< data.length; i++) {
						html += '<option value="'+data[i].id+'">'+data[i].nombre+'</option>';
					}
					$("#dest-inter-select").html(html);
				}else{
					alert("No se encontraron resultados");
				}
			});
		});
		
		app.showTabComoLlego("origen");
	},
	showTabComoLlego: function(id) {
	
		$(".ui-tab").hide();
		$(".ui-tabs").find("a").removeClass("active");

		$(".comollego-"+id+'-a').addClass("active");
		$(".comollego-"+id).show();
	},
	searchCalle: function(term, callback) {
		
		app.startSpinning();
		$.ajax({
            type : 'GET',
            url: "http://infomapa.rosario.gov.ar/emapa/direccion/autocomplete.htm",
            dataType: "json",
            data : {
                term:term,
            }, 
            success: function(data) {
				app.stopSpinning();
				callback(data);
			}
		});

	},
	comollego: function() {
		
		var origen = {
			calle: jQuery.trim($('#calle-select').find(":selected").text()),
			codigoCalle: $("#calle-select").val(),
			interseccion: jQuery.trim($('#inter-select').find(":selected").text()),
			condigoInterseccion: $("#inter-select").val()
		};
		var destino = {
			calle: jQuery.trim($('#dest-calle-select').find(":selected").text()),
			codigoCalle: $("#dest-calle-select").val(),
			interseccion: jQuery.trim($('#dest-inter-select').find(":selected").text()),
			condigoInterseccion: $("#dest-inter-select").val()
		};
		var cantCuadras = $("#cant-cuadras-select").val();
		var comoLlego = {
			origen: origen,
			destino: destino,
			cantCuadras: cantCuadras
		}
		app.startSpinning();
		try {
			$.ajax({
				type : 'POST',
				url : 'http://infomapa.rosario.gov.ar/emapa/tup/comoLLego/invertirBusqueda.htm',
				dataType : 'json',  
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(comoLlego),
				success : function(data) {
					console.log("bien");
					console.log(data);              
				},
				error : function() {
					console.log("No se pudo obtener resultados");
				}
			});
		}catch(e) {
			console.log(e);
		}
	},
    getFavs: function(){
		if(etr.favoritos != undefined && etr.favoritos.length == 0) {
			var favs = this.getValue("favoritos");
			try{
				if(!favs){
					favs = [];
				}else {
					favs =  JSON.parse(favs);
				}
				etr.favoritos = favs;
			}catch(e) {  
				etr.favoritos = [];
			}
		}else {
			$("#favoritos-list").html("No has agregado ningun favorito a tu lista!");
		}
		if(etr.favoritos.length) {
			$("#favoritos-list").render("views/favorito-list-item.html", etr.favoritos);
		}else{
			$("#favoritos-list").html("<p>No has agregado ningun favorito a tu lista!</p>");
		}
	},
    deleteFavorito: function(idlinea,idparada){
		if(confirm("Esta seguro que desea eliminar este favorito ?")) {
	        etr.removeFavorito(idparada, idlinea);
			app.getFavs();
    	}
    },
    openFavorito: function(idlinea,idparada, linea){
        etr.busqueda.linea = linea;
        etr.busqueda.idparada = idparada;
        etr.busqueda.idlinea = idlinea;
        document.location.href="#resultado";
    },
    showNoticias: function(){
        app.startSpinning();
        var tipo = $("#tipo").val();
        $.get("http://www.etr.gov.ar/cont-noticias_vigentes2.php",{tipo:tipo},function(response){
            app.stopSpinning();
            try{
                var html = $.parseHTML(response);
                $("#contenido-noticias1").html(html);
                var table = $("#contenido-noticias1").find("table").html();
                $("#contenido-noticias1").html("");
                $("#contenido-noticias").html("<table>"+table+"</table>");
                $("#contenido-noticias").find("img").each(function(el){
                    var src = this.getAttribute("src");
                    src = "http://www.etr.gov.ar/"+src;
                    this.setAttribute("src",src);
                })

            }catch(e){
                $("#contenido-noticias").html("<p>No se han podido obtener las noticias</p>");
            }
        })
    },
    saveValue: function(name, value) {
        try { window.localStorage.setItem(name, value); }catch(e) {};
    },
    getValue: function(name) {
        try { return window.localStorage.getItem(name); }catch(e) {};
    },
    clearValues: function() {
        try { window.localStorage.clear();} catch(e) {};
    },
    prepareRecorridos: function() {

        var w = $("#recorrido-canvas").width();
        $("#map-canvas").css("width", w+"px").css("height",w+"px");

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-32.944365, -60.650725),
            new google.maps.LatLng(-32.969365, -60.640725)
        );
        //map.setCenter(new google.maps.LatLng(position));
        map.fitBounds(defaultBounds);

    },
    loadRecorrido: function() {

        var linea = $("#recorrido-linea").val();
        if(linea == 0) return;

        app.startSpinning(); 
        $.ajax({
            type : 'POST',
            url: "http://infomapa.rosario.gov.ar/emapa/tup/TransporteUrbano/buscarLinea.htm",
            dataType: "json",
            contentType : "application/json; charset=utf-8",
            data : JSON.stringify({
                linea:linea,
                tipo :"Urbano"
            }), 
            success: function( data ) {
                app.stopSpinning();
                try { 
                    var ida = data.geoJsonIda;
                    var vuelta = data.geoJsonVuelta;
                    ida = JSON.parse(ida)
                    vuelta = JSON.parse(vuelta)
                    newida = app.transformProjections(ida.coordinates[0]);
                    newvuelta = app.transformProjections(vuelta.coordinates[0]);
                    try{
                    idaLine.setMap(null);
                    vueltaLine.setMap(null);
                    }catch(e){}
                    idaLine = new google.maps.Polyline({
                        path: newida,
                        geodesic: true,
                        strokeColor: '#69b9de',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    vueltaLine = new google.maps.Polyline({
                        path: newvuelta,
                        geodesic: true,
                        strokeColor: '#adb0b1',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    idaLine.setMap(map);
                    vueltaLine.setMap(map);
                }catch(e) {
                    console.log(e);
                }
            }, error: function(e) {
                app.stopSpinning();
                alert("Ha ocurrido un error al intentar obtener el recorrido!");
            }
        });
    },
    loadRecargas: function() {

        var w = $("#puntos-recargas").width();
        $("#map-canvas").css("width", w+"px").css("height",w+"px");

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-32.944365, -60.650725),
            new google.maps.LatLng(-32.969365, -60.640725)
        );

        map.fitBounds(defaultBounds);

        var ctaLayer = new google.maps.KmlLayer('http://www.etr.gov.ar/etrkml/tsc/zonas.kml');
        ctaLayer.setMap(map);
    },
    getGeoPosition: function() {

        app.startSpinning();
        navigator.geolocation.getCurrentPosition(function(latLng){
            app.stopSpinning();
            var myLatLng = new google.maps.LatLng(latLng.coords.latitude, latLng.coords.longitude); 

            map.panTo(myLatLng);
            map.setZoom(15);

        }, function(error){
            app.stopSpinning();
            alert("Ocurrio un error al intentar obtener tu posicion!");

        },{timeout: 6000, enableHighAccuracy: false, maximumAge: 0, allowHighAccuracy: true }
                                                );
    },
    transformProjections: function(projections){
        var toProjection    = new OpenLayers.Projection("EPSG:4326");   // google projections
        var fromProjection  = new OpenLayers.Projection("EPSG:22185"); // fuckin' argentine projections

        var newpos = [];

        for(var i=0;i<projections.length;i++){
            var projection = projections[i];
            var gposition = new OpenLayers.LonLat(projection[0],projection[1]).transform( fromProjection, toProjection);
            gposition = new google.maps.LatLng(gposition.lat, gposition.lon);
            newpos.push(gposition);
        }
        return newpos;
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

function alert(msj){
	try {
		navigator.notification.alert(msj, function(){},"Cuando Llega?");
	}catch(e) {
		console.log(e);
	}
}


