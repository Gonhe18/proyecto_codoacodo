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

	fetch(URL + "tramites/crear")
		.then((res) => res.json())
		.then((res) => {
			let tipo_tramite = document.getElementById("tipo_tramite");
			let area = document.getElementById("area");
			let prop_tipos = res.tipos;
			let prop_puestos = res.puestos;

			prop_tipos.forEach((tipos) => {
				let option = document.createElement("option");
				option.value = tipos.tipo_id;
				option.text = tipos.tipo;
				tipo_tramite.add(option);
			});

			prop_puestos.forEach((puestos) => {
				let option = document.createElement("option");
				option.value = puestos.puesto_id;
				option.text = puestos.puesto;
				area.add(option);
			});
		})
		.catch(function (error) {
			console.log(error);
		});
});

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();

	let tipo_tramite = document.getElementById("tipo_tramite").value;
	let area = document.getElementById("area").value;
	let nombre = document.getElementById("nombre").value;
	let apellido = document.getElementById("apellido").value;
	let email = document.getElementById("email").value;
	let telefono = document.getElementById("telefono").value;
	let asunto = document.getElementById("asunto").value;
	let descripcion = document.getElementById("descripcion").value;

	const PROP = {
		nombre: nombre,
		apellido: apellido,
		email: email,
		telefono: telefono,
		asunto: asunto,
		descripcion: descripcion,
	};
	const DATA = {
		tipo_tramite_id: tipo_tramite,
		area_asignada_id: area,
		propiedades: JSON.stringify(PROP),
	};

	const validacion = {
		tipo_tramite: tipo_tramite,
		area: area,
		nombre: nombre,
		apellido: apellido,
		email: email,
		telefono: telefono,
		asunto: asunto,
		descripcion: descripcion,
	};

	if (validacionBlur(validacion)) {
		Swal.fire({
			title: "Crear trámite?",
			icon: "question",
			showConfirmButton: true,
			confirmButtonColor: "#379237",
			confirmButtonText: "Confirmar",
			showCancelButton: true,
			cancelButtonColor: "#FF1E1E",
			cancelButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(URL + "tramites/crear", {
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
							location.href = "/index.html";
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
