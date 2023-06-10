import { apiTiempo, ver_mapa } from "./extras.js";
const form_nuevo = document.getElementById("form_nuevo");
const inputs = document.querySelectorAll("#form_nuevo input");
const texto = document.querySelectorAll("#form_nuevo textarea");
let mostrar_mapa = document.getElementById("mostrar_mapa");
let mapa = document.getElementById("mapa");

apiTiempo();
const expresiones = {
	apellido: /^[\sA-ZÑa-zñáéíóúÁÉÍÓÚ ]+$/,
	nombre: /^[\sA-ZÑa-zñáéíóúÁÉÍÓÚ ]+$/,
	email: /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
	tel: /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/,
	tramite: /^[0-9]{5,16}$/,
	asunto: /^[\sA-ZÑa-zñáéíóúÁÉÍÓÚ]+$/,
	comentario: /^[\sa-zñáéíóúÁÉÍÓÚA-ZÑ0-9.-]+$/,
};

const campos = {
	apellido: false,
	nombre: false,
	email: false,
	tel: false,
	tramite: false,
	asunto: false,
	comentario: false,
};

const validarFormulario = (e) => {
	switch (e.target.name) {
		case "apellido":
			validarCampo(expresiones.apellido, e.target, "apellido");
			break;
		case "nombre":
			validarCampo(expresiones.nombre, e.target, "nombre");
			break;
		case "email":
			validarCampo(expresiones.email, e.target, "email");
			break;
		case "tel":
			validarCampo(expresiones.tel, e.target, "tel");
			break;
		case "tramite":
			validarCampo(expresiones.tramite, e.target, "tramite");
			break;
		case "asunto":
			validarCampo(expresiones.asunto, e.target, "asunto");
			break;
		case "comentario":
			validarCampo1(expresiones.comentario, e.target, "comentario");
	}
};

const validarCampo = (expresion, input, campo) => {
	if (expresion.test(input.value)) {
		document
			.getElementById(`grupo_${campo}`)
			.classList.remove("bloque_campos-incorrecto");
		document
			.getElementById(`grupo_${campo}`)
			.classList.add("bloque_campos-correcto");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.add("fa-check-circle");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.remove("fa-times-circle");
		document
			.querySelector(`#grupo_${campo} .form__input-error`)
			.classList.remove("form__input-error-activo");
		campos[campo] = true;
	} else {
		document
			.getElementById(`grupo_${campo}`)
			.classList.add("bloque_campos-incorrecto");
		document
			.getElementById(`grupo_${campo}`)
			.classList.remove("bloque_campos-correcto");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.add("fa-times-circle");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.remove("fa-check-circle");
		document
			.querySelector(`#grupo_${campo} .form__input-error`)
			.classList.add("form__input-error-activo");
		campos[campo] = false;
	}
};

const validarCampo1 = (expresion, textarea, campo) => {
	if (expresion.test(textarea.value)) {
		document
			.getElementById(`grupo_${campo}`)
			.classList.remove("bloque_campos-incorrecto");
		document
			.getElementById(`grupo_${campo}`)
			.classList.add("bloque_campos-correcto");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.add("fa-check-circle");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.remove("fa-times-circle");
		document
			.querySelector(`#grupo_${campo} .form__input-error`)
			.classList.remove("form__input-error-activo");
		campos[campo] = true;
	} else {
		document
			.getElementById(`grupo_${campo}`)
			.classList.add("bloque_campos-incorrecto");
		document
			.getElementById(`grupo_${campo}`)
			.classList.remove("bloque_campos-correcto");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.add("fa-times-circle");
		document
			.querySelector(`#grupo_${campo} i`)
			.classList.remove("fa-check-circle");
		document
			.querySelector(`#grupo_${campo} .form__input-error`)
			.classList.add("form__input-error-activo");
		campos[campo] = false;
	}
};
inputs.forEach((input) => {
	input.addEventListener("keyup", validarFormulario);
	input.addEventListener("blur", validarFormulario);
});

texto.forEach((textarea) => {
	textarea.addEventListener("keyup", validarFormulario);
	textarea.addEventListener("blur", validarFormulario);
});

form_nuevo.addEventListener("submit", (e) => {
	e.preventDefault();

	if (
		campos.apellido &&
		campos.nombre &&
		campos.email &&
		campos.tel &&
		campos.tramite &&
		campos.asunto &&
		campos.comentario
	) {
		Swal.fire({
			title: "Enviar mensaje?",
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
					title: "Mensaje enviado exitosamente exitosamente",
				});

				form_nuevo.reset();
				document
					.getElementById("form_msjExito")
					.classList.add("form_msjExito-activo");
				document
					.getElementById("form_msje")
					.classList.remove("form_msje-activo");
				setTimeout(() => {
					document
						.getElementById("form_msjExito")
						.classList.remove("form_msjExito-activo");
				}, 1200);

				document
					.querySelectorAll(".bloque_campos-correcto")
					.forEach((icono) => {
						icono.classList.remove("bloque_campos-correcto");
					});
			}
		});
	} else {
		document.getElementById("form_msje").classList.add("form_msje-activo");
	}
});

mostrar_mapa.addEventListener("click", () => {
	ver_mapa(mapa);
});
