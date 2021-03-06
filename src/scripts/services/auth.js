// Fake authentication lib
/*jshint -W030 */

'use strict';

function pretendRequest(email, pass, cb) {
  setTimeout(function () {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7),
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
}

var auth = {
  login: function (email, pass, cb) {
    cb = arguments[arguments.length - 1];

    if (localStorage.token) {
      cb && cb(true);
      this.onChange(true);
      return;
    }

    pretendRequest(email, pass, function (res) {
      if (res.authenticated) {
        localStorage.token = res.token;
        cb && cb(true);
        this.onChange(true);
      } else {
        cb && cb(false);
        this.onChange(false);
      }
    }.bind(this));
  },

  getToken: function () {
    return localStorage.token;
  },

  logout: function (cb) {
    delete localStorage.token;
    cb && cb();
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },

  onChange: function () {}
};

module.exports = auth;
