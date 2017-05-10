var options;

/* This Function gets all options from the database.
 * @returns{array} security_type security types as array
 */
function getOptionData() {

  var reqsecurity_type = new XMLHttpRequest();
  reqsecurity_type.open("GET", base_url + "options",true);
  setHeader(reqsecurity_type);
  reqsecurity_type.send();
  reqsecurity_type.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      options = JSON.parse(this.responseText);
      $("#option_container").html(buildHTMLOption());
    }
  };
}
/* This Function sets the titel of a security type in the database.
 * @params{number} index id of security type
 */
function setOptionText(optionId){
  let o = getOptionById(optionId);
    if($('#option_edit'+optionId).html()=='mode_edit'){
      $('#option_edit'+optionId).html('save');

    inputField =
      '<div class="group edit_data">'+
      '<input type="text" id="newOptionText'+optionId+'" required value="'+ o.option_text +'">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#option_text'+optionId).html(inputField);
  } else {

      o.option_text = $('#newOptionText'+optionId).val();
      saveOption(o);
  }
}
/* This Function adds a new option to the database.
 */
function newOption(){
  params = {
    option_text: "Text für die Option einfügen",
    valuation: 0
  };

  $.ajax({
    type: "POST",
    url: base_url + "options/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getOptionData();
    }
  });
}


/* This Function deletes a security type in the database.
 * @params{number} index id of security type
 */
function deleteOption(optionId){
  $.ajax({
    type: "DELETE",
    url: base_url + "options/"+optionId,
    beforeSend: setHeader,
    success: function (response) {
      getOptionData();
    }
  });
}
/* This Function returns the options for the given id.
 * @params{number} id of option
 * @returns{JSON} option
 */
function getOptionById(id) {
  for(var i = 0; i<options.length; i++){
    if(options[i]._id == id){
      return options[i];
    }
  }
}
/* saves the changes of an option in the database.
 * @params{array} sectype security type as array
 */
function saveOption(option) {
  $.ajax({
    type: "PUT",
    url: base_url + "options/" + option._id,
    data: option,
    beforeSend: setHeader,
    success: function (response) {
      getOptionData();
    }
  });
}

/* This Function creates DOM Elements for admin tab "Optionen" and adds them to the page.
 * @returns{text} html_text DOM elements as string
 */
function buildHTMLOption() {

  let html = '';

  for(var i=0; i<options.length; i++) {
     html +=
       '<!-- Resulttext ' + i + ' -->'+
       '<div class="statement_title">'+
       '<span id="option_text'+options[i]._id+'" class="statementtext">' +
       '<b>Option: </b>' + options[i].option_text +
       '</span>'+

       '<!-- Buttons für das erste Result -->'+
       '<span class="statement_buttons">'+

       '<!-- Button Produkt 1 ändern-->'+
       '<button onclick="setOptionText(\''+options[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
       '<i id="option_edit'+options[i]._id+'" class="material-icons">mode_edit</i>'+
       '</button>'+

       '<!-- Button Produkt 1 löschen-->'+
       '<button onclick="deleteOption(\''+options[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
       '<i class="material-icons">delete</i>'+
       '</button>'+
       '</span>'+
       '</div>';
  }
    html +=   '<!-- Button Result hinzufügen-->'+
      '<div class="mdl-card__actions mdl-card--border add_statement_frame">'+
      '<button onclick="newOption()" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_statement">'+
      '<i class="material-icons">add</i>'+
      '</button>'+
      'Option hinzufügen'+
      '</div>';

  return html;
}


