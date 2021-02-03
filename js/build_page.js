const idsFormulari = {
    room: "1063142948",
    day: "2115504093",
    begins: "1749141911",
    ends: "1827359679",
    rows: {
        A: "208184485",
        B: "1077148310",
        C: "642851281",
        D: "1686039024",
        E: "697835787",
        F: "1511799646",
        G: "809853432",
        H: "182597499",
        I: "1890539481",
        J: "529159478",
        K: "1615241874",
        L: "1334263875"
    },
    notes: "1600275159"
};

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfT9o287VqLyhwR8LPdloAQWhuqCgA3NfdhgP5vb9_sVQHL-g/viewform";

const MIN_HOUR = 8;
const MAX_HOUR = 23; // Pels altres graus de la Facultat

var final_JSON = {
    "class": null,
    "number": "",
    "letter": ""
};

var current_section = "section-1";

var repeated_subjects;
var current_time;


// From https://gist.github.com/treyhuffine/2ced8b8c503e5246e2fd258ddbd21b8c
const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function fillInSummary() {
    var begins = new Date(parseInt(final_JSON.class.begins)*1000);
    var ends = new Date(parseInt(final_JSON.class.ends)*1000);

    document.getElementById('subject-final').textContent = final_JSON.class.friendly_name || final_JSON.class.calendar_name;
    document.getElementById('classroom-final').textContent = final_JSON.class.room;
    document.getElementById('date-final').textContent = formatDate(begins);
    document.getElementById('time-final').textContent = formatTime(begins) + ' - ' + formatTime(ends);
    document.getElementById('letter-final').textContent = final_JSON.letter;
    document.getElementById('number-final').textContent = final_JSON.number;
}

