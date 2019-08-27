const User = require('../db/models/user-model');
const Workday = require('../db/models/workdays-model');
const Location = require('../db/models/locations-model');
const Attendee = require('../db/models/attendees-model');
const moment = require('moment');
const Sequelize = require('sequelize');
const request = require("request");
const env = require('dotenv').load();
const router = require('express').Router();


router.post('/list-workdays', (req, res) => {

  res.send('Thanks! We will look up all the upcoming workdays and DM them to you!');
  console.log(req.body);
  User.findOne({
    where:{
      slack_id: req.body.user_id
    }
  }).then((user) => {
    console.log(user.dataValues.locations);
     locations = JSON.parse(user.dataValues.locations);
     Workday.findAll({
       where: {
         start: {
           [Sequelize.Op.gt]: moment().startOf('day').toDate(),
           [Sequelize.Op.lt]: moment().add(7,'days').toDate()
         },
         location_name: {
           [Sequelize.Op.in]: locations
         }
       }
     }).then((workdays) => {
       workdays.forEach((workday) => {
         workday = workday.dataValues;
         var options = { method: 'POST',
           url: 'https://slack.com/api/im.open',
           headers:{
             'Content-Type': 'application/x-www-form-urlencoded' },
           form:
            { token: process.env.SLACKBOT_TOKEN,
              user: req.body.user_id } };
         //if(typeof user.slack_id !=="undefined" && typeof body.channel.id !=="undefined"){
         request(options, function (error, response, body) {
           if (error) throw new Error(error);
           body = JSON.parse(body);
           console.log(body.channel.id);
           var options = { method: 'POST',
             url: 'https://slack.com/api/chat.postMessage',
             headers:
              {  'cache-control': 'no-cache',
                Authorization: 'Bearer '+ process.env.SLACKBOT_TOKEN,
                'Content-Type': 'application/json' },
             body:
              { channel: body.channel.id,
                text: 'workday ID: '+ workday.id +" location: *" + workday.location_name + "* date: *"+moment(workday.start).format('lll')+"*",
                attachments:
                 [ { text: 'Are you going to the workday next week?',
                     callback_id: 'attending',
                     color: '#3AA3E3',
                     attachment_type: 'default',
                     actions:
                      [ { name: 'attend', text: 'Yes', type: 'button', value: 'yes' },
                        { name: 'attend', text: 'No', type: 'button', value: 'no' } ] } ] },
             json: true };

           request(options, function (error, response, body) { if (error) throw new Error(error);});
         });

       })
     })
  });




});


module.exports = router;
