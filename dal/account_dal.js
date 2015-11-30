var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM account;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        }
    );
}


exports.GetByID = function(account_id, callback) {
    console.log(account_id);
    var query = 'SELECT * FROM account WHERE account_id=' + account_id;
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

/* NOTE: Just like functions in other languages the parameters sent to a function do not need to have the same names
 as the function definition. In this case, I'm sending the "req" parameter from the router to exports.Insert(),
 but exports.Insert() has defined this input parameter as "account_info"

 the callback parameter is an anonymous function passed like a parameter, that will be run later on within
 this function.
 */
exports.Insert = function(account_info, callback) {
    /* this console.log() will print out the account information that the function receives.  this is useful
     to see if the information I think i'm sending to this function is really being received.
     */
    console.log(account_info);

    /* we are dynamically building a sql string using string concatenation.  We'll see other ways to do this soon.
     NOTE: each value in this example is a string.  And in SQL we have to wrap strings in quotes.
     */
    var dynamic_query = 'INSERT INTO account (firstname, lastname, email, password, biography) VALUES (' +
        '\'' + account_info.firstname + '\', ' +
        '\'' + account_info.lastname + '\', ' +
        '\'' + account_info.email + '\', ' +
        '\'' + account_info.password + '\', ' +
        '\'' + account_info.bio + '\'' +
    ');';

    /* this console.log() will print out the query I'm about to send to the MySQL server via the connection.query() method.
       this log message can be copied and pasted into MySQL workbench to see if there are any SQL syntax errors.
     */
    console.log(dynamic_query);

    // connection.query(query, is where the SQL string we built above is actually sent to the MySQL server to be run
    connection.query(dynamic_query,
        /* we are passing this function as an input variable to connection.query().  MySQL will run the query
         and send back the records you are used to seeing in MySQL workbench as an array of JavaScript objects.
         This is also referred to as a result set or record set.

         After that is complete it will execute the function() we are defining below.  If we pass in a function with
         two arguments, in this case we have named them err (or error) and result, the connection.query() function
         will populate the first argument with any errors that were returned by the MySQL server and it will
         populate the second argument with the result set array.
         */
        function (err, result) {

            // if the err parameter isn't null or 0, then it will run the code within the if statement
            if(err) {
                /* this section of code prints out the error to the console and then runs the function that was
                 passed to exports.Insert().
                 */
                console.log(err);
                callback(err, null);
                return;
            }

            /* if there were no errors, it runs the function that was passed to exports.Insert() with the arguments
             false (for no errors) and the result set.  The actual function that is being run was defined by the
             section of code that called exports.Insert() to begin with.
             */

            callback(false, result);
        }
    );
}

/*  View to return addresses associated with a user account.
See AddAddress for information on creating the lookup table.

CREATE OR REPLACE VIEW AccountAddressView AS
SELECT a.account_id, ad.street, ad.city, ad.state_abbr, ad.zip FROM account a
JOIN account_address aa ON a.account_id = aa.account_id
JOIN address ad ON ad.address_id = aa.address_id;
*/
exports.GetAddress = function(account_id, callback){
    console.log(account_id);

    var query = 'SELECT * FROM AccountAddressView WHERE account_id = ' + account_id;

    connection.query(query, function(err, result){
        callback(err, result);
    })
}


/* To create the User Account and Address lookup table run the following SQL.  Note the ON DELETE CASCADES.
 Depending on your table schemas you may need to change table and column names.

 drop table if exists account_address;
 create table account_address (address_id int,
 account_id int,
 primary key(account_id, address_id),
 foreign key (account_id) references account(account_id) ON DELETE CASCADE,
 foreign key (address_id) references address(address_id) ON DELETE CASCADE);
 */

exports.AddAddress = function(info, callback) {
    console.log(info);

    var query_data = [info.account_id, info.address_id];
    console.log(query_data);

    var query = 'INSERT INTO account_address (account_id, address_id) VALUES (?, ?)';
    console.log(query);

    connection.query(query, query_data, function(err, result){
        callback(err, result);
    });

}

exports.GetByEmail = function(email, callback) {
    var query = 'CALL Account_GetByEmail(?)';
    var query_data = [email];

    connection.query(query, query_data, function(err, result) {
        if(err){
            callback(err, null);
        }
        //NOTE: Stored Procedure results are wrapped in an extra array and only one user record should be returned,
        //      so return only the one result
        else if(result[0].length == 1) {
            callback(err, result[0][0]);
        }
        else {
            callback(err, null);
        }
    });
}

exports.GetFoundByOptions = function(callback) {
    connection.query("SELECT * FROM foundby;", function(err, result) {
        callback(err, result);
    });
}

exports.GetAccountFoundyBy = function(account_id, callback) {
    connection.query("SELECT * FROM account_foundby WHERE account_id = ?", [account_id],
        function(err, result) {
            callback(err,result);
        });
}

exports.InsertAccountFoundBy = function(account_id, selectedOptions, callback) {
    var query_data = [];
    for(var i = 0 ; i < selectedOptions.length; i++) {
        query_data.push([account_id, selectedOptions[i]]);
    }

    var query = 'INSERT INTO account_foundby (account_id, foundby_id) VALUES ?';
    console.log(query_data);
    connection.query(query, [query_data], function(err, result){
        console.log(result);
        callback(err,result);
    });
}