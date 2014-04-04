var map;
var app = {

    modules: [
        { id: "consultar", view: "views/consultar.html", callback: function(){ app.loadBusqueda(); }},
        { id: "favoritos", view: "views/favoritos.html", callback: function(){ app.getFavs();}},
        { id: "configuracion", view: "views/configuracion.html"},
        { id: "recorridos", view: "views/recorridos.html", callback: function() { app.prepareRecorridos() }},
        { id: "resultado", view: "views/resultado.html", callback: function() { app.showResult(); } },
        { id: "noticias", view: "views/noticias.html", callback: function() { app.showNoticias(); } },
        { id: "recargas", view: "views/puntos-recarga.html", callback: function() { app.loadRecargas(); } },
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
        try { navigator.splashscreen.hide(); }catch(e){ console.log(e); }
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
    },
    getFavs: function(){
        if(etr.favoritos.length == 0) {
            var favs = this.getValue("favoritos");
            if(favs == null){
                favs = [];
            }
            etr.favoritos = JSON.parse(favs);
        }
        try{
            $("#favoritos-list").render("views/favorito-list-item.html", etr.favoritos);
        }catch(e){console.log(e)}
    },
    deleteFavorito: function(idlinea,idparada){
        etr.removeFavorito(idparada, idlinea);
        document.location.href="#favoritos";
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

        transformProjection()

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-32.944365, -60.650725),
            new google.maps.LatLng(-32.969365, -60.640725)
        );
        //map.setCenter(new google.maps.LatLng(position));
        map.fitBounds(defaultBounds);

        var marker = new google.maps.Marker({
              position: position,
              map: map,
              title: 'Hello World!'
          });

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
                linea:120,
                tipo :"Urbano"
            }), 
            success: function( data ) {
                app.stopSpinning();
                var ida = data.geoJsonIda;
                try { 
                    var recorrido = data;
                    var geojson_format = new OpenLayers.Format.GeoJSON(); 
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
    transformProjection(projection){
        var toProjection    = new OpenLayers.Projection("EPSG:4326");   // google projections
        var fromProjection  = new OpenLayers.Projection("EPSG:22185"); // fuckin' argentine projections
        var position        = new OpenLayers.LonLat(projection).transform( fromProjection, toProjection);

        position = new google.maps.LatLng(position.lat, position.lon)

        return position;
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
    console.log(navigator.notification);
    try {
        navigator.notification.alert(msj, function(){},"Cuando Llega?");
    }catch(e) {
        console.log(e);
    }
}


