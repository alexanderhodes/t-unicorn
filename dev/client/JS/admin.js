var token;

/*
*This function activates the login button if 'Enter' is pressed.
*/
  $(document).on('keyup',function(e){
    if (e.which == 13){
      $("#login_button").click();
    }
  });

/**
 * This function sets events when page is loaded
 */
$(document).ready(function() {


  $("#login_button").on('click touch', function() {
    var params = {name:$("#admin_unsername").val(),password:$("#admin_password").val()};

    $.ajax({
      type: "POST",
      url: url + "auth/local",
      data: params,
      success: function (response) {
        saveUserTokenToSession(response);
        let nurl = url + "admin/settings";
        window.location.href = nurl+'?access_token='+response.token;
      },
      error: function (response) {
        //Fehlermeldung ausgeben - Nutzername stimmt nicht !
        $("#error_frame").html("Sie sind kein Admin oder das eingegebene Passwort ist falsch<i class=\"material-icons wrong_icon\">thumb_down</i>");
      },
      dataType: "json"
    });

  });

  $("#admin_unsername").on('click', function() {
    $("#error_frame").html("");
  });
  $("#admin_password").on('click', function() {
    $("#error_frame").html("");
  });
});

function setHeader(xhr) {
  xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.getItem('token'));
}

/**
 *  save user token to sessionStorage
 * @param res
 */
function saveUserTokenToSession(res) {

  var user = {
    email: res.email,
    name: res.name,
    _id: res.id
  };

  let token = res.token;

  if (typeof(Storage) !== "undefined") {
    // Code für sessionStorage:
    window.sessionStorage.setItem("user", JSON.stringify(user));
    window.sessionStorage.setItem("token", token);
  }
}

// check if authorized, otherwise redirect to login
function isAuthorized(){
  $.ajax({
    type: "GET",
    url: url + "admin/settings",
    beforeSend: setHeader,
    success: function () {},
    error: function (response) {
    //window.location.href = url+ 'admin';
  },
  dataType: "json"
});
}
