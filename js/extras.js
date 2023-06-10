export const formatoFecha = () => {
	const FECHA = new Date(Date.now());
	let dia = FECHA.getDate() + 1 <= 9 ? "0" + FECHA.getDate() : FECHA.getDate();
	let mes =
		FECHA.getMonth() + 1 <= 9
			? "0" + (FECHA.getMonth() + 1)
			: FECHA.getMonth() + 1;
	let anio = FECHA.getFullYear();

	return dia + "-" + mes + "-" + anio;
};

export const apiTiempo = () => {
	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords;
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=es&appid=d3491c204cc549a885ecfd03578534ae`
		)
			.then((resp) => resp.json())
			.then((data) => {
				if (data) {
					console.log();
					let tiempo = document.getElementById("tiempo");
					let ico_tiempo = document.getElementById("ico_tiempo");
					let temp = document.getElementById("temp");
					let descrip = document.getElementById("descrip");
					let localidad = document.getElementById("localidad");

					tiempo.setAttribute("class", "bloque_tiempo");

					ico_tiempo.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

					temp.innerText = Math.trunc(data.main.temp) + "°";
					descrip.innerText = data.weather[0].description;
					localidad.innerText = data.name;
				}
			});
	});
};

export const ver_mapa = (maps) => {
	maps.classList.toggle("mapa");
};
