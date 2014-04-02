function _etr(){
	
	this.favoritos = [];

	this.hasFavorito = function(idparada, idlinea) {
		var favs = this.favoritos;
		var len  = favs.length;
		for(var i =0; i < len; i++) {
			var fav = favs[i];
			if(fav.idparada == idparada && fav.idlinea == idlinea) {
				return fav;
			}
		}
		return false;
	}

	this.showFavoritos = function() {
		var favs = this.favoritos;
		var len  = favs.length;		
		var html = '';
		for(var i = 0; i< len; i++) {
			var fav   = favs[i];
			var style = i == 7 ? "border-bottom:0;" : ""
			html +=	'<div class="fav_container">';
			html += '<div class="fav_left" onclick="etr.openFavorito(' + fav.idparada + ', \'' + fav.idlinea + '\')" style="' + style + '">';
			html +=	'<span class="fav_linea">Linea: ' + fav.linea + '</span>';
			html +=	'<span class="fav_parada">&nbsp;Parada: ' + fav.idparada + '</span>';			
			html += '</div>';
			html += '<div class="fav_right" onclick="etr.removeFavorito(' + fav.idparada + ', \'' + fav.idlinea + '\');" style="' + style +'">&nbsp;</div>';
			html += '</div>';
		}
		$("#favs_results").html(html);
		$("#home_container").hide();
		$("#popup").hide();
		$("#favs_container").show();
	}
	
	this.hideFavoritos = function() {
		$("#home_container").show();
		$("#favs_container").hide();
	}

	this.addFavorito = function() {
		var favs = this.favoritos;
		if(favs.length == 8) {
			alert('Solo puedes tener 8 favoritos!'); 
			return;
		}

		var busqueda = this.busqueda;
		var idparada = busqueda.idparada;
		var idlinea  = busqueda.idlinea;
		var fav = this.hasFavorito(idparada, idlinea);
		if(fav == false) {
			this.favoritos.push({
				'idlinea'  : busqueda.idlinea,
				'idparada' : busqueda.idparada,
				'linea'    : busqueda.linea
			});	

			try{ 
				var strfavs = JSON.stringify(this.favoritos); 
				extPhonegap.saveValue("favoritos", strfavs); 

			}catch(e) { 
				//alert(e); 
			}

			$('#fav_button').css('background-position-y','162%');
			$('#fav_button > span').html('Agregado a favoritos');
		}
	}

	this.removeFavorito = function(idparada, idlinea) {
		var favs = this.favoritos;
		var aux  = [];
		var len  = favs.length;
		for(var i =0; i < len; i++) {
			var fav = favs[i];
			if(fav.idparada == idparada && fav.idlinea == idlinea) {
				continue;
			}
			aux.push(fav);
		}
		this.favoritos = aux;
		try{ 
			var strfavs = JSON.stringify(this.favoritos); 
			extPhonegap.saveValue("favoritos", strfavs);  
		}catch(e) { 
			//alert(e); 
		}
		this.showFavoritos();
	}

	this.openFavorito = function(idparada, idlinea) {
		var fav = this.hasFavorito(idparada, idlinea);
		if(fav == false) {
			alert("Wops! Algo ha pasado. Intenta de nuevo!");
			return;
		}
		var url = "http://www.etr.gov.ar/getSmsResponse.php";
		var params = "parada=" + idparada;
			params+= "&linea=" + fav.linea;
		
		this.busqueda = {}
		this.busqueda.idlinea  = fav.idlinea;
		this.busqueda.linea    = fav.linea;
		this.busqueda.idparada = fav.idparada;		

		this.selecParada(idparada);

		$("#cuando_llega").html("");
		$("#preloader").show();
		var obj = this;
		$.post(url, params, function(response){
			obj.hideFavoritos();
			response = response.replace('-', '<br />');
			$("#cuando_llega").html(response);
			if(obj.hasFavorito(idparada, idlinea) != false) {
				$('#fav_button').css('background-position-y','162%');
				$('#fav_button > span').html('Agregado a favoritos');			
			}else {
				$('#fav_button').css('background-position-y','2px');
				$('#fav_button > span').html('Agregar a favoritos');
			}
			$("#popup").show();
			$("#preloader").hide();
		}); 		
	}
	this.setFavoritos = function(favs) { 
		this.favoritos = favs == undefined ? [] : favs;
	}


	this.ajax = new _ajax();
	this.version = 1;
	this.baseURL = "http://www.etr.gov.ar/";
	
	this.busqueda = {};

	this.obtenerCalle = function() {
		
        var linea = $('#linea').find(":selected").val();
        var idlinea = $('#linea').find(":selected").attr("idlinea");
		
		$("#message").html("");
		$("#calle").attr("disabled", "disabled");
		$("#inter").attr("disabled", "disabled");
		$("#parada").attr("disabled", "disabled");
		$("#idparada").attr("disabled", "disabled");
		$("#idparada").val("");
	
		this.busqueda = {};	
		if(idlinea == 0) { 
			$("#idparada").attr("disabled", "disabled");
			return;
		}

		$("#idparada").attr("disabled", "");
		var url = this.baseURL + '/getData.php?accion=getCalle&idLinea=' + encodeURI(idlinea);
		var obj = this;				
			obj.busqueda.idlinea = idlinea;
			obj.busqueda.linea = linea;

		$("#preloader").show();
		this.ajax.get(url, function(data){
			obj.parseCalles(data);			
			$("#preloader").hide();
		});
	}
	this.parseCalles = function(calles) {

		var len = calles.length;
		var html_calles = '<option value="0">Seleccionar calle</option>';
		for(var i = 0; i < len; i++) {
			var calle = calles[i];
			html_calles+= '<option value="' + calle.id +'">' + calle.desc + '</option>';
		}
		$("#calle").html(html_calles);
		$("#calle").attr("disabled", "");
		$("#idparada").attr("disabled", "");
	}

	this.obtenerInter = function(idcalle) {

		$("#message").html("");
		$("#inter").attr("disabled", "disabled");
		$("#parada").attr("disabled", "disabled");
		
		this.busqueda.idcalle = 0;
		this.busqueda.idinter = 0;
		
		if(idcalle == 0) {
			return;
		}
	
		var obj = this;
			obj.busqueda.idcalle = idcalle
		
		var url = this.baseURL + "/getData.php?accion=getInterseccion"
			url+= "&idLinea=" + encodeURI(obj.busqueda.idlinea) 
			url+= "&idCalle=" + encodeURI(obj.busqueda.idcalle);

		$("#preloader").show();
		this.ajax.get(url, function(data){
			obj.parseInter(data);			
			$("#preloader").hide();
		});
	}

	this.parseInter = function(inters) {
		
		var len = inters.length;
		var html_inters = '<option value="0">Seleccionar intersecci&oacute;n</option>';
		for(var i = 0; i < len; i++) {
			var inter = inters[i];
			html_inters+= '<option value="' + inter.id +'">' + inter.desc + '</option>';
		}
		$("#inter").html(html_inters);
		$("#inter").attr("disabled", "");
	}

	this.obtenerParadas = function(idinter) {

		$("#message").html("");
		this.busqueda.idinter = 0;
		if(idinter == 0) {		
			return;
		}
		var obj = this;
			obj.busqueda.idinter = idinter
	
		var url = this.baseURL + "getData.php?accion=getInfoParadas"
			url+= "&idLinea=" + encodeURI(obj.busqueda.idlinea);
			url+= "&idCalle=" + encodeURI(obj.busqueda.idcalle);
			url+= "&idInt=" + encodeURI(obj.busqueda.idinter);
		
		$("#preloader").show();
		this.ajax.getText(url, function(response){
			obj.parseParadas(response);			
			$("#preloader").hide();
		});
	}

	this.parseParadas = function(html_paradas) {

		var aux = document.createElement("div");
			aux.innerHTML = html_paradas;
		
		var trs = aux.getElementsByTagName('tr');
		var len = trs.length;
		var paradas = [];
		for(var i = 0; i < len; i++) {
			var tr = trs[i];
			if(tr.getElementsByTagName('th').length != 0) continue;
			
			var tds = tr.getElementsByTagName('td');
			try { var td_id = tds[0].firstChild.firstChild.nodeValue; } 
			catch(e) { continue; }
		
			try { var td_desc = tds[1].firstChild.nodeValue; } 
			catch(e) { continue; }
			
			paradas.push({id : td_id, desc: td_desc});
		}
		var len = paradas.length;
		var html_paradas = "";
		for(var i = 0; i < len; i++) {
			var parada = paradas[i];
			html_paradas += '<option value="' + parada.id + '">' + parada.desc + '</option>';
		}		
		$("#parada").html(html_paradas);
		$("#parada").attr("disabled", "");
		$("#idparada").val(paradas[0].id);
		$("#idparada").attr("disabled", "");
	}

	this.selecParada = function(idparada) {
		$("#idparada").val(idparada);
	}

	this.cuandollega = function() {
		$("#message").html("");
		var idlinea = parseInt(this.busqueda.idlinea);
		if( isNaN(idlinea) || idlinea == 0) {
			$("#message").html("Debe seleccionar la linea");
			return;
		}	
		var idparada = parseInt($("#idparada").val()); 
		if( isNaN(idparada) || idparada == 0) {
			$("#message").html("Debe ingresa el nro. de parada");
			return;
		}

		this.busqueda.idparada = idparada;
		//console.log(this.busqueda);

		var url = "http://www.etr.gov.ar/getSmsResponse.php";
		var params = "parada=" + idparada;
			params+= "&linea=" + this.busqueda.linea;

		$("#cuando_llega").html("");
		$("#preloader").show();
		var obj = this;
		$.post(url, params, function(response){
			response = response.replace('-', '<br />');
			$("#cuando_llega").html(response);
			if(obj.hasFavorito(idparada, idlinea) != false) {
				$('#fav_button').css('background-position-y','162%');
				$('#fav_button > span').html('Agregado a favoritos');			
			}else {
				$('#fav_button').css('background-position-y','2px');
				$('#fav_button > span').html('Agregar a favoritos');
			}

			$("#popup").show();
			$("#preloader").hide();
		}); 		
	}
}

var etr  = new _etr();
var view = new _view();

function onDeviceReady() { 

	try { 
        console.log("deviceready");
		var favs = JSON.parse(extPhonegap.getValue("favoritos")); 
        console.log(favs);
		etr.setFavoritos(favs);		
	} catch(e) { 
	}	
	Home.load(); 
}



function onLoad() {	
	try { document.addEventListener("deviceready", onDeviceReady, true); }catch(e) { alert(e); }	
}

