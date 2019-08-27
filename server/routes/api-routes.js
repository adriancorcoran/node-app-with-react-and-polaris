const router = require("express").Router();
const request = require("request");
const env = require("dotenv").load();
const User = require("../db/models/user-model");
const Workday = require("../db/models/workdays-model");
const Location = require("../db/models/locations-model");
const Attendee = require("../db/models/attendees-model");
const db = require("../db/database");
const Sequelize = require("sequelize");
const moment = require("moment");

router.get("/current-user", (req, res) => {
  User.findOne({
    where: {
      googleID: req.user.googleID
    }
  }).then(user => {
    res.json(user);
  });
});

router.post("/add-locations", (req, res) => {
  res.send("OK");
  User.update(
    {
      locations: req.body.locations,
      dietary_requirements: req.body.dietary_requirements
    },
    {
      where: {
        googleID: req.body.googleID.trim()
      }
    }
  );
});

router.post("/add-workday", (req, res) => {
  res.send("OK");
  var data = {
    start: req.body.start,
    end: req.body.end,
    location_name: req.body.location_name
  };
  Workday.findOrCreate({
    defaults: data,
    where: {
      start: req.body.start.trim(),
      end: req.body.end.trim(),
      location_name: req.body.location_name.trim()
    }
  }).then(workday => {
    console.log(workday);
  });
});

//Create a location
router.post("/add-location", (req, res) => {
  res.send("OK");
  console.log(req.body);
  data = {
    name: req.body.name.trim(),
    address: req.body.address.trim()
  };
  Location.findOrCreate({
    defaults: data,
    where: {
      name: req.body.name,
      address: req.body.address
    }
  }).then(workday => {
    console.log(workday);
  });
});

//5 most recent workdays
router.get("/upcoming-workdays", (req, res) => {
  Workday.findAll({
    order: [["start", "ASC"]],
    where: {
      start: {
        [Sequelize.Op.gt]: Sequelize.fn("current_date")
      }
    },
    limit: 5
  }).then(user => {
    res.json(user);
  });
});

//List of LOCATIONS

router.get("/locations", (req, res) => {
  Location.findAll({
    order: [["name", "ASC"]]
  }).then(user => {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(user);
  });
});

//Grab list of workdays based on filter params
// 10, 30, 60, 120
router.get("/past-workdays", (req, res) => {
  var lastDate = moment("2000-07-03 17:23:05").toDate();
  console.log(req.body);
  if (req.body.last) {
    lastDate = moment()
      .subtract(req.body.last.trim(), "days")
      .toDate();
  }
  console.log(lastDate);
  Workday.findAll({
    order: [["start", "ASC"]],
    where: {
      start: {
        [Sequelize.Op.gt]: lastDate
      },
      end: {
        [Sequelize.Op.lt]: moment().toDate()
      }
    }
  }).then(workdays => {
    console.log(workdays);
    res.json(workdays);
  });
});

//Future Workdays

router.get("/future-workdays", (req, res) => {
  Workday.findAll({
    order: [["start", "ASC"]],
    where: {
      start: {
        [Sequelize.Op.gte]: moment()
          .startOf("day")
          .toDate()
      }
    }
  }).then(workday => {
    res.json(workday);
  });
});

//Fetch all attendees of a workday

router.post("/workday-attendees", (req, res) => {
  console.log(req.body);
  Attendee.findAll({
    attributes: [
      [Sequelize.literal("DISTINCT `user_id`"), "user_id"],
      "name",
      "checked_in",
      "dietary_requirements"
    ],
    where: {
      workday_id: req.body.workday_id
    }
  }).then(attendees => {
    res.json(attendees);
  });
});

//Add Attendee for slack
router.post("/add-attendee", (req, res) => {
  console.log(req.body);
  res.send("OK");
  Attendee.findOrCreate({
    defaults: {
      workday_id: req.body.workday_id,
      checked_in: req.body.checked_in,
      user_id: req.body.user_id,
      name: req.body.name,
      dietary_requirements: req.body.dietary_requirements
    },
    where: {
      workday_id: req.body.workday_id,
      user_id: req.body.user_id,
      name: req.body.name
    }
  }).then(function(newAttendee, created) {
    console.log(newAttendee, created);
  });
});

