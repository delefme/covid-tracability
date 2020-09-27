
function completeSubjectList() {
	var trobat = false;
	var jaEsta = false;
	for(var i = 0; i < totesLesClasses.length; i++) {

		if(document.getElementById("myInput").value == totesLesClasses[i].nom) {
			for(var j = 0; j < dataHorarisAlumne.length; j++) {
				if(totesLesClasses[i].nom == dataHorarisAlumne[j].nom) {
					jaEsta = true;
					break;
				}
			}
			if(!jaEsta) {
				dataHorarisAlumne.push({ "nom":totesLesClasses[i].nom, "hora":totesLesClasses[i].hora, "aula": totesLesClasses[i].aula })
				document.getElementById("subjectList").innerHTML += "<br>" +  document.getElementById("myInput").value  + " " + totesLesClasses[i].hora[hora_actual.getDay()];
		    	localStorage.dataHorarisAlumne = JSON.stringify(dataHorarisAlumne);
				trobat = true;
				completaHTML();
			}
			else {
				break;
			}
		}
	}
	if(!trobat && !jaEsta) {
		showAlert();
	}
	else if(jaEsta) {

	}
}


function returnAllSubjectArray() {
	for(var i = 0; i < totesLesClasses.length; i++) {
		subjects.push(totesLesClasses[i].nom);
	}
}

function writeSubjectList() {
	for(var i = 0; i < dataHorarisAlumne.length; i++) {
        document.getElementById("subjectList").innerHTML += "<br>" +  dataHorarisAlumne[i].nom + " " + dataHorarisAlumne[i].hora[hora_actual.getDay()];
    } 
}

function showAlert()  {
	document.getElementById("alert").innerHTML = "Aquesta assignatura no esta dins de la llista"
    document.getElementById("alert").style.opacity = "1";
    setTimeout(()=> dissapearAlert() ,2000); // hide the alert after 2.5s
}

function dissapearAlert() {
	document.getElementById("alert").style.opacity = "0";
	document.getElementById("alert").innerHTML = "";
}