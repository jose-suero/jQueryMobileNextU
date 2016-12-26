var listHoteles = [];

function cambiarPagina(page){
	$.mobile.changePage("#"+page, {
		transition: "none"
	});
}

function reconstruirTabla(){

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

	$("#btnRegistrar").click(function () {
		//18.4769326,-69.9449253 Coordenadas del JW Marriot en Santo Domingo
		var LatLng = new google.maps.LatLng(18.4730457,-69.941293); 
		var opciones = {            
			zoom: 20,
			center: LatLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP        
		};
		var mapa = new google.maps.Map(document.getElementById("dvMap"), opciones);
		cambiarPagina("page2");
	});

	$("#btnCrear").click(function() {
		var nombre = $("#txtNombre").val();;
		var ubicacion = "";
		var ciudad = $("#txtCiudad").val();
		var telefono = $("#txtTelefono").val();;
		var estrellas = $("#txtEstrellas").val();;

		var hotel = {
			nombre: nombre,
			ubicacion: ubicacion,
			ciudad: ciudad,
			telefono: telefono,
			estrellas: estrellas
		};

		if (listHoteles === undefined) listHoteles = [];
		listHoteles.push(hotel);
		if (typeof(Storage) !== "undefined") {
			//Guardo lista de hoteles
			localStorage.lstHoteles = JSON.stringify(listHoteles);
	    }

	    reconstruirTabla(false);
	    verHotel(hotel);
	});
});

function verHotel(hotel) {
	$("#lblNombre").text(hotel.nombre);
	$("#lblCiudad").text(hotel.ciudad);
	$("#lblTelefono").text(hotel.telefono);
	$("#lblEstrellas").text(hotel.estrellas);

	cambiarPagina("pgHotel");
}