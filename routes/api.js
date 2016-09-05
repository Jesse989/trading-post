var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Item = mongoose.model('Item');


function isAuthenticated (req, res, next) {
    //allow all get request methods
    if (req.isAuthenticated()){
        return next();
    }
    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
}

router.use('/', isAuthenticated);



router.route('/profile')
    //retrieve user profile
    .get(function(req, res){
        User.findOne({username: req.body.username})
        .populate('items')
        .exec(function(err, user){
            if(err) return err;
            res.status(200).json(user);
        });
    })

    //update user profile
    .post(function(req, res){
        User.findOne({username: req.body.username})
        .exec(function(err, user){
            if(err) return err;
            if(user){
                user.name = req.body.name;
                user.address = req.body.address;
                user.city = req.body.city;
                user.zip = req.body.zip;
                user.state = req.body.state;
                user.save(function(err, user){
                    if(err) return err;
                    return res.json(user);
                });
            } else {
                res.status(404).send('no user to update');
            }
        });
    }) 
    //remove user
    .delete(function(req, res) {
        User.remove({
            username: req.body.username
        }, function(err) {
            if (err)
                return res.send(err);
            res.json("deleted :(");
        });
    });
    
router.route('/item')
    //get list of all items
    .get(function(req, res){
        Item.find()
        .populate('current_owner proposed_owner')
        .exec(function(err, item) {
            if(err) throw err;
            res.status(200).json(item);
        });
    })
    //add item
    .post(function(req, res){
        Item.findOne({_id: req.body._id}, function(err, success){
            if(err) throw err;
            if(success){
                success.name = req.body.name;
                success.description = req.body.description;
                success.image = req.body.image;
                success.value = req.body.value;
                success.current_owner = req.body.current_owner;
                success.proposed_owner = req.body.proposed_owner;
                success.category = req.body.category;
                success.save(function(err, success){
                    if(err) throw err;
                    res.status(200).json(success);
                });
            }
            else {
                var item = new Item;
                item.name = req.body.name;
                item.description = req.body.description;
                item.image = req.body.image;
                item.value = req.body.value;
                item.current_owner = req.body.current_owner;
                item.proposed_owner = req.body.proposed_owner;
                item.category = req.body.category;
                item.save(function(err, success){
                    if(err) throw err;
                    res.status(200).send('item added succesfully');
                });
            }
        });
    });
   
    
router.route('/item/:id')
    //get individual item
    .get(function(req, res){
        Item.findOne({_id: req.params.id})
        .exec(function(err, item) {
            if(err) throw err;
            res.status(200).json(item);
        });
    })
        //delete item
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                return res.send(err);
            res.json("deleted :(");
        });
    }); 
    
module.exports = router;