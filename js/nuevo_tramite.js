//CREAR NUEVO TRÁMITE
let form_nuevo = document.getElementById("form_nuevo");

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();

	const array_tramites = [];
	const tramites = localStorage.getItem("tramites");
	const FECHA = new Date(Date.now());
	const HOY = FECHA.toLocaleDateString();

	let id_tramite = tramites != null ? JSON.parse(tramites).slice(-1) : 1;

	const DATA = Object.fromEntries(new FormData(e.target));
	DATA.fecha_actualizacion = HOY;
	DATA.estado = "Pendiente";

	if (tramites == null) {
		DATA.id = id_tramite;
		array_tramites.push(DATA);
		localStorage.setItem("tramites", JSON.stringify(array_tramites));
	} else {
		let nuevo_campo = JSON.parse(tramites);
		DATA.id = id_tramite[0].id + 1;
		nuevo_campo.push(DATA);
		localStorage.setItem("tramites", JSON.stringify(nuevo_campo));
	}
	location.href = "/index.html";
});
