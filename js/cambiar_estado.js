import { formatoFecha, apiTiempo, ver_mapa } from "./extras.js";
import { validacionBlur } from "./validaciones.js";
let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");

const form_cambio_estado = document.getElementById("form_cambio_estado");
const ID_TRAMITE = localStorage.getItem("id_tramite");
const TRAMITES = localStorage.getItem("tramites");
let lista_tramites = JSON.parse(TRAMITES);
let tb_cambio_estado = document.getElementById("tb_cambio_estado");

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();
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

	if (validacionBlur(DATA)) {
		Swal.fire({
			title: "Cambiar de estado?",
			icon: "question",
			showConfirmButton: true,
			confirmButtonColor: "#379237",
			confirmButtonText: "Confirmar",
			showCancelButton: true,
			cancelButtonColor: "#FF1E1E",
			cancelButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				const Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener("mouseenter", Swal.stopTimer);
						toast.addEventListener("mouseleave", Swal.resumeTimer);
					},
				});
				Toast.fire({
					icon: "success",
					title: "Trámite actualizado exitosamente",
				});

				lista_tramites.forEach((tramite) => {
					if (tramite.id == ID_TRAMITE) {
						tramite.fecha_actualizacion = formatoFecha();
						tramite.estado = DATA.estado;
						tramite.motivo = DATA.motivo;
						tramite.descripcion = DATA.descripcion;
					}
				});
				localStorage.setItem("tramites", JSON.stringify(lista_tramites));

				setTimeout(() => {
					location.href = "/index.html";
				}, 1200);
			}
		});
	}
});
mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
