// RECUPERAR TODOS LOS TRÁMITES
import { apiTiempo, ver_mapa } from "./extras.js";
let body_home = document.getElementById("body_home");
let bloque_tabla = document.getElementById("bloque_tabla");
let tabla = document.getElementById("tabla");
let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();

	const TRAMITES = localStorage.getItem("tramites");

	if (TRAMITES == null) {
		bloque_tabla.innerHTML =
			"<div class='sin_tramites'><span class='msj_sin_tramites'>No hay trámites<span></div>";
	} else {
		let lista_tramites = JSON.parse(TRAMITES);
		lista_tramites.forEach((tramite) => {
			btnSegunEstado(tramite);
			body_home.innerHTML =
				body_home.innerHTML +
				`
				<tr>
					<td>${tramite.id}</td>
					<td>${tramite.nombre} ${tramite.apellido}</td>
					<td>${tramite.fecha_actualizacion}</td>
					<td>${tramite.estado}</td>
					<td class="icon_acciones" id="tramite${tramite.id}">` +
				btnSegunEstado(tramite) +
				`</td>
				</tr>
			`;
		});
		tabla.insertAdjacentElement("beforeend", body_home);

		tabla.classList.remove("oculto");
		window.cambiarEstado = cambiarEstado;
		window.eliminarTramite = eliminarTramite;
		window.resolucionTramite = resolucionTramite;
	}
});

const btnSegunEstado = (tramite) => {
	let btn = "";

	if (tramite.estado == "pendiente") {
		btn = `<button class="btn_icon" onclick='cambiarEstado(${tramite.id})'>
						<box-icon
							name="transfer-alt"
							color="green"
							title="Cambiar de estado"
						></box-icon>
					</button>
					<button class="btn_icon" onclick='eliminarTramite(${tramite.id})'>
					<box-icon
						type="solid"
						name="trash"
						color="red"
						title="Eliminar trámite"
					></box-icon>
				</button>`;
	} else {
		if (tramite.estado == "aprobado") {
			btn = `<button class="btn_icon" onclick='resolucionTramite(${tramite.id})'>
						<box-icon type='solid' size='sm' name='check-circle' color='green' title='Motivo aprobación'></box-icon>
					</button>`;
		} else {
			btn = `<button class="btn_icon" onclick='resolucionTramite(${tramite.id})'>
						<box-icon type='solid' size='sm' name='x-circle' color='red' title='Motivo rechazo'></box-icon>
					 </button>`;
		}
	}
	return btn;
};

const eliminarTramite = (id_tramite) => {
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
				title: "Trámite eliminado exitosamente",
			});

			const TRAMITES = localStorage.getItem("tramites");
			let lista_tramites = JSON.parse(TRAMITES);

			lista_tramites.forEach((tramite) => {
				if (tramite.id == id_tramite) {
					lista_tramites.splice(lista_tramites.indexOf(tramite), 1);
				}
			});

			if (lista_tramites.length > 0) {
				localStorage.setItem("tramites", JSON.stringify(lista_tramites));
			} else {
				localStorage.removeItem("tramites");
			}
			setTimeout(() => {
				location.href = "/index.html";
			}, 1200);
		}
	});
};

const cambiarEstado = (id_tramite) => {
	localStorage.setItem("id_tramite", id_tramite);
	location.href = "/pages/cambio_estado.html";
};

const resolucionTramite = (id_tramite) => {
	const TRAMITES = localStorage.getItem("tramites");
	let lista_tramites = JSON.parse(TRAMITES);

	lista_tramites.forEach((tramite) => {
		if (tramite.id == id_tramite) {
			Swal.fire({
				title: `${tramite.motivo}`,
				text: `${tramite.descripcion}`,
				confirmButtonColor: "#3085d6",
				confirmButtonText: "Aceptar",
			});
		}
	});
};

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
