
var elements = document.getElementsByClassName("button");
Array.from(elements).forEach(function(element) {
    element.addEventListener('click', clickButton);
    element.parent = element.parentNode.id;
});
var elements = document.getElementsByClassName("complex-button");
Array.from(elements).forEach(function(element) {
    element.addEventListener('click', clickButton);
    element.parent = element.parentNode.id;
});

var final_JSON = {
    "class": null,
    "number": "",
    "letter": ""
};

function fillInSummary() {
    var begins = new Date(parseInt(final_JSON.class.begins)*1000);
    var ends = new Date(parseInt(final_JSON.class.ends)*1000);

    document.getElementById('subject-final').textContent = final_JSON.class.friendly_name || final_JSON.class.calendar_name;
    document.getElementById('classroom-final').textContent = final_JSON.class.room;
    document.getElementById('date-final').textContent = begins.toLocaleDateString();
    document.getElementById('time-final').textContent = formatDate(begins) + ' - ' + formatDate(ends);
    document.getElementById('letter-final').textContent = final_JSON.letter;
    document.getElementById('number-final').textContent = final_JSON.number;
}

function clickButton(element) {
    var btn = element.currentTarget;
    var parent = btn.parent;

    if (parent == "subject-container") {
        // Canvi de background del button
        var selectedClass = JSON.parse(btn.getAttribute('data-class'));
        $("#subject-container .complex-button").removeClass("is-link")
        btn.classList.add("is-link");
        // Canvi JSON
        final_JSON["class"] = selectedClass;
        // Anchor següent pregunta
        switchSection("section-2");
    } else if (parent == "number-container") {
        // Canvi de background del button
        $("#number-container .button").removeClass("is-link is-light is-active")
        btn.classList.add("is-link", "is-light", "is-active");
        // Canvi JSON
        final_JSON["number"] = btn.getAttribute('data-number');
        // Introducció de totes les dades al resum final
        fillInSummary();
        // Anchor següent pregunta
        switchSection("section-send");
    } else if (parent == "letter-container") {
        // Canvi de background del button
        $("#letter-container .button").removeClass("is-link is-light is-active")
        btn.classList.add("is-link", "is-light", "is-active");
        // Canvi JSON
        final_JSON["letter"] = btn.getAttribute('data-letter');
        // Anchor següent pregunta
        switchSection("section-3");
    }
}

function formatDate(d) {
    var str = "";
    str += d.getHours();
    str += ":";
    if (d.getMinutes() < 10) str += "0";
    str += d.getMinutes();
    return str;
}

var api_url;

window.addEventListener('load', _ => {
    // Check if user is signed in
    if (localStorage.getItem('devMode') == 'true') {
        var banner = document.getElementById('dev-mode');
        banner.addEventListener('click', _ => {
            localStorage.devMode = 'false';
            location.reload();
        });
        banner.classList.remove('hidden');
        api_url = localStorage.getItem('apiUrl') || 'https://covid-tracability-backend-dev.sandbox.avm99963.com/api/v1/'
    } else {
        api_url = "https://covid-tracability-backend-prod.sandbox.avm99963.com/api/v1/";
    }
    fetch(api_url + "isSignedIn", {
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.json())
        .then(data => {
            if (!data.payload.signedIn) {
                console.log("Not signed in!");
                fetch(api_url + "getAuthUrl", {
                    "mode": "cors",
                    "credentials": "include"
                })
                    .then(response => response.json())
                    .then(data => {
                        // TODO: redirect here
                        // location.href = data.payload.url;
                        console.warn('Log in here: ', data.payload.url);
                    });
            }
        });

    fetch(api_url + "getCurrentClasses", {
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.payload.classes.length == 0) {
                document.getElementById('no-subjects').classList.remove('hidden');
            } else {
                document.getElementById('fme-maps-container').classList.remove('hidden');
            }

            for (var [i, classe] of data.payload.classes.entries()) {
                var hora_inici = formatDate(new Date(parseInt(classe.begins)*1000));
                var hora_final = formatDate(new Date(parseInt(classe.ends)*1000));

                var classeDiv = document.createElement('div');
                classeDiv.classList.add('message', 'complex-button');
                classeDiv.id = 'subject-' + classe.subject_id + '-' + classe.room;
                classeDiv.setAttribute('data-class', JSON.stringify(classe));

                var header = document.createElement('div');
                header.classList.add('message-header');
                header.textContent = classe.friendly_name || classe.calendar_name;

                var body = document.createElement('div');
                body.classList.add('message-body');

                var div1 = document.createElement('div');
                var span = document.createElement('span');
                span.textContent = classe.room;

                if (i > 0 && data.payload.classes[i-1].calendar_name == classe.calendar_name) {
                    div1.classList.add('has-text-danger', 'has-text-weight-bold');
                } else if (i < data.payload.classes.length - 1 && data.payload.classes[i+1].calendar_name == classe.calendar_name) {
                    div1.classList.add('has-text-danger', 'has-text-weight-bold');
                }

                div1.textContent = 'Aula ';
                div1.appendChild(span);

                var div2 = document.createElement('div');
                div2.textContent = hora_inici + ' - ' + hora_final;

                body.appendChild(div1);
                body.appendChild(div2);

                classeDiv.appendChild(header);
                classeDiv.appendChild(body);

                document.getElementById("subject-container").appendChild(classeDiv);
            }

            var elements = document.getElementsByClassName("button");
            Array.from(elements).forEach(function(element) {
                element.addEventListener('click', clickButton);
                element.parent = element.parentNode.id;
            });
            var elements = document.getElementsByClassName("complex-button");
            Array.from(elements).forEach(function(element) {
                element.addEventListener('click', clickButton);
                element.parent = element.parentNode.id;
            });
        });
});

