var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    striptags = require('striptags');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', function (req, res) {

  request.get('https://' + process.env.BIBLE_API_KEY + ':X@bibles.org/v2/search.js?version=eng-KJV&query=' + req.body.text, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      var results = JSON.parse(body),
          result = results.response.search.result;

      if (result.passages) {
        var verse = results.response.search.result.passages[0],
            text = striptags(verse.text).replace(/[0-9]/g, "\n");

        res.json({
          response_type: "in_channel",
          text: verse.display,
          attachments: [
            {
              "text": text,
              "color": "#9DDCE4"
            }
          ]
        });
      } else {
        res.json({ text: "We didn't understand that query!" });
      }

    } else {
      console.error(error);
    }

  });

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Doctrines slack bot listening at http://%s:%s', host, port);
});
