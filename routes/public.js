var express = require('express');
var router = express.Router();
const path = require("path");

//if / is accessed, return the index.html file in the public folder
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html') );
});

router.get('/*', function(req, res, next) {
    //The client will have the ability to access any file in public/
    res.sendFile(path.resolve('public/' + req.url) );
});


module.exports = router;