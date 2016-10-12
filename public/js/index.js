'use strict';

$(function() {
  const signup = function() {
    $('.app-description').hide();
    $('#form-container').fadeIn('slow');
    $('.copyright').css('margin-top', '50px');
  };

  $('#signup').click(signup);
});
