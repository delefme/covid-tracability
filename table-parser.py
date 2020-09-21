import requests
from bs4 import BeautifulSoup

url = "https://fme-intranet.upc.edu/appsext/mrbs/web/day.php?year=2020&month=9&day=17&area=2"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')
table = soup.find(id="day_main")

hores = []
for h in range(8,22):
    newhour = ""
    if h < 10:
        newhour += "0"
    newhour += str(h);
    
    hores.append(newhour + ":00");
    hores.append(newhour + ":30");

for hora in hores:
    td_hora = table.find(text=hora).findNext('td')
    column = 1

    while hora not in td_hora.get_text():
        
        if "CDATA" not in td_hora.get_text():
            assignatura = td_hora.get_text().strip()
            aula = table.find_all("th")[column].get_text().strip()
            durada = int(td_hora.get("rowspan"))*30
            
            print(assignatura
                    + ", " + hora
                    + ", " + str(durada) + "mins"
                    + ", " + aula)
        
        td_hora = td_hora.findNext('td')
        column = column + 1
