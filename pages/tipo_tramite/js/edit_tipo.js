import { apiTiempo, ver_mapa } from "../../../js/extras.js";
import { validacionBlur } from "../../../js/validaciones.js";

let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");
let form_edit = document.getElementById("form_edit");

// const URL = "http://gbazzani.pythonanywhere.com/";
const URL = "http://127.0.0.1:5000/";

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();
	let tipo_id = localStorage.getItem("tipo_id");

	fetch(URL + "tipos_tramites/edit/" + tipo_id)
		.then((response) => response.json())
		.then((response) => {
			tipo_tramite.value = response.tipo;
			descripcion.value = response.descripcion;
		});
});

form_edit.addEventListener("submit", (e) => {
	e.preventDefault();

	let tipo_id = localStorage.getItem("tipo_id");
	let tipo_tramite = document.getElementById("tipo_tramite").value;
	let descripcion = document.getElementById("descripcion").value;

	const DATA = {
		tipo_tramite: tipo_tramite,
		descripcion: descripcion,
	};

	if (validacionBlur(DATA)) {
		Swal.fire({
			title: "Crear tipo de trámite?",
			icon: "question",
			showConfirmButton: true,
			confirmButtonColor: "#379237",
			confirmButtonText: "Confirmar",
			showCancelButton: true,
			cancelButtonColor: "#FF1E1E",
			cancelButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(URL + "tipos_tramites/edit/" + tipo_id, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(DATA),
				})
					.then((res) => res.json())
					.then((res) => {
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
							icon: res.message != undefined ? "success" : "error",
							title: res.message != undefined ? res.message : res.error,
						});

						if (res.message != undefined) {
							// setTimeout(() => {
							localStorage.removeItem("tipo_id");
							location.href = "/pages/tipo_tramite/tabla.html";
							// }, 1200);
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		});
	}
});

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