router.post("/slack-interact", (req, res) => {
  console.log(req.body.payload);
  payload = JSON.parse(req.body.payload);
  console.log(payload.actions[0].value);
  if (payload.actions[0].value.trim() == "yes") {
    console.log(payload.original_message.text);

    User.findOne({
      where: {
        slack_id: payload.user.id
      }
    }).then(user => {
      var regID = /workday ID: (\d+)/g;
      workdayID = parseInt(regID.exec(payload.original_message.text)[1]);
      Attendee.findOrCreate({
        defaults: {
          workday_id: workdayID,
          checked_in: 0,
          user_id: user.id,
          name: user.displayName,
          dietary_requirements: user.dietary_requirements,
          slack_id: user.slack_id
        },
        where: {
          workday_id: workdayID,
          user_id: user.id,
          name: user.displayName
        }
      }).then(newAttendee => {
        //workday ID: 99 location: *galway* date: *18 Jun 2019 07:00*
        var isCheckin = /Are you attending this pop-up office\?/g;
        var getLocation = /workday ID: \d+ location: \*(\w*?)\*/g.exec(
          payload.original_message.text
        )[1];
        var getDate = /workday ID: \d+ location: \*\w+\* date: \*([a-zA-Z \d:]*?)\*/g.exec(
          payload.original_message.text
        )[1];
        //console.log(getDate.exec(payload.original_message.text)[1]);
        if (!newAttendee[0].isNewRecord && isCheckin.test(req.body.payload)) {
          Attendee.update(
            {
              checked_in: 1
            },
            {
              where: {
                id: newAttendee[0].dataValues.id
              }
            }
          );
          res.send(`Thanks for attending!`);
        } else {
          res.send(`see you at the ${getLocation} popup on ${getDate}`);
        }
      });
    });
  } else {
    res.send(
      `Boooooooooooo... if you change your mind, type /list-popups to see upcoming dates`
    );
  }
  //res.send(`seems there was an error, please make sure you're signed up on Attend-ease at attend-ease.shopifycloud.com`);
});

router.get("/location-info", (req, res) => {
  Location.findOne({
    where: {
      id: req.query.location_id
    }
  }).then(location => {
    console.log(" location ", location);
    //console.log(req);
    res.json(location); //json(location);
  });
});
//delete workday(s)
router.delete("/delete-workdays", (req, res) => {
  res.status(200).send("OK");
  console.log(req.body);
  //body = JSON.parse(req.body);
  //console.log(body.workdays)
  Workday.destroy({
    where: {
      id: {
        [Sequelize.Op.in]: JSON.parse(req.body.workdays)
      }
    }
  });
});

//delete location(s)
router.delete("/delete-locations", (req, res) => {
  res.status(200).send("OK");
  console.log(req.body);
  //body = JSON.parse(req.body);
  //console.log(body.workdays)
  Location.destroy({
    where: {
      id: {
        [Sequelize.Op.in]: JSON.parse(req.body.locations)
      }
    }
  });
});

//update a location
router.put("/update-location", (req, res) => {
  res.status(200).send("OK");
  console.log(req.body);
  //body = JSON.parse(req.body);
  //console.log(body.workdays)
  Location.update(
    {
      name: req.body.name,
      address: req.body.address.trim()
    },
    {
      where: {
        id: req.body.id
      }
    }
  );
});
//return all users
router.get("/users", (req, res) => {
  console.log(req.body);
  User.findAll().then(attendees => {
    res.json(attendees);
  });
});

// update a user
router.put("/update-user", (req, res) => {
  res.status(200).send("OK");
  console.log(req.body);
  //console.log(body.workdays)
  User.update(
    {
      admin_level: req.body.admin_level
    },
    {
      where: {
        id: req.body.id
      }
    }
  );
});

module.exports = router;
