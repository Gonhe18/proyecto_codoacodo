import { apiTiempo, ver_mapa } from "./extras.js";
let body_home = document.getElementById("body_home");
let bloque_tabla = document.getElementById("bloque_tabla");
let tabla = document.getElementById("tabla");
let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");
let form_nuevo = document.getElementById("form_nuevo");

const URL = "http://gbazzani.pythonanywhere.com/";
// const URL = "http://127.0.0.1:5000/";

window.addEventListener("load", (e) => {
	e.preventDefault();
	apiTiempo();

	fetch(URL + "estados_tramites")
		.then((response) => response.json())
		.then((response) => {
			// console.log(response);
			// if (TRAMITES == null) {
			//    bloque_tabla.innerHTML =
			//       "<div class='sin_tramites'><span class='msj_sin_tramites'>No hay trámites<span></div>";
			// } else {
			//    let lista_tramites = JSON.parse(TRAMITES);
			//    lista_tramites.forEach((tramite) => {
			//       btnSegunEstado(tramite);
			//       body_home.innerHTML =
			//          body_home.innerHTML +
			//          `
			//          <tr>
			//             <td>${tramite.id}</td>
			//             <td>${tramite.nombre} ${tramite.apellido}</td>
			//             <td>${tramite.fecha_actualizacion}</td>
			//             <td>${tramite.estado}</td>
			//             <td class="icon_acciones" id="tramite${tramite.id}">` +
			//          btnSegunEstado(tramite) +
			//          `</td>
			//          </tr>
			//       `;
			//    });
			//    tabla.insertAdjacentElement("beforeend", body_home);
			//    tabla.classList.remove("oculto");
			//    window.cambiarEstado = cambiarEstado;
			//    window.eliminarTramite = eliminarTramite;
			//    window.resolucionTramite = resolucionTramite;
			// }
		});
});

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();
	let estado = document.getElementById("estado").value;
	let descripcion = document.getElementById("descripcion").value;

	fetch(URL + "estados_tramites", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ estado: estado, descripcion: descripcion }),
	})
		.then((res) => res.json())
		.then((res) => {
			// console.log(res);
		})
		.catch(function (error) {
			// console.log(error);
		});

	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		estado: estado,
	// 		descripcion: descripcion,
	// 	}),
	// })
	// 	.then(function (response) {
	// if (response.ok) {
	// 	console.log(response.body);
	// 	return response.json();
	// } else {
	// 	throw new Error("Error al agregar el producto.");
	// }
	// 	})
	// 	.then(function (data) {
	// 		// form_nuevo.reset();
	// 	})
	// 	.catch(function (error) {
	// 		console.log(error);
	// 	});
});

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