function clickButton(element) {
    var btn = element.currentTarget;
    var parent = btn.parent;

    if (parent == "subject-container") {
        // Canvi de background del button
        var selectedClass = JSON.parse(btn.getAttribute('data-class'));
        $("#subject-container .complex-button, #subject-container .message-body").removeClass("is-selected")
        btn.classList.add('is-selected');
        btn.parentNode.parentNode.classList.add('is-selected');
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

function switchSection(s) {
    setTimeout(function(){ 
        document.getElementById(current_section).classList.add('is-hidden');
        document.getElementById(s).classList.remove('is-hidden');
        current_section = s;
    }, 75);
}

function findRepeatedSubjects(classes) {
    var rep = new Set();
    for (var [i, classe] of classes.entries()) {
        if (i > 0 && classes[i-1].calendar_name == classe.calendar_name) {
            rep.add(classe.id);
            rep.add(classes[i-1].id);
        }
    }
    return rep;
}

function transformClasses(rawClasses) {
    var classes = [];
    rawClasses.forEach(c => {
        var found = false;
        for (var i = 0; i < classes.length; ++i) {
            if ((classes[i][0].friendly_name || classes[i][0].calendar_name) == (c.friendly_name || c.calendar_name)) {
                classes[i].push(c);
                found = true;
                break;
            }
        }

        if (!found) {
            classes.push([c]);
        }
    });

    return classes;
}

function buildSubjectContainer(classes) {
    // Flush existing classes
    document.querySelectorAll('#subject-container .message').forEach(function(classe) {
        classe.parentNode.removeChild(classe);
    });

    for (var uniqueClasses of classes) {
        var firstClass = uniqueClasses[0];
        var hora_inici = formatTime(new Date(parseInt(firstClass.begins)*1000));
        var hora_final = formatTime(new Date(parseInt(firstClass.ends)*1000));

        var classeDiv = document.createElement('div');
        classeDiv.classList.add('message', 'complex-button');

        var header = document.createElement('div');
        header.classList.add('message-header');
        header.textContent = firstClass.friendly_name || firstClass.calendar_name;

        var roomsDiv = document.createElement('div');
        roomsDiv.classList.add('rooms-container');

        classeDiv.appendChild(header);

        for (var classe of uniqueClasses) {
            if (classe.user_selected) {
                classeDiv.classList.add('is-primary');
            }

            var body = document.createElement('div');
            body.classList.add('message-body');
            body.setAttribute('data-class', JSON.stringify(classe));
            body.addEventListener('click', clickButton);
            body.parent = 'subject-container';

            var div1 = document.createElement('div');

            div1.classList.add('has-text-weight-bold');
            div1.textContent = 'Aula ';

            var span = document.createElement('span');
            span.textContent = classe.room;
            div1.appendChild(span);

            var div2 = document.createElement('div');
            div2.textContent = hora_inici + ' - ' + hora_final;

            body.appendChild(div1);
            body.appendChild(div2);
            roomsDiv.appendChild(body);
        }

        classeDiv.appendChild(roomsDiv);
        document.getElementById("subject-container").appendChild(classeDiv);
    }
}

function getDefaultTime() {
    var time = new Date();
    time.setSeconds(0);
    time.setMilliseconds(0);
    if (time.getMinutes() < 30) time.setMinutes(0);
    else time.setMinutes(30);
    if (time.getHours() < MIN_HOUR) {
        time.setHours(MIN_HOUR);
        time.setMinutes(0);
    }
    if (time.getHours() >= MAX_HOUR) {
        time.setHours(MAX_HOUR - 1);
        time.setMinutes(30);
    }
    return time
}

function buildTimeSelector(date) {
    document.getElementById("date-selector").value = formatDate(date);
    var end_time = new Date(date.getTime() + 30*60000);  // 1 min = 60000 ms
    document.getElementById("time-selector").value = formatTime(date) + " - " + formatTime(end_time);
}

function isDateAfterTomorrow(potential_time) {
  var now = new Date();
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return (potential_time >= tomorrow);
}

function addDateEventListeners(date) {
    document.getElementById("date-prev").addEventListener('click', function (el) {
        current_time = new Date(current_time.getTime() - 24*60*60000);
        buildTimeSelector(current_time);
        fetchClassesDebounced();
    });
    document.getElementById("date-next").addEventListener('click', function (el) {
        var potential_time = new Date(current_time.getTime() + 24*60*60000);

        if (isDateAfterTomorrow(potential_time)) return;
        current_time = potential_time;

        buildTimeSelector(current_time);
        fetchClassesDebounced();
    });
    document.getElementById("time-prev").addEventListener('click', function (el) {
        current_time = new Date(current_time.getTime() - 30*60000);
        if (current_time.getHours() < MIN_HOUR) {
            current_time = new Date(current_time.getTime() - 24*60*60000);
            current_time.setHours(MAX_HOUR - 1);
            current_time.setMinutes(30);
        }
        buildTimeSelector(current_time);
        fetchClassesDebounced();
    });
    document.getElementById("time-next").addEventListener('click', function (el) {
        var potential_time = new Date(current_time.getTime() + 30*60000);
        if (potential_time.getHours() >= MAX_HOUR) {
            potential_time = new Date(potential_time.getTime() + 24*60*60000);
            potential_time.setHours(MIN_HOUR);
            potential_time.setMinutes(0);
        }

        if (isDateAfterTomorrow(potential_time)) return;
        current_time = potential_time;

        buildTimeSelector(current_time);
        fetchClassesDebounced();
    });
}

function formatTime(d) {
    return d.toLocaleTimeString("ca", {timeStyle: 'short'});
    /* var str = "";
    str += d.getHours();
    str += ":";
    if (d.getMinutes() < 10) str += "0";
     str += d.getMinutes();
    return str; */
}

function formatDate(d) {
    return d.toLocaleDateString("ca");
}

function fetchClasses() {
    fetch(api_url + "getClassesInTime/" + current_time.getTime()/1000, {
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.payload.classes.length == 0) {
                document.getElementById('no-subjects').classList.remove('is-hidden');
                document.getElementById('subject-container').classList.add('is-hidden');
                document.getElementById('fme-maps-container').classList.add('is-hidden');
            } else {
                var transformedClasses = transformClasses(data.payload.classes);
                buildSubjectContainer(transformedClasses);
                document.getElementById('no-subjects').classList.add('is-hidden');
                document.getElementById('subject-container').classList.remove('is-hidden');
                document.getElementById('fme-maps-container').classList.remove('is-hidden');
            }

        });
}

const fetchClassesDebounced = debounce(fetchClasses, 400);

function onPageLoad() {
    var searchParams = new URLSearchParams(location.search);
    if (searchParams.has('apiUrl')) {
        var banner = document.getElementById('dev-mode');
        banner.classList.remove('is-hidden');
        api_url = searchParams.get('apiUrl') || 'https://covid-tracability-backend-dev.sandbox.avm99963.com/api/v1/'
    } else {
        api_url = "https://covid-tracability-backend-prod.sandbox.avm99963.com/api/v1/";
    }

    current_time = getDefaultTime();
    buildTimeSelector(current_time);

    // Check if user is signed in
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

    fetchClasses();
}

function sendForm() {
    // Add subject to user
    fetch(api_url + "addUserSubject", {
        "method": "POST",
        "body": JSON.stringify({
            subject: final_JSON.class.subject_id
        }),
        "mode": "cors",
        "credentials": "include"
    })
        .then(res => res.json())
        .then(json => {
            console.log("Subject added to user: ", json);

            var begins = new Date(parseInt(final_JSON.class.begins)*1000);
            var ends = new Date(parseInt(final_JSON.class.ends)*1000);

            var params = new URLSearchParams();
            params.append("entry." + idsFormulari.room, final_JSON.class.room); // class, number, letter
            params.append("entry." + idsFormulari.day, begins.getFullYear().toString() + '-' + (begins.getMonth() + 1).toString().padStart(2, "0") + '-' + begins.getDate().toString().padStart(2, "0"));
            params.append("entry." + idsFormulari.begins, formatTime(begins));
            params.append("entry." + idsFormulari.ends, formatTime(ends));
            params.append("entry." + idsFormulari.rows[final_JSON.letter], 'Columna ' + final_JSON.number);
            // params.append("entry." + idsFormulari.notes, '[Autogenerat per delefme/covid-tracability -- Assignatura seleccionada: ' + (final_JSON.class.friendly_name || final_JSON.class.calendar_name) + ']');

            var formulari_link = formBaseUrl + '?' + params.toString() + '#i1';
            window.location.href = formulari_link;
        });
}


function addEventListeners() {
    window.addEventListener('load', onPageLoad);

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

    document.getElementById("send-button").addEventListener('click', function (el) {
        document.getElementById("send-button").classList.add('is-loading');
        sendForm();
    });

    addDateEventListeners();
}

addEventListeners();
