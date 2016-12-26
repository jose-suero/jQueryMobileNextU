var listHoteles = [];
var marker = null;

function cambiarPagina(page){
	$.mobile.changePage("#"+page, {
		transition: "none"
	});
}

function reconstruirTabla(){
	var ulHotels = $("#ulHotels");
	$(".lihotel").remove();
	
	$(listHoteles).each(function(i,e){
		var li = $("<li>").addClass("lihotel");
		var a = $("<a>").text(e.nombre).data("hotel", e).click(function(){
			verHotel($(this).data("hotel"));
		});
		li.append(a);
		ulHotels.append(li);
	});
}

function limpiarCamposRegistro() {
		$("#txtNombre").val("");
		$("#txtCiudad").val("");
		$("#txtTelefono").val("");
		$("#txtEstrellas").val("");
}

function agregarMarcador(e) {
	if (marker) {
		marker.setMap(null);
		marker = null;
	}	
	
	marker = new google.maps.Marker({
		position: e.latLng,
		map: this,
		draggable: true,
		title: $("#txtNombre").val() == "" ? "Ubicación Hotel" : $("#txtNombre").val()
	});
}

$(document).ready(function () {
	//Cargar hoteles desde el localStorage
	if (typeof(Storage) !== "undefined") {
		var lstHoteles = localStorage.lstHoteles;
		if (lstHoteles && lstHoteles.length > 0) {
			listHoteles = $.parseJSON(lstHoteles);
			reconstruirTabla(false);
		}
	}
	
	$("#page2").on("pageshow", function (event, ui) {		
		//18.4769326,-69.9449253 Coordenadas del JW Marriot en Santo Domingo
		var LatLng = new google.maps.LatLng(18.4730457,-69.941293); 
		var opciones = {            
				zoom: 10,
				center: LatLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP        
		};
		var mapa = new google.maps.Map(document.getElementById("dvMap"), opciones);
		mapa.addListener('click', agregarMarcador);
		$("#txtNombre").focus();
	});
	
	$("#pgHotel").on("pageshow", function (event, ui) {		
		debugger;
		var hotel = $("#dvMap2").data("hotel");
		var LatLng = new google.maps.LatLng(hotel.ubicacion.lat,hotel.ubicacion.long); 
		var opciones = {            
				zoom: 15,
				center: LatLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP        
		};
		var mapa = new google.maps.Map(document.getElementById("dvMap2"), opciones);
			
		var myMarker = new google.maps.Marker({
			position: LatLng,
			map: mapa,
			title: hotel.nombre
		});
		
	});

	$("#btnRegistrar").click(function () {
		limpiarCamposRegistro();	
		
		cambiarPagina("page2");
	});

	$("#btnCrear").click(function() {
		if (!(document.getElementById("txtNombre").checkValidity()&&document.getElementById("txtCiudad").checkValidity()&&document.getElementById("txtEstrellas").checkValidity())) {
			alert('Verifique los datos suministrados.');
			return;
		}
		
		var nombre = $("#txtNombre").val();
		var ubicacion = {lat: null, "long": null};
		if (marker) {
			var ubicacion = {lat: marker.getPosition().lat(), "long": marker.getPosition().lng()};			
		}
		var ciudad = $("#txtCiudad").val();
		var telefono = $("#txtTelefono").val();
		var estrellas = $("#txtEstrellas").val();

		var hotel = {
			nombre: nombre,
			ubicacion: ubicacion,
			ciudad: ciudad,
			telefono: telefono,
			estrellas: estrellas,
		};

		if (listHoteles === undefined) listHoteles = [];
		listHoteles.push(hotel);
		if (typeof(Storage) !== "undefined") {
			//Guardo lista de hoteles
			localStorage.lstHoteles = JSON.stringify(listHoteles);
	    }
		
		limpiarCamposRegistro();
	    reconstruirTabla(false);
	    verHotel(hotel);
	});
});

function verHotel(hotel) {
	$("#lblNombre").text(hotel.nombre);
	$("#lblCiudad").text(hotel.ciudad);
	$("#lblTelefono").text(hotel.telefono);
	$("#lblEstrellas").text(hotel.estrellas);
	$("#dvMap2").data("hotel", hotel);

	cambiarPagina("pgHotel");
}