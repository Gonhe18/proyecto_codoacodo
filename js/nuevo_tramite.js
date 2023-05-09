//CREAR NUEVO TRÁMITE
import { formatoFecha } from "./extras.js";

let form_nuevo = document.getElementById("form_nuevo");

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();

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
				title: "Trámite creado exitosamente",
			});

			const array_tramites = [];
			const tramites = localStorage.getItem("tramites");

			let id_tramite = tramites != null ? JSON.parse(tramites).slice(-1) : 1;

			const DATA = Object.fromEntries(new FormData(e.target));
			DATA.fecha_actualizacion = formatoFecha();
			DATA.estado = "pendiente";

			if (tramites == null) {
				DATA.id = id_tramite;
				array_tramites.push(DATA);
				localStorage.setItem("tramites", JSON.stringify(array_tramites));
			} else {
				let nuevo_campo = JSON.parse(tramites);
				DATA.id = id_tramite[0].id + 1;
				nuevo_campo.push(DATA);
				localStorage.setItem("tramites", JSON.stringify(nuevo_campo));
			}
			setTimeout(() => {
				location.href = "/index.html";
			}, 1200);
		}
	});
});
