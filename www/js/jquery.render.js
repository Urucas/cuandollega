/**
* @copyright Urucas
* @license   MIT License
* @version   Release: 1.0.1
* @link       http://urucas.com
* @developers Bruno Alassia, Pamela Prosperi
*/

try {

	jQuery.fn.render = function(source, data, config) {
		try {
			config = config || { append:false, prepend: false, modifiers: [], callback: undefined }
			var response;
			var el = this;

			// load html file to render  synchronously
			$.ajax({ 
				url:source, 
				data:[], 
				success:function(response){
					html = response;
				}, 
				async: false
			});

			// create replace function
			var replace = function(key, value, str, modifier) {
				var reg = new RegExp("{%"+key+"}");
				try {
					if(modifier != undefined && modifier instanceof Function) {
						value = modifier(value);
					}
				}catch(e) { console.log("jquery.render.js modifier error: "+e); }
				return str.replace(reg, value);
			}
			
			var modifiers = config.modifiers;

			// render a list of object
			if(data instanceof Array) {
				var len = data.length;
				var aux2= "";
				for(var i=0; i< len; i++) {
					var aux = html;
					var d = data[i];
					for(key in d) {
						aux = replace(key, d[key], aux, modifiers[key]);
					}
					aux2+=aux;
				}
				html = aux2;
			}
			// render a simple object
			else if(data instanceof Object) {
				var aux = html;
				for(key in data) {
					aux = replace(key, data[key], aux, modifiers[key]);
				}
				html = aux;
			}

			// html content can be render in 3 ways; 
			// * append: true, append content at the end of the container, 
			// * prepend: true, append content at the begining of the container,
			// * none will replace the content of the container
			if(config.append) { $(el).append(html);	 }
			else if(config.prepend) { $(el).prepend(html); }
			else { $(el).html(html); }

			if(config.callback != undefined && config.callback instanceof Function) {
				callback();
			}

		}catch(e) {
			console.log(e);
		}
		return this;
	}

}catch(e) {
	console.log("jQuery is not defined, make sure to include the jquery library before including JQuery render extension");
}

try {

	jQuery.fn.include = function(view, callback) {
		var el = this;
		$(el).load(view, function(){
			$(el).find("include").each(function(){
				var inc = this.getAttribute("src");
				var oel = this;
				$.ajax({
					url:inc,
					data:[],
					async:false,
					success: function(data){
						$(oel).replaceWith(data);	

					}
				});
			});
			if(callback!= undefined && callback instanceof Function) {
				callback();
			}
		});

		return this;
	}

}catch(e) {
	console.log(e);
}
