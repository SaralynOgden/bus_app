(function() {
  'use strict';

  $('#login-form').submit((event) => {
    event.preventDefault();

    const firstName = $('#first_name').val().trim();
    const lastName = $('#last_name').val().trim();
    const email = $('#email').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val();

    if (!firstName) {
      return Materialize.toast('First name must not be blank', 3000);
    }

    if (!lastName) {
      return Materialize.toast('Last name must not be blank', 3000);
    }

    if (!email) {
      return Materialize.toast('Email must not be blank', 3000);
    }

    if (!password) {
      return Materialize.toast('Password must not be blank', 3000);
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      dataType: 'json',
      type: 'POST',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        window.location.href = '/favorites.html';
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });
})();
