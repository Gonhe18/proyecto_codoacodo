export const formatoFecha = () => {
	const FECHA = new Date(Date.now());
	let dia = FECHA.getDate() + 1 <= 9 ? "0" + FECHA.getDate() : FECHA.getDate();
	let mes =
		FECHA.getMonth() + 1 <= 9
			? "0" + (FECHA.getMonth() + 1)
			: FECHA.getMonth() + 1;
	let anio = FECHA.getFullYear();

	return dia + "/" + mes + "/" + anio;
};
