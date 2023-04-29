// RECUPERAR TODOS LOS TRÁMITES
let body_home = document.getElementById("body_home");
let bloque_tabla = document.getElementById("bloque_tabla");
let tabla = document.getElementById("tabla");

window.addEventListener("load", (e) => {
	e.preventDefault();

	const tramites = localStorage.getItem("tramites");

	if (tramites == null) {
		bloque_tabla.innerHTML =
			"<div class='sin_tramites'><span class='msj_sin_tramites'>No hay trámites<span></div>";
	} else {
		let lista_tramites = JSON.parse(tramites);

		lista_tramites.forEach((tramite) => {
			console.log(tramite);
			body_home.innerHTML = `
				<tr>
					<td>${tramite.id}</td>
					<td>${tramite.nombre} ${tramite.apellido}</td>
					<td>${tramite.fecha_actualizacion}</td>
					<td>${tramite.estado}</td>
					<td class="icon_acciones" id="tramite${tramite.id}">
						<a href="/pages/cambio_estado.html" >
							<box-icon
								name="transfer-alt"
								color="green"
								title="Cambiar de estado"
							></box-icon>
						</a>
						<box-icon
							type="solid"
							name="trash"
							color="red"
							title="Eliminar trámite"
						></box-icon>
					</td>
				</tr>
			`;
		});
		tabla.insertAdjacentElement("beforeend", body_home);

		tabla.classList.remove("oculto");
	}
});
