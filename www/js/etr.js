function _etr(){

	this.favoritos = [];

	this.baseURL = "http://www.etr.gov.ar/";

	this.busqueda = {};

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
			html +=	'<div class="fav_container">';
			html += '<div class="fav_left" onclick="etr.openFavorito(' + fav.idparada + ', \'' + fav.idlinea + '\')" style="' + style + '">';
			html +=	'<span class="fav_linea">Linea: ' + fav.linea + '</span>';
			html +=	'<span class="fav_parada">&nbsp;Parada: ' + fav.idparada + '</span>';			
			html += '</div>';
			html += '<div class="fav_right" onclick="etr.removeFavorito(' + fav.idparada + ', \'' + fav.idlinea + '\');" style="' + style +'">&nbsp;</div>';
			html += '</div>';
		}
		$("#favs_results").html(html);
	}

	this.addFavorito = function() {
		var favs = this.favoritos;
		if(favs.length == 20) {
			alert('Solo puedes tener 20 favoritos!'); 
			return;
		}

		var desc;
		var busqueda = this.busqueda;
		var idparada = busqueda.idparada;
		var idlinea  = busqueda.idlinea;
		var fav = this.hasFavorito(idparada, idlinea);
		if(fav == false) {
			navigator.notification.prompt("Por favor ingrese una descripcion", 
					function(response){
						if(response.buttonIndex == 2) {
							return;
						}

						desc = response.input1;

						etr.favoritos.push({
							'idlinea'  : busqueda.idlinea,
							'idparada' : busqueda.idparada,
							'linea'    : busqueda.linea,
							'nomcalle' : busqueda.nomcalle,
							'nominter' : busqueda.nominter,
							'descripcion': desc
						});	

						try{ 
							var strfavs = JSON.stringify(etr.favoritos); 
							app.saveValue("favoritos", strfavs); 

						}catch(e) { console.log(e); }

						$('#fav-button').val('Agregado a favoritos');

					}, 
						"Cuando llega?"
							);

		}else {
			alert("Ya se encuentra agregada esta linea y parada a favoritos");
		}
	}

	this.removeFavorito = function(idparada, idlinea) {
		var favs = etr.favoritos;
		var aux  = [];
		var len  = favs.length;
		for(var i =0; i < len; i++) {
			var fav = favs[i];
			if(fav.idparada == idparada && fav.idlinea == idlinea) {
				continue;
			}
			aux.push(fav);
		}
		etr.favoritos = aux;
		try{ 
			var strfavs = JSON.stringify(etr.favoritos); 
			app.saveValue("favoritos", strfavs);  
		}catch(e) { 
			//alert(e); 
		}
	}

	this.setFavoritos = function(favs) { 
		this.favoritos = favs == undefined ? [] : favs;
	}

	this.obtenerCalle = function() {
		var linea = $('#consultar-linea').find(":selected").val();
		var idlinea = $('#consultar-linea').find(":selected").attr("idlinea");

		$("#consultar-calle").html('<option value="0">Seleccionar calle</option>');
		$("#consultar-interseccion").html('<option value="0">Seleccionar intersecci&oacute;n</option>');
		$("#consultar-nroparada").val("");  
		$("#consultar-nrosparada").html('<option value="0">Seleccionar parada</option>');

		this.busqueda = {};	

		//$("#consultar-nrosparada").attr("disabled", "");
		var url = this.baseURL + '/getData.php?accion=getCalle&idLinea=' + encodeURI(idlinea);
		var obj = this;				
		obj.busqueda.idlinea = idlinea;
		obj.busqueda.linea = linea;

		app.startSpinning();
		$.get(url,{}, function(data){
			app.stopSpinning();
			obj.parseCalles(data);			
		},'json');
	}
	this.parseCalles = function(calles) {

		var len = calles.length;
		var html_calles = '';
		for(var i = 0; i < len; i++) {
			var calle = calles[i];
			html_calles+= '<option value="' + calle.id +'">' + calle.desc + '</option>';
		}
		$("#consultar-calle").html(html_calles);
		//$("#consultar-calle").attr("disabled", "");
		//$("#consultar-nrosparada").attr("disabled", "");
	}

	this.obtenerInter = function() {

		//	$("#inter").attr("disabled", "disabled");
		//	$("#parada").attr("disabled", "disabled");
		var idcalle = $("#consultar-calle").val();
		var nomcalle = $('#consultar-calle').find(":selected").text();

		this.busqueda.idcalle = 0;
		this.busqueda.idinter = 0;

		$("#consultar-interseccion").html('<option value="0">Seleccionar intersecci&oacute;n</option>');
		$("#consultar-nrosparada").html('<option value="0">Seleccionar parada</option>');
		$("#consultar-nroparada").val(""); 

		if(idcalle == 0) {
			return;
		}

		var obj = this;
		obj.busqueda.idcalle = idcalle;
		obj.busqueda.nomcalle = nomcalle;

		var url = this.baseURL + "/getData.php?accion=getInterseccion"
			url+= "&idLinea=" + encodeURI(obj.busqueda.idlinea) 
			url+= "&idCalle=" + encodeURI(obj.busqueda.idcalle);

		app.startSpinning();
		$.get(url, function(data){
			app.stopSpinning();
			obj.parseInter(data);			
		}, 'json');
	}

	this.parseInter = function(inters) {

		var len = inters.length;
		var html_inters = '<option value="0">Seleccionar intersecci&oacute;n</option>';
		console.log(inters);
		for(var i = 0; i < len; i++) {
			var inter = inters[i];
			html_inters+= '<option value="' + inter.id +'">' + inter.desc + '</option>';
		}
		$("#consultar-interseccion").html(html_inters);
	}

	this.obtenerParadas = function() {

		$("#consultar-nrosparada").html('<option value="0">Seleccionar parada</option>');
		$("#consultar-nroparada").val(""); 

		var idinter = $("#consultar-interseccion").val();
		var nominter = $('#consultar-interseccion').find(":selected").text();

		this.busqueda.idinter = 0;
		if(idinter == 0) {		
			return;
		}
		var obj = this;
		obj.busqueda.idinter = idinter
		obj.busqueda.nominter = nominter;

		var url = this.baseURL + "getData.php?accion=getInfoParadas"
			url+= "&idLinea=" + encodeURI(obj.busqueda.idlinea);
			url+= "&idCalle=" + encodeURI(obj.busqueda.idcalle);
			url+= "&idInt=" + encodeURI(obj.busqueda.idinter);

		console.log(url);
		app.startSpinning();
		$.get(url, function(response){
			obj.parseParadas(response);		
			app.stopSpinning();
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
		var html_paradas = '';
		for(var i = 0; i < len; i++) {
			var parada = paradas[i];
			html_paradas += '<option value="' + parada.id + '">' + parada.desc + '</option>';
		}		
		$("#consultar-nrosparada").html(html_paradas);
		$("#consultar-nroparada").val(paradas[0].id);
	}

	this.selecParada = function() {
		var idparada = $("#consultar-nrosparada").val();
		etr.busqueda.idparada = idparada;
		$("#consultar-nroparada").val(idparada);
	}

	this.cuandollega = function() {
	
		var idlinea = etr.busqueda.idlinea;
		if(idlinea.length == 0) {
			alert("Debe seleccionar la linea");
			return;
		}
		var idparada = etr.busqueda.idparada; 
		if(idparada.length == 0) {
			alert("Debe ingresar el nro. de parada");
			return;
		}

		console.log(JSON.stringify(this.busqueda));

		$("#consultar-refresh").css("visibility","hidden");

		var url = "http://www.etr.gov.ar/getSmsResponse.php";
		var params = "parada=" + idparada;
		params+= "&linea=" + this.busqueda.linea;

		var obj = this;
		app.startSpinning();
		$.post(url, params, function(response){
			app.stopSpinning();
			response = response.replace('-', '<br />');
			response = response.replace(',', '<br />');
			response = response.replace('Resultado: ', '');
			response = response.replace('Linea '+etr.busqueda.linea+":", 'Pr&oacute;ximo: ');

			$("#result-container").html(response);
			if(obj.hasFavorito(idparada, idlinea) != false) {
				$('#fav_button').val('Agregado a favoritos');			
			}else {
				$('#fav_button').val('Agregar a favoritos');
			}

			setTimeout(function(){
				$("#consultar-refresh").css("visibility","visible");
			}, 15000);
		}); 		
	}
}

var etr  = new _etr();
