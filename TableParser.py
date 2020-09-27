import requests
from bs4 import BeautifulSoup
import pyodbc
import re
from datetime import datetime, timedelta
import pytz

class TableParser:
    TIMEZONE = 'Europe/Madrid'
    EMPTY_CELL_CLASSES = ['row_labels', 'even_row', 'odd_row']

    def __init__(self, baseUrl):
        self.baseUrl = baseUrl

    def parse(self, year, month, day, area, db = None):
        url = self.baseUrl
        params = {
            'year': year,
            'month': month,
            'day': day,
            'area': area
        }
        page = requests.get(url, params=params)
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

        p = re.compile(r"Aula (\S+) ?\(\d*\)", re.IGNORECASE)

        for hora in hores:
            td_hora = table.find(text=hora).findNext('td')
            column = 1

            while hora not in td_hora.get_text():

                classes = td_hora['class'];
                if td_hora.has_attr('class') and not td_hora['class'][0] in self.EMPTY_CELL_CLASSES:
                    assignaturaRaw = td_hora.get_text().strip()
                    assignatura = assignaturaRaw.lower()
                    aulaRaw = table.find_all("th")[column].get_text().strip()
                    aula = p.match(aulaRaw).group(1)
                    durada = int(td_hora.get("rowspan"))*30

                    timeSplit = hora.split(':')

                    begins = datetime(year, month, day, int(timeSplit[0]), int(timeSplit[1]))
                    begins = pytz.timezone(self.TIMEZONE).localize(begins)
                    ends = begins + timedelta(minutes=durada)

                    print(("Afegint " if db != None else "") + assignaturaRaw
                            + ", " + hora
                            + ", " + str(durada) + "mins"
                            + ", " + aula)

                    if db != None:
                        cursor1 = db.cursor()
                        cursor1.execute("SELECT id FROM classes WHERE calendar_name = ? AND room = ? AND begins = ? AND ends = ?",
                                assignatura, aula, begins, ends)
                        row = cursor1.fetchone()
                        if row:
                            print("[WARNING] Ja estava a la DB (id " + str(row.id) + ")")
                        else:
                            cursor2 = db.cursor()
                            cursor2.execute("INSERT INTO classes (calendar_name, room, begins, ends) VALUES (?, ?, ?, ?)",
                                    assignatura, aula, begins, ends)

                td_hora = td_hora.findNext('td')
                column = column + 1

        if db != None:
            db.commit()
