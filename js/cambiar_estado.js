import { formatoFecha } from "./extras.js";

const form_cambio_estado = document.getElementById("form_cambio_estado");
const ID_TRAMITE = localStorage.getItem("id_tramite");
const TRAMITES = localStorage.getItem("tramites");
let lista_tramites = JSON.parse(TRAMITES);
let tb_cambio_estado = document.getElementById("tb_cambio_estado");

window.addEventListener("load", (e) => {
	e.preventDefault();

	lista_tramites.forEach((tramite) => {
		if (tramite.id == ID_TRAMITE) {
			tb_cambio_estado.innerHTML = `
            <tr>
					<td>${tramite.id}</td>
					<td>${tramite.nombre} ${tramite.apellido}</td>
					<td>${tramite.fecha_actualizacion}</td>
					<td>${tramite.estado}</td>
				</tr>
         `;
		}
	});
});

form_cambio_estado.addEventListener("submit", (e) => {
	e.preventDefault();
	const DATA = Object.fromEntries(new FormData(e.target));

	lista_tramites.forEach((tramite) => {
		if (tramite.id == ID_TRAMITE) {
			tramite.fecha_actualizacion = formatoFecha();
			tramite.estado = DATA.estado;
			tramite.motivo_actualizacion = DATA.motivo_actualizacion;
			tramite.descripcion_actualizacion = DATA.descripcion_actualizacion;
		}
	});
	localStorage.setItem("tramites", JSON.stringify(lista_tramites));

	location.href = "/index.html";
});
