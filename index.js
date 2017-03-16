const https = require('https');
const prompt = require('prompt');

var accessToken = "3466892025.023690e.155d19dac70e4e8f82f140ff5261b7c4";

var options = {
  hostname: 'api.instagram.com',
  port: 443,

  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};


console.log('***********Find places on a longitude and latitude using Instagram API************\n\n')

var properties = [{
  name: 'longitude',
  message: 'Type here the longitude to search '
}, {
  name: 'latitude',
  message: 'Type here the latitude to search '
}];

function promptingFunct() {
  prompt.start();

  prompt.get(properties, function(err, result) {
    if (err) {
      return onErr(err);
    }

    console.log('  You entered Longitude: ' + result.longitude);
    console.log('  You entered Latitude: ' + result.latitude + '\n\n');
    makeRequestToInstagram(result.longitude, result.latitude);

  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
}
promptingFunct();


function makeRequestToInstagram(long, lat) {
  options.path = '/v1/locations/search?lat=' + lat + '&lng=' + long + '&access_token=' + accessToken;
  var responseData = '';
  var req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      responseData += chunk
    });
    res.on('end', () => {
      var chucnkParsed = JSON.parse(responseData);
      if (typeof chucnkParsed.data !== 'undefined') {
        console.log('Places on Longitude ' + long + ' and Latitude ' + lat + ' is/are: ');
        for (var i = 0; i < chucnkParsed.data.length; i++) {
          var obj = chucnkParsed.data[i];
          var crunchifyName;
          var crunchifyValue;

          for (var key in obj) {
            crunchifyName = key;
            crunchifyValue = obj[key].toString();
            if (crunchifyName !== 'id') {
              console.log(crunchifyName + ' : ' + crunchifyValue);
            }
          }
          console.log('\n');
        }
      }else{
      	console.log('Longitude must not be over 180 and Latitude must not be over 90\n');
      	promptingFunct();
      }
      
      
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  req.end();
}
