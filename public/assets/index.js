var ping = {};
ping.ajax_error = function(jqXHR, textStatus, error) {
  console.log("ping error");
  console.log(textStatus);
  var stat_p = $('#status>p');
  stat_p.text("Ping Failed. Retrying in 2s");
  stat_p.removeClass();
  stat_p.addClass('bg-warning');
  setTimeout(ping.ajax,2000);
};

ping.ajax_success = function(data, textStatus, jqXHR) {
  console.log(data);
  var stat_p = $('#status>p');
  stat_p.text("Server Available");
  stat_p.removeClass();
  stat_p.addClass('bg-success');
};
ping.ajax = function(){
  $.ajax(
    "/ping",
    {
      method: 'POST',
      dataType: 'json',
      error: ping.ajax_error,
      success: ping.ajax_success
    }
  );
};

var reboot = {};

reboot.ajax_error = function(jqXHR,textStatus,error){
  var stat_p = $('#status>p');
  console.log("ERROR");
  console.log(textStatus);
  console.log(error);
  stat_p.text("Ajax Error");
  stat_p.removeClass();
  stat_p.addClass('bg-danger');
};

reboot.ajax_success = function(data,textStatus,jqXHR){
  var stat_p = $('#status>p');
  console.log("SUCCESS");
  console.log(data);
  if(data['status'] == 'accepted'){
    stat_p.text("PIN Accepted. Server is rebooting in 5 seconds.");
    stat_p.removeClass();
    stat_p.addClass('bg-info');
    setTimeout(ping.ajax,10000);
  }else{
    stat_p.text("PIN rejected");
    stat_p.removeClass();
    stat_p.addClass('bg-warning');
  };
};

reboot.ajax = function(){
  pin = $('#pin').val();
  //console.log(pin);
  $.ajax(
    "/reboot",
    {
      'method': 'POST',
      'data': {'pin': pin},
      'dataType': 'json',
      'error': reboot.ajax_error,
      'success': reboot.ajax_success
    }
  );
};

var shutdown = {};

shutdown.ajax_error = reboot.ajax_error;

shutdown.ajax_success = function(data, textStatus, jqXHR){
  var stat_p = $('#status>p');
  if(data['status'] == 'accepted'){
    stat_p.text("PIN Accepted. Server is shutting down in 5 seconds.");
    stat_p.removeClass();
    stat_p.addClass('bg-success');
  }else{
    stat_p.text("PIN rejected");
    stat_p.removeClass();
    stat_p.addClass('bg-warning');
  };
};

shutdown.ajax = function(){
  pin = $('#pin').val();
  $.ajax(
    "/shutdown",
    {
      'method': 'POST',
      'data': {'pin': pin},
      'dataType': 'json',
      'error': shutdown.ajax_error,
      'success': shutdown.ajax_success
    }
  );
};
