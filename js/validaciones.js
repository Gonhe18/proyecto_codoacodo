export const validacionBlur = (data) => {
	let campos = Object.keys(data);

	let validacionOK = false;
	let validacionError = false;

	let patronEmail =
		/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

	campos.forEach((campo) => {
		let camp = document.getElementById(`${campo}`);

		let reglasValidacion = JSON.parse(camp.dataset.validacion);

		reglasValidacion.forEach((reglas) => {
			let validar = validaciones(patronEmail, camp, reglas);
			if (validar) {
				validacionOK = true;
			} else {
				validacionError = true;
			}

			camp.addEventListener("blur", (e) => {
				let campoError = document.getElementById(`error_${camp.id}`);
				if (reglas == "required") {
					if (camp.value == "") {
						validacionOK = false;
						msjError(camp, reglas);
						return;
					} else {
						campoError.innerHTML = "";
						validacionOK = true;
					}
				}

				if (reglas == "email") {
					if (!patronEmail.test(camp.value)) {
						validacionOK = false;
						msjError(camp, reglas);
						return;
					} else {
						campoError.innerHTML = "";
						validacionOK = true;
					}
				}

				if (reglas.includes("min")) {
					let minimo = reglas.split(":");
					if (camp.value.length < parseInt(minimo[1])) {
						validacionOK = false;
						msjError(camp, reglas);
						return;
					} else {
						campoError.innerHTML = "";
						validacionOK = true;
					}
				}
				if (reglas.includes("max")) {
					let minimo = reglas.split(":");
					if (camp.value.length > parseInt(minimo[1])) {
						validacionOK = false;
						msjError(camp, reglas);
						return;
					} else {
						campoError.innerHTML = "";
						validacionOK = true;
					}
				}
			});
		});
	});
	if (!validacionError) {
		return validacionOK;
	} else {
		return false;
	}
};

const validaciones = (patronEmail, camp, reglas) => {
	let validacionOK = false;

	if (reglas == "required") {
		if (camp.value == "") {
			validacionOK = false;
			msjError(camp, reglas);
			return;
		} else {
			validacionOK = true;
		}
	} else if (reglas == "email") {
		if (!patronEmail.test(camp.value)) {
			validacionOK = false;
			msjError(camp, reglas);
			return;
		} else {
			validacionOK = true;
		}
	} else if (reglas.includes("min")) {
		let minimo = reglas.split(":");
		if (camp.value.length < parseInt(minimo[1])) {
			validacionOK = false;
			msjError(camp, reglas);
			return;
		} else {
			validacionOK = true;
		}
	} else if (reglas.includes("max")) {
		let minimo = reglas.split(":");
		if (camp.value.length > parseInt(minimo[1])) {
			validacionOK = false;
			msjError(camp, reglas);
			return;
		} else {
			validacionOK = true;
		}
	}

	return validacionOK;
};

const msjError = (input, reglas) => {
	let campoError = document.getElementById(`error_${input.id}`);

	if (reglas == "required") {
		if (input.value == "") {
			if (campoError.innerHTML == "") {
				campoError.innerHTML = `El campo '${input.id.replace(
					"_",
					" "
				)}' es requerido`;
				campoError.setAttribute("class", "error_form");
			}
		}
	}

	if (reglas == "email") {
		if (campoError.innerHTML == "") {
			campoError.innerHTML = "Formato de email incorrecto";
			campoError.setAttribute("class", "error_form");
		}
	}

	if (reglas.includes("min")) {
		let minimo = reglas.split(":");
		if (input.value.length < parseInt(minimo[1])) {
			if (campoError.innerHTML == "") {
				campoError.innerHTML = `El campo '${input.id.replace(
					"_",
					" "
				)}' debe tener como mínimo ${parseInt(minimo[1])} carácteres`;
				campoError.setAttribute("class", "error_form");
			}
		}
	}
	if (reglas.includes("max")) {
		let minimo = reglas.split(":");
		if (input.value.length > parseInt(minimo[1])) {
			if (campoError.innerHTML == "") {
				campoError.innerHTML = `El campo '${input.id.replace(
					"_",
					" "
				)}' debe tener como máximo ${parseInt(minimo[1])} carácteres`;
				campoError.setAttribute("class", "error_form");
			}
		}
	}
};
