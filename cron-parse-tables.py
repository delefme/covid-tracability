import pyodbc
import configparser
from TableParser import TableParser
import datetime

config = configparser.ConfigParser()
config.read('config.ini')

db_host = config['db']['host']
db_database = config['db']['database']
db_user = config['db']['user']
db_password = config['db']['password']

connection_string = (
    'DRIVER=MySQL ODBC 8.0 ANSI Driver;'
    'SERVER=' + db_host + ';'
    'DATABASE=' + db_database + ';'
    'UID=' + db_user + ';'
    'PWD=' + db_password + ';'
    'charset=utf8mb4;'
)

db = pyodbc.connect(connection_string)
db.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
db.setencoding(encoding='utf-8')

tomorrow = datetime.date.today() + datetime.timedelta(days=1)

parser = TableParser('https://fme-intranet.upc.edu/appsext/mrbs/web/day.php')
for area in [2, 6]:
    parser.parse(tomorrow.year, tomorrow.month, tomorrow.day, area, db)
