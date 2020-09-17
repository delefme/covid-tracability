let hores = [], newhour;
for (let h = 8; h < 22; ++h) {
    newhour = "";
    if (h < 10) newhour += "0";
    newhour += h.toString();
    
    hores.push(newhour + ":00");
    hores.push(newhour + ":30");
}

hores.forEach(hora => {
    let column = 1;
    let td = $("td:contains(" + hora + ")").next();

    while (td.text().indexOf(hora) == -1) {
        
        if (td.text().indexOf("CDATA") == -1) {
            let aula = $("#day_main th")[column].textContent.trim();
            let durada = parseInt(td.attr("rowspan"))*30;
            
            console.log(td.text()
                + ", " + hora
                + ", " + durada + "mins"
                + ", " + aula);
        }
        
        td = td.next();
        ++column;
    }
});
