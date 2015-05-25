function getCurrentTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    callback(tabs[0].url);
  });
}

function getSettings(team, success, failure) {
  var settingsUrl = 'https://' + team + '.slack.com/account/settings';
  var x = new XMLHttpRequest();
  x.open('GET', settingsUrl);
  //x.responseType = 'json';
  x.onload = function() {

    var response = x.response;
    if (!response) {
      failure('No response!');
      return;
    }
    success(response);
  };
  x.onerror = function() {
    failure('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var team = url.match(/^https:\/\/(.*).slack.com/)[1];
    console.log('team: ' + team);
    getSettings(team, function (response) {
      var div = document.createElement('div');
      div.innerHTML = response;
      var crumb = div.querySelector('#change_username input[name=crumb]').value;
      var username = div.querySelector('#change_username input[name=username]').value;
      username = username.slice(-4) === '_off' ? username.slice(0, -4) : username + '_off';

      xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://' + team + '.slack.com/account/settings');
      xhr.onload = function () {
        var div = document.createElement('div');
        div.innerHTML = xhr.response;
        var alert = div.querySelector('.alert');
        var info = document.getElementById('info');
        info.replaceChild(alert, info.firstChild);
      };
      xhr.onerror = function () {
        console.error('error sent');
      };
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      var send = 'change_username=1&username=' + username + '&crumb=' + crumb;
      xhr.send(send);

    }, function (failure) {
      console.error('failure: ' + failure);
    });
  });
});