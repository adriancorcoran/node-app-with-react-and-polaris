const schedule = require('node-schedule');
const User = require('../db/models/user-model');
const Workday = require('../db/models/workdays-model');
const Location = require('../db/models/locations-model');
const Attendee = require('../db/models/attendees-model');
const moment = require('moment');
const Sequelize = require('sequelize');
const request = require("request");
const env = require('dotenv').load();





moment.locale('en-gb');

module.exports = async function findWorkday(){

//Remind people they have a workday in 2 days
Workday.findAll({
  where: {
    start: {
      [Sequelize.Op.gt]: moment().add(1,'days').toDate(),
      [Sequelize.Op.lt]: moment().add(3,'days').toDate()
    }//date7.format('YYYY-MM-DD').toString().trim()
  }
}).then(dates => {
  console.log("dates", dates)
  dates.forEach((workday => {
    //get attendees and message them
    Attendee.findAll({
      where: {
        workday_id: workday.id
      }
    }).then(attendees => {
      console.log(attendees);
      attendees.forEach((attendee)=>{
        var options = { method: 'POST',
          url: 'https://slack.com/api/im.open',
          headers:
           {'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded' },
          form:
           { token: process.env.SLACKBOT_TOKEN,
             user: attendee.slack_id
              } };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          body = JSON.parse(body);
          if(typeof body.channel.id != "undefined"){
          console.log(body.channel.id);
            var options = { method: 'POST',
            url: 'https://slack.com/api/chat.postMessage',
            headers:
             { 'cache-control': 'no-cache',
               'Content-Type': 'application/x-www-form-urlencoded' },
            form:
             { token: process.env.SLACKBOT_TOKEN,
               channel: body.channel.id,
               text: `Reminder:  workday at ${workday.location_name} in two days at ${moment(workday.start).format("hA")}`
             }};

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
          });

        }});

      })
    })
  }))
});

//If there's a workday in 7 days message all interested users

Workday.findAll({
  where: {
    start: {
      [Sequelize.Op.gt]: moment().add(6,'days').toDate(),
      [Sequelize.Op.lt]: moment().add(8,'days').toDate()
    }//date7.format('YYYY-MM-DD').toString().trim()
  }
}).then(dates => {

  dates.forEach((workday => {
    User.findAll({
      where: {
        locations: {
          [Sequelize.Op.like]: '%'+workday.location_name +'%'
        }
      }
    }).then(users => {
      users.forEach((user)=>{
        var options = { method: 'POST',
          url: 'https://slack.com/api/im.open',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded' },
          form:
           { token: process.env.SLACKBOT_TOKEN,
             user: user.slack_id } };
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
               text: 'workday ID: '+ workday.id +" location: " + workday.location_name + " date: "+moment(workday.start).format('lll'),
               attachments:
                [ { text: 'Are you going to the workday next week?',
                    callback_id: 'attending',
                    color: '#3AA3E3',
                    attachment_type: 'default',
                    actions:
                     [ { name: 'attend', text: 'Yes', type: 'button', value: 'yes' },
                       { name: 'attend', text: 'No', type: 'button', value: 'no' } ] } ] },
            json: true };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
          });

        });

      })
    })
  }))
});

//Ask users on the day if they're checked in

Workday.findAll({
  where: {
    start: {
      [Sequelize.Op.gt]: moment().startOf('day').toDate(),
      [Sequelize.Op.lt]: new Date()
    }//date7.format('YYYY-MM-DD').toString().trim()
  }
}).then(dates => {
  dates.forEach((workday => {
    Attendee.findAll({
      where: {
        workday_id: workday.id
      }
    }).then(attendees => {
      attendees.forEach((attendee)=>{
        var options = { method: 'POST',
          url: 'https://slack.com/api/im.open',
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded' },
          form:
           { token: process.env.SLACKBOT_TOKEN,
             user: attendee.slack_id } };
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
                [ { text: 'Are you attending this pop-up office?',
                    callback_id: 'attending',
                    color: '#3AA3E3',
                    attachment_type: 'default',
                    actions:
                     [ { name: 'attend', text: 'Yes', type: 'button', value: 'yes' },
                       { name: 'attend', text: 'No', type: 'button', value: 'no' } ] } ] },
            json: true };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
          });

        });

      })
    })
  }))
});
}
// if its two days before a workday then get all attendees for those workdays and message them.
