//Admin Settings Page:


/**
 * This function sets when page is loaded
 */
$(document).ready(function() {
  //redirect to home when user isnt logged in
  isAuthorized();
  valid();

  var user = JSON.parse(window.sessionStorage.getItem("user"));

  //load data
  getStatementsData();


  $(".change_passwort").on('click touch', function() {
    changePassWindow();
  });


  bindCatalogEvents();
  bildAdminSettingsPageLayout();
  showMail(user.email);


  /**
   * This function sets OnClick events when button is pressed
   */
  $(".catalog_name").on('click touch', function() {
    if($(this).hasClass("unactive"))
    {
      $(".active_catalog").remove();
      $(this).removeClass("unactive");
      $( "<i class='material-icons active_catalog'>check_circle</i>").insertAfter($(this));

    }
    else if($(this).hasClass("active")) {}
    bindCatalogEvents();
  });

  /**
   * This function add events to set catalogs active/unactive
   */
  function bindCatalogEvents(){
    $(".catalog_name").hover(function() {
      if($(this).hasClass("unactive"))
      {
        $( "<i class='material-icons unactive_catalog'>check_circle</i>").insertAfter($(this));

      }
    });

    $(".catalog_name").mouseleave(function() {
      $(".unactive_catalog").remove();
    });
  }

  //Save new Password
  $("#save_pass_button").on('click touch', function (){
    let old_pass = $("#old_pass").val();
    let new_pass1 = $("#new_pass_1").val();
    let new_pass2 = $("#new_pass_2").val();

    let user = window.sessionStorage.getItem("user");

    if(new_pass1 === new_pass2){
      setPassword(user, old_pass, new_pass1);
    } else {
      let errTxt = "Neue Passwörter stimmen nicht überein.";
      $("#error_frame_pass").html(errTxt +"<i class=\"material-icons wrong_icon\">thumb_down</i>");
    }

  });

  //Methode zum Abruf von der "Passwort vergessen" Ansicht -> in einem Popup Fenster
  function changePassWindow()
  {
    alert("Passwort ändern");
    $("#user_frame").html("<input type=\"text\" id=\"admin_unsername\" required>"+
      "<span class=\"highlight\"></span><span class=\"bar_name\"></span><label>Altes Passwort</label>");
    $("#admin_unsername").attr("readonly");
    $("#error_frame").html("");
    var change_pass="<div class=\"group\">"+
      "<input type=\"password\" id=\"admin_password_1\" required><span class=\"highlight\"></span>"+
      "<span class=\"bar_passwort\"></span><label>Neues Passwort</label></div>"+
      "<div class=\"group\"><input type=\"password\" id=\"admin_password_2\" required>"+
      "<span class=\"highlight\"></span><span class=\"bar_passwort\"></span><label>Passwort wiederholen</label></div>";
    $(".password_frame").html(change_pass);
  }

  $(".logout_link").on('click touch', function() {
    logoutAdmin();
  });


});

/*
 *This function controls if the user is logged in, if not he will be redirected to the login page.
 */
function valid () {
  if (sessionStorage.length <= 1) {
    window.location.href= url + "admin";
  } else {

  }
}

/**
 * replaces the default HTML content in tab "Einstellungen", where you can change your e-mail.
 * Now, the current e-mail from the database is represented
 * @param {String} mail the user's e-mail
 */
function showMail(mail) {
  console.log("showMail");
  var mail_content = "<div id=\"mail\" class=\"mdl-card__actions mdl-card--border settings_frame grey-font\">" +
    "Aktuelle E-mail Adresse: " +"<span style='color:#303F9F'>"+ mail +"</span>"+
    "<div class=\"new_Email_frame\">" +
    "<div class=\"group\" id=\"gr_email\">" +
    "<input type=\"text\" id=\"new_email\" required>" +
    "<span class=\"highlight\"></span>" +
    "<span class=\"bar_name\"></span>" +
    "<label>Neue E-mail Adresse</label>" +
    "</div>" +
    "<button id=\"save_email_button\" type=\"button\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect admin_button\">Speichern </button>" +
    "</div>" +
    "</div>";


  $("#changeMail").html(mail_content);

  ConnectEventsAufSaveButton();
}


