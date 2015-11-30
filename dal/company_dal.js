var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    // NOTE: CompanyView is a View I created.
    // CREATE OR REPLACE VIEW CompanyView AS SELECT c.company_id, c.name, a.street, a.city, a.state_abbr, a.zip FROM company c JOIN address a on c.address_id = a.address_id;
    var query = 'SELECT * FROM CompanyView';

    console.log(query);

    connection.query(query, function(err, result) {
        if(err) {
            console.log(err);
            callback(true);
            return;
        }
        callback(false, result);
    });
}

exports.GetByID = function(company_id, callback) {
    console.log(company_id);
    var query = 'SELECT * FROM company WHERE company_id= ?';
    console.log(query);
    connection.query(query, [company_id],
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.Insert = function(company_info, callback) {
    var query_data = [company_info.name, company_info.address_id];
    var query = 'INSERT INTO company (name, address_id) VALUES (?, ?);'
    //NOTE: The addresses already exist we only need to save the id to the company table

    console.log(query);
    connection.query(query, query_data, function(err, result) {
        if(err){
            console.log(err)
            callback(err);
            return;
        }
        else {
            callback(err, result);
        }
    })
}

exports.Update = function(company_info, callback) {
    var query_data = [company_info.name, company_info.address_id, company_info.company_id];
    var query = 'UPDATE company SET name = ?, address_id = ? WHERE company_id = ?';
    connection.query(query, query_data, function(err, result) {
       if(err){
           console.log(err)
           callback(err);
           return;
       }
        else {
           callback(err, result);
       }
    });
}

exports.Delete = function(company_id, callback) {
    var query = 'DELETE FROM company WHERE company_id = ' + company_id;
    connection.query(query, function(err, result){
        if(err){
            console.log(err)
            callback(err);
            return;
        }
        else {
            callback(err, result);
        }

    });
}