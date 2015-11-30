var express = require('express');
var router = express.Router();
var accountDal = require('../dal/account_dal');
var addressDal = require('../dal/address_dal');

router.get('/all', function(req, res) {
  accountDal.GetAll(function (err, result) {
          if (err) throw err;

          res.render('displayAllAccounts.ejs', {rs: result});
        }
    );
});

router.get('/', function (req, res) {
  accountDal.GetByID(req.query.account_id,
      function (err, result) {
          if (err) throw err;

          accountDal.GetAddress(req.query.account_id, function(err, addressResults){

              res.render('displayAccountInfo.ejs', {
                  rs: result,
                  account_id: req.query.account_id,
                  addressResults: addressResults}
              );

          })

        }
    );
});

router.get('/new_address', function(req, res){
    console.log(req.query.account_id);
    addressDal.GetAll(function(err, addressResults){
        console.log(addressResults);
        res.render('account/add_new_address', {
            addressResults: addressResults,
            account_info: req.query
        });
    })


});

router.get('/save_new_address', function(req, res){
    console.log(req.query);

    accountDal.AddAddress(req.query, function(err, result){
       if(err) {
           res.send('Error saving address to user: ' + err);
       }
        else {
           res.send('Successfully associated address with the user.');
       }
    });
})

module.exports = router;