/**
 * sets the function "setEmail" to be executed by clicking on the button "save_email_button"
 */
function ConnectEventsAufSaveButton(){
  $("#save_email_button").on('click touch', function() {
    console.log("click");
    var mail =$("#new_email").val();
    var user = window.sessionStorage.getItem("user");
    setEmail(user,mail);
  });
}

/*
*This function redirects to the login page and clears the session storage.
*/
function logoutAdmin(){
  window.location.href= url + "admin";
  sessionStorage.clear();
}

/**
 * Setze neues Passwort vie HTTP-PUT-Request
 * @param user {json}
 * @param old_pass {string}
 * @param new_pass {string}
 */
function setPassword(user, old_pass, new_pass){
  let params = {_id: user._id, oldPassword: old_pass, newPassword: new_pass};
  $.ajax({
    type: "PUT",
    url: base_url + "users/" + user._id + "/password",
    data: params,
    dataType: "json",
    beforeSend: setHeader,
    success: function(){
      $("#old_pass").val("");
      $("#new_pass_1").val("");
      $("#new_pass_2").val("");
      let errTxt = "Passwort wurde gesetzt.";
      $("#error_frame_pass").html(errTxt +"<i class=\"material-icons wrong_icon\">thumb_up</i>");
    },
    error: function (){
      let errTxt = "Passwort ist nicht korrekt.";
      $("#error_frame_pass").html(errTxt +"<i class=\"material-icons wrong_icon\">thumb_down</i>");
    }
  });
}

/**
 * stores the value of newEmail into the user object
 * and shows the new e-mail
 * @param {JSONObject} user the user who is currently logged in
 * @param {String} newEmail any String from the "new_email"-field
 */

function setEmail(user, newEmail){
  console.log("setEmail");
  let params = {_id: user._id, newEMail: newEmail};
  $.ajax({
    type: "PUT",
    url: base_url + "users/" + user._id + "/email",
    data: params,
    dataType: "json",
    beforeSend: setHeader
  });

  //update sessionStorage
  $.ajax({
    type: "GET",
    url: base_url + "users/me",
    dataType: "json",
    success: function (response) {
      var user = {
        email: response.email,
        name: response.name,
        _id: response.id
      };

      if (typeof(Storage) !== "undefined") {
        // Code für sessionStorage:
        window.sessionStorage.setItem("user", JSON.stringify(user));
      }
      else {
        //kein Support (passiert ganz selten)
      }
    },
    beforeSend: setHeader
  });

  showMail(newEmail);
}


/**
 * This function creates DOM elements for admin settings layout and adds them to the page
 */
