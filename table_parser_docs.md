# Com utilitzar la classe TableParser?
1. Instal·lar Python 3 i PIP3
2. Instal·lar les següents llibreries: configparser, datetime, bs4, pytz, requests

Per parsejar les classes per un dia concret, es pot utilitzar el següent codi Python:

```
from TableParser import TableParser
parser = TableParser('https://fme-intranet.upc.edu/appsext/mrbs/web/day.php')
parser.parse(2020, 09, 28, 2)
```

## Com configurar el cron script?
Per poder escriure a la base de dades les classes del dia següent s'ha de fer el següent addicionalment:
1. Instal·lar la llibreria pyodbc
2. Instal·lar el connector MySQL ODBC (https://dev.mysql.com/doc/connector-odbc/en/connector-odbc-installation.html)
3. Copiar l'arxiu `config.ini.default` a `config.ini` i introduir les credencials i informació de la base de dades.
4. Configurar cron perquè s'executi l'script `cron_table_parser.py` un cop cada dia.

