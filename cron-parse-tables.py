import pyodbc
import configparser
from TableParser import TableParser
import datetime
import sys
import getopt

def main(argv):
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

    try:
        opts, args = getopt.getopt(argv, 'o:', ['offset='])
    except getopt.GetoptError:
        print('Usage: python cron-parse-tables.py -o <offset_in_days>')
        print('    The offset is the day relative to today that wants to be')
        print('    parsed. For instance, -1 is yesterday and 1 is tomorrow.')
        sys.exit(2)

    offset = 1
    for opt, arg in opts:
        if opt in ('-o', '--offset'):
            offset = arg
        else:
            print('Parameter \'' + opt + '\' not recognized.')
            print('')
            print('Run python cron-parse-tables.py to get help on how to use')
            print('this script.')

    offset = int(offset)

    print('Parsejant les classes ' +
        (('de fa ' if offset < 0 else 'de dins de ') +
        str(abs(offset)) + (' dia' if abs(offset) == 1 else ' dies') if offset != 0 else 'd\'avui'))

    tomorrow = datetime.date.today() + datetime.timedelta(days=offset)

    parser = TableParser('https://fme-intranet.upc.edu/appsext/mrbs/web/day.php')
    for area in [2, 6]:
        parser.parse(tomorrow.year, tomorrow.month, tomorrow.day, area, db)

if __name__ == "__main__":
    main(sys.argv[1:])
