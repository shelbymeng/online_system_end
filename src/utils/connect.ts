import mysql from 'mysql';
import { mysqlConfig } from '../config';

export const connection = mysql.createConnection(mysqlConfig);
connection.connect(() => {
    console.log('mysql connect success!');
});
