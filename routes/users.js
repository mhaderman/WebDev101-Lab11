var express = require('express');
var router = express.Router();
var accountDal = require('../dal/account_dal');

/* GET users listing. */
router.get('/create', function(req, res, next) {
  res.render("userFormCreate", {subtitle: "test2"});
});

router.get('/save', function(req, res, next) {
  console.log(req.query);

  accountDal.Insert(req.query, function(err, result){
    if (err) {
      res.send(err);
    }
    else {
      accountDal.InsertAccountFoundBy(result.insertId, req.query.selectedOptions, function(err,result) {
          res.send("Successfully saved the data.");
      })
    }
  });
});

module.exports = router;
