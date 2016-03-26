
function ajax_error(jqXHR,textStatus,error){
  var stat_p = $('#status>p');
  console.log("ERROR");
  console.log(textStatus);
  console.log(error);
  stat_p.text("Ajax Error");
  stat_p.removeClass();
  stat_p.addClass('bg-danger');
}

function ajax_success(data,textStatus,jqXHR){
  var stat_p = $('#status>p');
  console.log("SUCCESS");
  console.log(data);
  if(data['status'] == 'accepted'){
    stat_p.text("PIN Accepted. Server is rebooting in 5 seconds.");
    stat_p.removeClass();
    stat_p.addClass('bg-success');
  }else{
    stat_p.text("PIN rejected");
    stat_p.removeClass();
    stat_p.addClass('bg-warning');
  };
}

function fire(){
  pin = $('#pin').val();
  console.log(pin);
  $.ajax(
    "/reboot",
    {
      'method': 'POST',
      'data': {'pin': pin},
      'dataType': 'json',
      'error': ajax_error,
      'success': ajax_success
    }
  );
}
