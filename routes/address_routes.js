var express = require('express');
var router = express.Router();
var addressDal = require('../dal/address_dal');

/* return a drop down of all the address */
router.get('/', function(req, res, next) {
    //res.send('hello');
    addressDal.GetAll( function(err, result) {
        if(err) {
            console.log(err);
            res.send('there was an error');
        }
        console.log(result);
        res.render('address/address_list',
            { rs: result,
                title: 'this is a title'
        });
    });
});

router.get('/view', function(req, res, next) {
    console.log(req.query.address_id);
    addressDal.GetByID(req.query.address_id,
        function(err, result) {
        res.render('address/address_info.ejs', {rs: result, another_value: 'test'});
    });
});

router.get('/edit', function(req, res, next) {
    addressDal.GetByID(req.query.address_id, function(err, result) {
        res.render('address/address_edit.ejs', {rs: result});
    });
});

router.get('/update', function(req, res, next) {
    addressDal.Update(req.query, function(err, result) {
        var alert_class = 'alert-success';
        var message = "Successfully Updated!";

        if(err) {
            alert_class = 'alert-danger';
            message = err;
        }
        console.log(result);
        res.render('address/address_edit.ejs', {rs: result, alert_class:alert_class, message: message});
    });
});

module.exports = router;

