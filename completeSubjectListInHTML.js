
function completeSubjectList() {
	var trobat = false;
	for(var i = 0; i < totesLesClasses.length; i++) {
		if(document.getElementById("myInput").value == totesLesClasses[i].nom) {
			dataHorarisAlumne.push({ "nom":totesLesClasses[i].nom, "hora":totesLesClasses[i].hora, "aula":totesLesClasses[i].aula })
			document.getElementById("subjectList").innerHTML += "<br>" +  document.getElementById("myInput").value  + " " + dataHorarisAlumne[i].hora;
	    	localStorage.dataHorarisAlumne = JSON.stringify(dataHorarisAlumne);
			trobat = true;
			completaHTML();
		}
	}
	if(!trobat) {
		showAlert();
	}
}

function returnAllSubjectArray() {
	for(var i = 0; i < totesLesClasses.length; i++) {
		subjects.push(totesLesClasses[i].nom);
	}
}

function writeSubjectList() {
	for(var i = 0; i < dataHorarisAlumne.length; i++) {
		console.log("hola");
        document.getElementById("subjectList").innerHTML += "<br>" +  dataHorarisAlumne[i].nom + " " + dataHorarisAlumne[i].hora;
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