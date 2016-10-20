/* eslint-disable no-undef */
'use strict';

(function() {
  $('#signup-form').submit((event) => {
    event.preventDefault();

    const firstName = $('#first-name').val().trim();
    const lastName = $('#last-name').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val();

    if (!firstName || !firstName.trim()) {
      return Materialize.toast('First name must not be blank', 3000);
    }

    if (!lastName || !firstName.trim()) {
      return Materialize.toast('Last name must not be blank', 3000);
    }

    if (!email || !firstName.trim()) {
      return Materialize.toast('Email must not be blank', 3000);
    }

    if (email.indexOf('@') === -1) {
      return Materialize.toast('Email must be valid', 3000);
    }

    if (!password || !firstName.trim()) {
      return Materialize.toast(
        'Invalid password',
        3000
      );
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ firstName, lastName, email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/users'
    };

    $.ajax(options)
      .done(() => {
        window.location.href = '/login.html';
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });
})();
