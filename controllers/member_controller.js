
/* This backend file extends route.js, defines the jobs each route requires. */

var express = require('express'),
  app = express(),
  jwt = require('jsonwebtoken'),
  config = require('../config'),
  Member = require('../models/member'),
  User = require('../models/user');

app.set('secretKey', config.secret);

module.exports = {
  // Get all the records
  getall: function(req, res, next) {
    Member.find({}) // Find all members
      // 'members' is what I choose to call what is returned from the find func
      .then(function (members) {
        return res.send(members);
      }) // send it
      .catch(function (data) {
        return res.send(data);
      }); // in case of err, run the next thing, don't hang up here
  },

  // Get just one record by id
  getone: function(req, res, next) {
    // id matches :id from routes.js put method, carried in on params
    var memberId = req.params.id;
    Member.findById({ _id: memberId })
      .then(function (member) {
        return res.send(member);
      })
      .catch(next);
  },

  // Create a new record
  create: function(req, res, next) {
    var memberProperties = req.body; // var = entire request body sent in
    Member.create(memberProperties) // create a new mem record out of the var
      .then(function (member) {
        return res.send(member);
      })
      .catch(next);
  },

  // Add a new user
  createuser: function(req, res, next) {
    var userProperties = req.body; // var = entire request body sent in
    User.findOne({ email: userProperties.email})
      .then(function(user) {
        if(user) {
          res.json({ success: false, message: 'That email is already registered.'});
        } else {
          User.create(userProperties) // create a new user record out of the var
            .then(function (user) {
              return res.send(user);
            });
        }
      })
      .catch(next);
},

  // Edit just one record
  edit: function(req, res, next) {
    var memberId = req.params.id;
    var memberProperties = req.body; // req.body brings in the updated data
    // Update Member with new properties
    Member.findByIdAndUpdate({ _id: memberId }, memberProperties)
      .then(function() {
        Member.findById({ _id: memberId });
      }) // Find the updated Member
      .then(function (member) {
        return res.send(member);
      })
      .catch(next);
  },

  // Delete just one record
  delete: function(req, res, next) {
    var memberId = req.params.id;
    var memberProperties = req.body;
    Member.findByIdAndRemove({ _id: memberId })
      // 204 = Server has fulfilled the request, & there is no additional info
      .then(function (member) {
        return res.status(204).send(member);
      })
      .catch(next);
  },

  // The only purpose of this is load the page under checktoken in routes.js
  loadAddPage: function(req, res, next) {
  },

  // Log in
  gettoken: function(req, res) {
    var userEmail = req.body.email;
    User.findOne({ email: userEmail },
    function(err, user) {
    if (err) throw err;
    if (!user) {
        res.json({ success: false, message: 'That email isn\'t in our records' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'I don\'t recognize that password.' });
      } else {
        // if member is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('secretKey'), {
          expiresIn: 60*60*24 // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
        });
      }
    }
    });
  },

  // route middleware to verify a token
  checktoken: function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('secretKey'), function(err, decoded) {
        if (err) {
          return res.status(401).send({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {
      // if there is no token, send 401 to controllers.js on the front-end
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }
};
