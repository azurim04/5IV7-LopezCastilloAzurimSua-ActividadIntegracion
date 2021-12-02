var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'cafecancion',
    user: 'root',
    password: 'Violetta2004',
});

connection.connect(function(error) {
    if (error) {
        console.log(error.code);
        console.log(error.fatal);
    } else {
        console.log('Se pudo conectar correctamente')
    }
});

module.exports = connection;