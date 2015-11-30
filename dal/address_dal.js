var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

//connection.config.queryFormat = function (query, values) {
//    if (!values) return query;
//    return query.replace(/\:(\w+)/g, function (txt, key) {
//        if (values.hasOwnProperty(key)) {
//            return this.escape(values[key]);
//        }
//        return txt;
//    }.bind(this));
//};

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM address;',
        function(err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetByID = function(address_id, callback) {
    console.log(address_id);
    var query = 'SELECT * FROM address WHERE address_id=' + address_id;
    console.log(query);
    connection.query(query,
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

exports.Update = function(address_info, callback) {
    console.log(address_info);
    var values = [address_info.street, address_info.city,address_info.state_abbr,address_info.zip,address_info.address_id];
    connection.query('UPDATE address SET street = ?, city = ?, state_abbr = ?, zip = ? WHERE address_id = ?', values,
        function(err, result) {
    //connection.query('UPDATE address SET street = :street, city = :city, state_abbr = :state_abbr, zip = :zip WHERE address_id = :address_id', address_info, function(err, result) {
        if(err) {
            console.log(err);
            callback(err);
            return;
        }
        exports.GetByID(address_info.address_id, function(err, result) {
            if(err) {
                console.log(err);
                callback(err);
                return;
            }
            callback(false, result);
        })
    });

}
