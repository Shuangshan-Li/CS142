"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var async = require("async");

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
var SchemaInfo = require("./schema/schemaInfo.js");
var session = require("express-session");
var bodyParser = require("body-parser");
var multer = require("multer");
var processFormBody = multer({storage: multer.memoryStorage()}).single(
  "uploadedphoto"
);

var express = require("express");
var app = express();
const fs = require("fs");

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require("./modelData/photoApp.js").cs142models;

mongoose.connect("mongodb://localhost/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(
  session({secret: "secretKey", resave: false, saveUninitialized: false})
);
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log("/test called with param1 = ", request.params.p1);
  var param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error("Doing /user/info error:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an async
    // call to each collections. That is tricky to do so we use the async package
    // do the work.  We put the collections into array and use async.each to
    // do each .count() query.
    var collections = [
      {name: "user", collection: User},
      {name: "photo", collection: Photo},
      {name: "schemaInfo", collection: SchemaInfo},
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          var obj = {};
          for (var i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400) status.
    response.status(400).send("Bad param " + param);
  }
});

/*
 * Log a user in and create/store information to session state.
 * Session is created by middleware for all route.
 */
app.post("/admin/login", function (request, response) {
  console.log(request.session);
  let loginName = request.body.login_name;
  let password_input = request.body.password;
  User.findOne({login_name: loginName}).exec((e, user) => {
    if (e || !user) {
      console.log("User " + loginName + " not found!");
      response.status(400).send("login_name not valid");
      return;
    }
    if (user.password !== password_input) {
      console.log("password does not match!");
      response.status(400).send("password does not match!");
      return;
    }
    // User found and password matches
    // Store infomation into session state
    request.session.login_name = loginName;
    request.session.user_id = user._id;

    let {_id, first_name, last_name, login_name} = user;
    response.status(200).send({_id, first_name, last_name, login_name});
  });
});

app.post("/admin/logout", function (request, response) {
  request.session.destroy(function (e) {
    if (e) {
      response.status(400).send("failed to logout");
      return;
    }
    response.status(200).send("logged out!");
  });
});

/*
 * URL /user/list - Return all the User object.
 */
app.get("/user/list", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("you need to login first!");
    return;
  }
  User.find({}).exec((e, users) => {
    let result = JSON.parse(JSON.stringify(users));
    async.forEachOf(
      result,
      function (user, i, callback) {
        let {_id, first_name, last_name} = user;
        result[i] = {_id, first_name, last_name};
        callback();
      },
      (e) => {
        if (e) {
          console.log("Error Occured: " + e);
        } else {
          response.status(200).send(result);
        }
      }
    );
  });
  //   response.status(200).send(cs142models.userListModel());
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get("/user/:id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("you need to login first!");
    return;
  }
  let id = request.params.id;
  User.findOne({_id: id}).exec((e, user) => {
    if (e) {
      console.log("User with id: " + id + " not found!");
      response.status(400).send("Not found!");
      return;
    } else {
      let result = JSON.parse(JSON.stringify(user));
      let {_id, first_name, last_name, location, description, occupation} =
        result;
      result = {_id, first_name, last_name, location, description, occupation};
      response.status(200).send(result);
    }
  });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get("/photosOfUser/:id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("you need to login first!");
    return;
  }
  let id = request.params.id;
  Photo.find({user_id: id}).exec((e, photos) => {
    if (e) {
      console.log("Photos with for user " + id + " not found!");
      response.status(400).send("Not found!");
      return;
    }
    let result = JSON.parse(JSON.stringify(photos));
    async.forEachOf(
      result,
      function (photo, i, callback) {
        delete photo.__v;
        async.forEachOf(
          photo.comments,
          function (c, i, callback_2) {
            User.findOne({_id: c.user_id}).exec((e, user_of_comment) => {
              if (e) {
                response.status(400).send("user of comment not found!");
              } else {
                let {_id, first_name, last_name} = user_of_comment;
                photo.comments[i] = {
                  comment: c.comment,
                  date_time: c.date_time,
                  _id: c._id,
                  user: {
                    _id: _id,
                    first_name: first_name,
                    last_name: last_name,
                  },
                };
                callback_2();
              }
            });
          },
          (e) => {
            if (e) {
              console.log(JSON.stringify(e));
            } else {
              result[i] = photo;
              callback();
            }
          }
        );
      },
      (e) => {
        if (e) {
          response.status(500).send(JSON.stringify(e));
        } else {
          response.status(200).send(result);
        }
      }
    );
  });
});

app.post("/commentsOfPhoto/:photo_id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("please login first");
    return;
  }
  let photo_id = request.params.photo_id;
  let cur_user = request.session.user_id;

  let new_comment = request.body.comment;
  if (!new_comment) {
    response.status(400).send("invalid input");
    return;
  }

  Photo.findOne({_id: photo_id}).exec((err, photo) => {
    if (err) {
      response.status(400).send("invalid photo_id!");
      return;
    }
    let cur_time = new Date();
    photo.comments = photo.comments.concat([
      {comment: new_comment, date_time: cur_time, user_id: cur_user},
    ]);
    photo.save();
    response.status(200).send();
  });
});

app.post("/photos/new", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("please log in first");
  } else {
    processFormBody(request, response, function (err) {
      if (err || !request.file) {
        response.status(400).send("invalid file!");
        return;
      }
      let time = new Date().valueOf();
      let filename = "U" + String(time) + request.file.originalname;

      fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
        if (err) {
          response.status(400).send("unable to post new photo");
          return;
        }
        Photo.create(
          {
            file_name: filename,
            date_time: time,
            user_id: request.session.user_id,
            comments: [],
          },
          function (err, newPhoto) {
            if (err) {
              response.statusMessage(400).send("unable to post new photo");
              return;
            }
            newPhoto.save();
            response.status(200).send();
          }
        );
      });
    });
  }
});

app.post("/user", function (request, response) {
  let {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  User.findOne({login_name}).exec((err, user) => {
    if (user) {
      response.status(400).send("Username already taken!");
      return;
    }
    if (err) {
      response.status(400).send(err.response.body);
      return;
    }
    User.create(
      {
        login_name,
        password,
        first_name,
        last_name,
        location,
        description,
        occupation,
      },
      function (err, newUser) {
        if (err) {
          response.status(400).send("Unable to register new user.");
          return;
        }
        request.session.login_name = login_name;
        request.session.user_id = newUser._id;
        response
          .status(200)
          .send({_id: newUser._id, first_name, last_name, login_name});
      }
    );
  });
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
