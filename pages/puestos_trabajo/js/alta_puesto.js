import { apiTiempo, ver_mapa } from "../../../js/extras.js";
import { validacionBlur } from "../../../js/validaciones.js";

let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");
let form_nuevo = document.getElementById("form_nuevo");

// const URL = "http://gbazzani.pythonanywhere.com/";
const URL = "http://127.0.0.1:5000/";

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();
});

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();

	let puesto_trabajo = document.getElementById("puesto_trabajo").value;
	let descripcion = document.getElementById("descripcion").value;

	const DATA = {
		puesto_trabajo: puesto_trabajo,
		descripcion: descripcion,
	};

	if (validacionBlur(DATA)) {
		Swal.fire({
			title: "Crear puesto de trabajo?",
			icon: "question",
			showConfirmButton: true,
			confirmButtonColor: "#379237",
			confirmButtonText: "Confirmar",
			showCancelButton: true,
			cancelButtonColor: "#FF1E1E",
			cancelButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(URL + "puestos_trabajo", {
					method: "POST",
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
							location.href = "/pages/puestos_trabajo/tabla.html";
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
