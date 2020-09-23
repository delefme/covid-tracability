
function completaHTML() {
    document.getElementById("data").innerHTML = data;
    var trobat = false;
    for (i = 0; i < dataHorarisAlumne.length; i++) { 
    	var h = dataHorarisAlumne[i].hora.split(":");
		var hAct = hora_actual.getHours() - 1;
		console.log(h[0]);
		console.log(hAct);
        if(hAct < 10) hAct = "0" + hAct;
        if(h[0] == hAct) {
        	trobat = true;
			document.getElementById("assignatura").innerHTML = dataHorarisAlumne[i].nom;
			document.getElementById("aula").innerHTML = "Aula " + dataHorarisAlumne[i].aula;
		}
	}
	if(!trobat) {
		document.getElementById("assignatura").innerHTML = "No tens cap assignatura ara mateix de les que curses";
	}

}