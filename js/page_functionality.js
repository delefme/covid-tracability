
var current_section = "section-1";

function switchSection(s) {
    setTimeout(function(){ 
        document.getElementById(current_section).classList.add('hidden');
        document.getElementById(s).classList.remove('hidden');
        current_section = s;
    }, 75);
}

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
      params.append("entry." + idsFormulari.begins, formatDate(begins));
      params.append("entry." + idsFormulari.ends, formatDate(ends));
      params.append("entry." + idsFormulari.rows[final_JSON.letter], 'Columna ' + final_JSON.number);
      // params.append("entry." + idsFormulari.notes, '[Autogenerat per delefme/covid-tracability -- Assignatura seleccionada: ' + (final_JSON.class.friendly_name || final_JSON.class.calendar_name) + ']');

      var formulari_link = formBaseUrl + '?' + params.toString() + '#i1';
      window.location.href = formulari_link;
    });
 }
 
 document.getElementById("send-button").addEventListener('click', function (el) {              
    document.getElementById('send-button').classList.add('is-loading');

    sendForm();
 });

