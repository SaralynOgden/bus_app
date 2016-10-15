'use strict';

$.getJSON('/token')
  .done((loggedIn) => {
    if (loggedIn) {
      const $logout = $('#log-out');

      $logout.click((event) => {
        event.preventDefault();

        const options = {
          dataType: 'json',
          type: 'DELETE',
          url: '/token'
        };

        $.ajax(options)
          .done(() => {
            window.location.href = '/index.html';
          })
          .fail(() => {
            Materialize.toast('Unable to log out. Please try again.', 3000);
          });
      });
    }
  })
  .fail(($xhr) => {
    Materialize.toast($xhr.responseText, 3000);
  });

// window.QUERY_PARAMETERS = {};
//
// if (window.location.search) {
//   window.location.search.substr(1).split('&').forEach((paramStr) => {
//     const param = paramStr.split('=');
//
//     window.QUERY_PARAMETERS[param[0]] = param[1];
//   });
// }
