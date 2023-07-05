import { apiTiempo, ver_mapa } from "../../../js/extras.js";
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

	fetch(URL + "tramites")
		.then((response) => response.json())
		.then((response) => {
			if (response.length === 0) {
				bloque_tabla.innerHTML =
					"<div class='sin_tramites'><span class='msj_sin_tramites'>No hay trámites<span></div>";
			} else {
				if (body_home) {
					response.forEach((tramite) => {
						btnSegunEstado(tramite);
						let prop = JSON.parse(tramite.propiedades);

						body_home.innerHTML =
							body_home.innerHTML +
							`
						<tr>
							<td>${tramite.tramite_id}</td>
							<td>${tramite.tipo}</td>
							<td>${tramite.puesto}</td>
							<td>${tramite.estado}</td>
							<td class="icon_acciones" id="tramite${tramite.tipo_id}">` +
							btnSegunEstado(tramite) +
							`</td>
						</tr>
					`;
					});
					tabla.insertAdjacentElement("beforeend", body_home);
					tabla.classList.remove("oculto");
					window.eliminar = eliminar;
					window.cambiar_estado = cambiar_estado;
					window.resolucionTramite = resolucionTramite;
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
});

const btnSegunEstado = (tramite) => {
	let btn = "";
	if (tramite.estado == "Pendiente") {
		btn = `<button class="btn_icon" onclick='cambiar_estado(${tramite.tramite_id})'>
						<box-icon
							name="transfer-alt"
							color="green"
							title="Cambiar de estado"
						></box-icon>
					</button>
					<button class="btn_icon" onclick='eliminar(${tramite.tramite_id})'>
					<box-icon
						type="solid"
						name="trash"
						color="red"
						title="Eliminar trámite"
					></box-icon>
				</button>`;
	} else {
		if (tramite.estado == "Aprobado") {
			btn = `<button class="btn_icon" onclick='resolucionTramite("${tramite.motivo_finalizado}")'>
						<box-icon type='solid' size='sm' name='check-circle' color='green' title='Motivo aprobación'></box-icon>
					</button>`;
		} else {
			btn = `<button class="btn_icon" onclick='resolucionTramite("${tramite.motivo_finalizado}")'>
						<box-icon type='solid' size='sm' name='x-circle' color='red' title='Motivo rechazo'></box-icon>
					 </button>`;
		}
	}
	return btn;
};

const eliminar = (tramite_id) => {
	Swal.fire({
		title: "Eliminar trámite?",
		icon: "question",
		showConfirmButton: true,
		confirmButtonColor: "#379237",
		confirmButtonText: "Confirmar",
		showCancelButton: true,
		cancelButtonColor: "#FF1E1E",
		cancelButtonText: `Cancelar`,
	}).then((result) => {
		if (result.isConfirmed) {
			fetch(URL + `tramites/eliminar/${tramite_id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tramite_id: tramite_id,
				}),
			})
				.then((response) => response.json())
				.then((response) => {
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
				});
		}
	});
};

const cambiar_estado = (tramite_id) => {
	localStorage.setItem("tramite_id", tramite_id);
	location.href = "/pages/tramites/cambio_estado.html";
};

const resolucionTramite = (tramite) => {
	let respuesta = tramite.split("-");

	Swal.fire({
		title: `${respuesta[0]}`,
		text: `${respuesta[1]}`,
		confirmButtonColor: "#3085d6",
		confirmButtonText: "Aceptar",
	});
};

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
