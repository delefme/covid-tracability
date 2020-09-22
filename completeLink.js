
function completaLink() {
	if(linkOutput == "") linkOutput = "https://docs.google.com/forms/d/e/1FAIpQLSfT9o287VqLyhwR8LPdloAQWhuqCgA3NfdhgP5vb9_sVQHL-g/viewform";
    for (i = 0; i < mydata.length; i++) { 
    	var h = mydata[i].hora.split(":");
		if(h[0] == (hora_actual.getHours() - 7).toString()) {
			console.log("trobat");
			document.getElementById("assignatura").innerHTML = mydata[i].nom;
			document.getElementById("aula").innerHTML = "Aula " + mydata[i].aula;

            var datamap=[
                "entry.1063142948=" + mydata[i].aula,
                "entry.1749141911=" + (hora_actual.getHours().toString() - 11) +":00",
                "entry.1827359679=" + (hora_actual.getHours().toString() - 10) +":00",
                "entry.2115504093=" + any.toString() + '-' + mes.toString() + '-' + dia.toString(),
                "entry.1077148310=Columna+" + document.getElementById("seientInput").value
                ];
            linkOutput += "?"+ datamap[1] + "&" + datamap[2] + "&" + datamap[3] + "&" + datamap[0] + "&" + datamap[4];
            linkOutput += "&entry." + codisFiles[document.getElementById("seientInput").value.toUpperCase().charCodeAt(0) - 65] + "=Columna+" + document.getElementById("seientInput").value.charAt(1);
		}
	}
	console.log(linkOutput);
}