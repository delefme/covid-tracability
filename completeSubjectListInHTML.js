
function completeSubjectList() {
    classesAlumne[localStorage.pos] = document.getElementById("myInput").value;
    localStorage.pos++;
    document.getElementById("subjectList").innerHTML += "<br>" +  document.getElementById("myInput").value;
    localStorage.classesAlumne = JSON.stringify(classesAlumne);
}

function writeSubjectList() {
	for(i = 0; i < classesAlumne.length; i++) {
        document.getElementById("subjectList").innerHTML += "<br>" +  classesAlumne[i];
    } 
}