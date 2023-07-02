import { apiTiempo, ver_mapa } from "../../../js/extras.js";
import { validacionBlur } from "../../../js/validaciones.js";

let body_home = document.getElementById("body_home");
let bloque_tabla = document.getElementById("bloque_tabla");
let tabla = document.getElementById("tabla");
let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");

// const URL = "http://gbazzani.pythonanywhere.com/";
const URL = "http://127.0.0.1:5000/";

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();

	fetch(URL + "estados_tramite")
		.then((response) => response.json())
		.then((response) => {
			if (response.length === 0) {
				bloque_tabla.innerHTML =
					"<div class='sin_tramites'><span class='msj_sin_tramites'>No hay estados de trámites<span></div>";
			} else {
				if (body_home) {
					response.forEach((estado) => {
						btnSegunEstado(estado);
						body_home.innerHTML =
							body_home.innerHTML +
							`
						<tr>
							<td>${estado.estado}</td>
							<td>${estado.descripcion}</td>
							<td class="icon_acciones" id="tramite${estado.estado_id}">` +
							btnSegunEstado(estado) +
							`</td>
						</tr>
					`;
					});
					tabla.insertAdjacentElement("beforeend", body_home);
					tabla.classList.remove("oculto");
					window.eliminar = eliminar;
					window.editar = editar;
				}
			}
		});
});

const btnSegunEstado = (estado) => {
	let btn = "";

	btn = `
			<button class="btn_icon" onclick='editar(${estado.estado_id})'>
				<box-icon
					name="edit-alt"
					color="green"
					title="Editar"
				></box-icon>
			</button>
			<button class="btn_icon" onclick='eliminar(${estado.estado_id})'>
				<box-icon
					type="solid"
					name="trash"
					color="red"
					title="Eliminar"
				></box-icon>
			</button>
			`;
	return btn;
};

const eliminar = (estado_id) => {
	Swal.fire({
		title: "Eliminar tipo de trámite?",
		icon: "question",
		showConfirmButton: true,
		confirmButtonColor: "#379237",
		confirmButtonText: "Confirmar",
		showCancelButton: true,
		cancelButtonColor: "#FF1E1E",
		cancelButtonText: `Cancelar`,
	}).then((result) => {
		if (result.isConfirmed) {
			fetch(URL + `estados_tramite/eliminar/${estado_id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					estado_id: estado_id,
				}),
			})
				.then((response) => response.json())
				.then((response) => {
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
							title: `${response.message}`,
						});
					}
				});
		}
	});
};

const editar = (estado_id) => {
	localStorage.setItem("estado_id", estado_id);
	location.href = "/pages/estados_tramites/edit_estado.html";
};

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
