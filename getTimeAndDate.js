
function getTimeAndDate() {
      // Hora d'inici
      hora_actual.setMinutes(0, 0, 0); // Arrodonir per baix els minuts
      minuts = hora_actual.getMinutes() < 10 ? hora_actual.getMinutes().toString() + '0' : hora_actual.getMinutes().toString();
      document.getElementById("inici").innerHTML = hora_actual.getHours().toString() + ":" + minuts;

      // Hora de fi
      hora_actual.setHours(hora_actual.getHours() + 1); // Sumar una hora
      minuts = hora_actual.getMinutes() < 10 ? hora_actual.getMinutes().toString() + '0' : hora_actual.getMinutes().toString();
      document.getElementById("fi").innerHTML = hora_actual.getHours().toString() + ":" + minuts;

      // Data
      dia = hora_actual.getDate();
      mes = hora_actual.getMonth() + 1;
      any = hora_actual.getFullYear();
      data = dia.toString() + '/' + mes.toString() + '/' + any.toString();
}

function getDayFormat() {
      dia = hora_actual.getDate();
      if(dia < 10) return "0" + dia;
      else return "" +dia;
}

function getMonthFormat() {
      mes = hora_actual.getMonth() + 1;
      if(mes < 10) return "0" + mes;
      else return "" + mes;
}

function getYearFormat() {
      any = hora_actual.getFullYear();
      return "" +any;
}