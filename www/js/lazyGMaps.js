function lazyGMaps(callback){
	
	if(window.google != undefined && google.maps != undefined){
		callback();
		return;
	}

	window.google = window.google || {};
	google.maps = google.maps || {};


	(function() {

		function getScript(src) {
			var script = document.createElement("script");
				script.setAttribute("src", src);
				document.head.appendChild(script);
				script.onload = function(){
					if(callback!=undefined) {
						callback();
					}
				}
		}

		var modules = google.maps.modules = {};
		google.maps.__gjsload__ = function(name, text) {
			modules[name] = text;
		};

		google.maps.Load = function(apiLoad) {
			delete google.maps.Load;
			apiLoad([0.009999999776482582,[[["https://mts0.googleapis.com/vt?lyrs=m@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.googleapis.com/vt?lyrs=m@259000000\u0026src=api\u0026hl=en-US\u0026"],null,null,null,null,"m@259000000",["https://mts0.google.com/vt?lyrs=m@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.google.com/vt?lyrs=m@259000000\u0026src=api\u0026hl=en-US\u0026"]],[["https://khms0.googleapis.com/kh?v=148\u0026hl=en-US\u0026","https://khms1.googleapis.com/kh?v=148\u0026hl=en-US\u0026"],null,null,null,1,"148",["https://khms0.google.com/kh?v=148\u0026hl=en-US\u0026","https://khms1.google.com/kh?v=148\u0026hl=en-US\u0026"]],[["https://mts0.googleapis.com/vt?lyrs=h@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.googleapis.com/vt?lyrs=h@259000000\u0026src=api\u0026hl=en-US\u0026"],null,null,null,null,"h@259000000",["https://mts0.google.com/vt?lyrs=h@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.google.com/vt?lyrs=h@259000000\u0026src=api\u0026hl=en-US\u0026"]],[["https://mts0.googleapis.com/vt?lyrs=t@132,r@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.googleapis.com/vt?lyrs=t@132,r@259000000\u0026src=api\u0026hl=en-US\u0026"],null,null,null,null,"t@132,r@259000000",["https://mts0.google.com/vt?lyrs=t@132,r@259000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.google.com/vt?lyrs=t@132,r@259000000\u0026src=api\u0026hl=en-US\u0026"]],null,null,[["https://cbks0.googleapis.com/cbk?","https://cbks1.googleapis.com/cbk?"]],[["https://khms0.googleapis.com/kh?v=84\u0026hl=en-US\u0026","https://khms1.googleapis.com/kh?v=84\u0026hl=en-US\u0026"],null,null,null,null,"84",["https://khms0.google.com/kh?v=84\u0026hl=en-US\u0026","https://khms1.google.com/kh?v=84\u0026hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=en-US\u0026","https://mts1.googleapis.com/mapslt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/ft?hl=en-US\u0026"]],[["https://mts0.googleapis.com/vt?hl=en-US\u0026","https://mts1.googleapis.com/vt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/loom?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=en-US\u0026","https://mts1.googleapis.com/mapslt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/ft?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/loom?hl=en-US\u0026"]]],["en-US","US",null,0,null,null,"https://maps.gstatic.com/mapfiles/","https://csi.gstatic.com","https://maps.googleapis.com","https://maps.googleapis.com"],["https://maps.gstatic.com/intl/en_us/mapfiles/api-3/16/7","3.16.7"],[3123554468],1,null,null,null,null,0,"",["places"],null,1,"https://khms.googleapis.com/mz?v=148\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"https://mts.googleapis.com/vt/icon",[["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],[null,[[0,"m",259000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[47],[37,[["smartmaps"]]]]],0],[null,[[0,"m",259000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[47],[37,[["smartmaps"]]]]],3],[null,[[0,"m",259000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[50],[37,[["smartmaps"]]]]],0],[null,[[0,"m",259000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[50],[37,[["smartmaps"]]]]],3],[null,[[4,"t",132],[0,"r",132000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[5],[37,[["smartmaps"]]]]],0],[null,[[4,"t",132],[0,"r",132000000]],[null,"en-US","US",null,18,null,null,null,null,null,null,[[5],[37,[["smartmaps"]]]]],3],[null,null,[null,"en-US","US",null,18],0],[null,null,[null,"en-US","US",null,18],3],[null,null,[null,"en-US","US",null,18],6],[null,null,[null,"en-US","US",null,18],0],["https://mts0.google.com/vt","https://mts1.google.com/vt"],"/maps/vt"],2,500,["https://geo0.ggpht.com/cbk?cb_client=maps_sv.uv_api_demo","https://www.gstatic.com/landmark/tour","https://www.gstatic.com/landmark/config","/maps/preview/reveal?authuser=0","/maps/preview/log204","/gen204?tbm=map","https://static.panoramio.com.storage.googleapis.com/photos/"]], loadScriptTime);
		};
		var loadScriptTime = (new Date).getTime();
		getScript("https://maps.gstatic.com/cat_js/intl/en_us/mapfiles/api-3/16/7/%7Bmain,places%7D.js");
	})();
}
