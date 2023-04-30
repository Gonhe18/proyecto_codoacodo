const ID_TRAMITE = localStorage.getItem("id_tramite");
const TRAMITES = localStorage.getItem("tramites");
let lista_tramites = JSON.parse(TRAMITES);
let DATOS = "";
let form = document.getElementById("form_cambio_estado");
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