function bildAdminSettingsPageLayout(){
  var layout='<section class="mdl-layout__tab-panel is-active" id="scroll-tab-1">' + '<div class="page-content">' +

    '<!-- Content für Tab Fragenkatalog -->' +
    '<div id="catalog_content" class="mdl-grid">' + '<div class="mdl-cell--12-col mdl-card mdl-shadow--2dp">' +
    '<div class="mdl-card__title">' + '<h2 class="mdl-card__title-text title_card">Übersicht der Checkliste</h2>' +
    '</div>' + '<div class="mdl-card__actions mdl-card--border settings_frame">' +
    '<div id="checklist" class="mdl-grid">' + '' + '</div>' + '</div>' + '</div>' +
    '</div>' + '</div>' + '</section>' +

    '<!-- Tab Produkt -->' +
    '<section class="mdl-layout__tab-panel" id="scroll-tab-2">' + '<div class="page-content">' +
    '<!-- Content für Tab Produkt -->' + '<div id="product_content" class="mdl-grid">' +
    '<div class="mdl-cell--12-col mdl-card mdl-shadow--2dp">' + '<div class="mdl-card__title">' +
    '<h2 class="mdl-card__title-text title_card">Übersicht der Ergebnisse</h2>' + '</div>' +
    '<div class="mdl-card__actions mdl-card--border settings_frame">' +
    '<div id="results_container" class="mdl-grid">' + '<div class="mdl-cell--12-col mdl-card mdl-shadow--2dp catalog">' +
    '<div id="result_container" class="mdl-card__actions mdl-card--border">' + '</div>' + '</div>' + '</div>' + '</div>' +
    '</div>' + '</div>' + '</div>' + '</section>' +

    '<!-- Tab Optionen -->' +
    '<section class="mdl-layout__tab-panel" id="scroll-tab-3">' + '<div class="page-content">' +
    '<!-- Content für Tab Sectype -->' + '<div id="security_type_content" class="mdl-grid">' +
    '<div class="mdl-cell--12-col mdl-card mdl-shadow--2dp">' + '<div class="mdl-card__title">' +
    '<h2 class="mdl-card__title-text title_card">Übersicht der Optionen</h2>' + '</div>' +
    '<div class="mdl-card__actions mdl-card--border settings_frame">' +
    '<div id="options_container" class="mdl-grid">' + '<div class="mdl-cell--12-col mdl-card mdl-shadow--2dp catalog">' +
    '<div id="option_container" class="mdl-card__actions mdl-card--border">' + '</div>' + '</div>' + '</div>' + '</div>' +
    '</div>' + '</div>' + '</div>' + '</section>' +

    '<!-- Tab Admin Einstellungen -->' +
    '<section class="mdl-layout__tab-panel" id="scroll-tab-4">' + '<div class="page-content">' +
    '<!-- Content für Tab Admin Einstellungen -->' + '<div id="settings_content" class="mdl-grid">' +
    '<!-- Karte "Email ändern" -->' + '<div class="mdl-cell--4-col mdl-card mdl-shadow--2dp settings_cards">' +
    '<div class="mdl-card__title">' + '<h2 class="mdl-card__title-text title_card">E-mail Adresse ändern</h2>' +
    '</div>' + '<div id="changeMail">' + '<div id="mail" class="mdl-card__actions mdl-card--border settings_frame grey-font">' +
    '<!-- Text Feld für die alte Email Adresse -->' + 'Aktuelle E-mail Adresse: test@telekom.de' +
    '<div class="new_Email_frame">' + '<!-- Input Feld für die neue Email Adresse -->' + '<div class="group" id="gr_email">' +
    '<input type="text" id="new_email" required>' + '<span class="highlight"></span>' +
    '<span class="bar_name"></span>' + '<label>Neue E-mail Adresse</label>' + '</div>' +
    '<!-- Button zum Speichern -->' +
    '<button id="save_email_button" type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect admin_button">' +
    'Speichern' + '</button>' + '</div>' + '</div>' + '</div>' + '</div>' + '<!-- Karte "Passwort ändern" -->' +
    '<div class="mdl-cell--4-col mdl-card mdl-shadow--2dp settings_cards">' + '<div class="mdl-card__title">' +
    '<h2 class="mdl-card__title-text title_card">Passwort ändern</h2>' + '</div>' +
    '<div class="mdl-card__actions mdl-card--border settings_frame">' +
    '<!-- Input Feld für das alte Passwort -->' + '<div class="group" id="gr_old_pass">' +
    '<input type="password" id="old_pass" required>' + '<span class="highlight"></span>' +
    '<span class="bar_name"></span>' + '<label>Altes Passwort</label>' + '</div>' +
    '<!-- Input Feld für das neue Passwort -->' + '<div class="group" id="gr_new_pass_1">' +
    '<input type="password" id="new_pass_1" required>' + '<span class="highlight"></span>' +
    '<span class="bar_name"></span>' + '<label>Neues Passwort</label>' + '</div>' +
    '<!-- Input Feld für das neue Passwort -->' + '<div class="group" id="gr_new_pass_2">' +
    '<input type="password" id="new_pass_2" required>' + '<span class="highlight"></span>' +
    '<span class="bar_name"></span>' + '<label>Passwort wiederholen</label>' + '</div>' +
    '<!-- Button zum Speichern -->' + '<button id="save_pass_button" type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect admin_button">' + 'Passwort ändern' + '</button>' +
    '<div id="error_frame_pass"></div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</section>';
  $(".content_all").html(layout);
}
