import { apiTiempo, ver_mapa } from "../../../js/extras.js";
import { validacionBlur } from "../../../js/validaciones.js";

let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");
let tb_cambio_estado = document.getElementById("tb_cambio_estado");
let form_cambio_estado = document.getElementById("form_cambio_estado");

// const URL = "http://gbazzani.pythonanywhere.com/";
const URL = "http://127.0.0.1:5000/";

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();

	let tramite_id = localStorage.getItem("tramite_id");

	fetch(URL + "tramites/cambio_estado/" + tramite_id)
		.then((res) => res.json())
		.then((res) => {
			let tram = res[0];
			let prop = JSON.parse(tram.propiedades);

			if (tram.tramite_id == tramite_id) {
				tb_cambio_estado.innerHTML = `
                     <tr>
                        <td>${tram.tramite_id}</td>
                        <td>${prop.nombre} ${prop.apellido}</td>
                        <td>${tram.puesto}</td>
                        <td>${tram.estado}</td>
                     </tr>
                  `;
			}

			let estados = document.getElementById("estado");
			let lista_estados = res[0].estados;

			lista_estados.forEach((estado) => {
				let option = document.createElement("option");
				option.value = estado.estado_id;
				option.text = estado.estado;
				estados.add(option);
			});
		})
		.catch(function (error) {
			console.log(error);
		});
});

form_cambio_estado.addEventListener("submit", (e) => {
	e.preventDefault();

	let tramite_id = localStorage.getItem("tramite_id");

	let estado = document.getElementById("estado").value;
	let motivo = document.getElementById("motivo").value;
	let descripcion = document.getElementById("descripcion").value;

	const DATA = {
		estado: estado,
		motivo: motivo,
		descripcion: descripcion,
	};

	if (validacionBlur(DATA)) {
		Swal.fire({
			title: "Cambiar estado?",
			icon: "question",
			showConfirmButton: true,
			confirmButtonColor: "#379237",
			confirmButtonText: "Confirmar",
			showCancelButton: true,
			cancelButtonColor: "#FF1E1E",
			cancelButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(URL + "tramites/cambio_estado/" + tramite_id, {
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
							localStorage.removeItem("tramite_id");
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
