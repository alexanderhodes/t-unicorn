var options;

//###################################### functions for calculations ######################################

/**
 * This Function returns the options for the given id.
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

//###################################### ajax requests ###################################################

/**
 * gets all options from the database
 */
function getOptionData() {

  var reqsecurity_type = new XMLHttpRequest();
  reqsecurity_type.open("GET", base_url + "options",true);
  setHeader(reqsecurity_type);
  reqsecurity_type.send();
  reqsecurity_type.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      options = JSON.parse(this.responseText);
      getResultData();
    }
  };
}

/**
 * saves the changes of an option in the database.
 * @params{JSON} option
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

/**
 * This Function deletes an option in the database.
 * @params{number} id of option
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

/**
 * This Function adds a new option to the database.
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

//###################################### change HTML content #############################################

/**
 * This Function creates DOM Elements for admin tab "Optionen" and adds them to the page.
 * @returns{text} html_text DOM elements as string
 */
function buildHTMLOption() {

  let html = '';

  for(var i=0; i<options.length; i++) {
    html +=
      '<!-- Optiontext ' + i + ' -->'+
      '<div class="statement_title">'+
      '<span id="option_text'+options[i]._id+'" class="statementtext">' +
      '<b>Option: </b>' + options[i].option_text +
      '</span>'+
      '<!-- Buttons für die erste Option -->'+
      '<span class="statement_buttons">'+
      '<!-- Button Option 1 ändern-->'+
      '<button onclick="setOptionText(\''+options[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i id="option_edit'+options[i]._id+'" class="material-icons">mode_edit</i>'+
      '</button>'+
      /*'<!-- Button Option 1 löschen-->'+
      '<button onclick="deleteOption(\''+options[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i class="material-icons">delete</i>'+
      '</button>'+*/
      '</span>'+

      '<!-- Button Option 1 Valuation-->'+
      '<div  class="statement_options">'+
      '<span id="option_valuation'+options[i]._id+'" class="statementtext">' +
      '<b>Bewertung: </b>' + options[i].valuation +
      '</span>'+
      '<!-- Buttons für das erste Result -->'+
      '<span class="statement_button_points">'+
      '<!-- Button Produkt 1 ändern-->'+
      '<button onclick="setOptionValuation(\''+options[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i id="option_edit_valuation'+options[i]._id+'" class="material-icons">mode_edit</i>'+
      '</button>'+
      '</span>'+
      '</div>' +
      '</div>';
  }
  /*html +=   '<!-- Button Result hinzufügen-->'+
    '<div class="mdl-card__actions mdl-card--border add_statement_frame">'+
    '<button onclick="newOption()" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_statement">'+
    '<i class="material-icons">add</i>'+
    '</button>'+
    'Option hinzufügen'+
    '</div>';*/

  return html;
}

/**
 * This Function sets the text of an option in the database.
 * @params{number} index id of security type
 */
function setOptionText(optionId){
  let o = getOptionById(optionId);
  if($('#option_edit'+optionId).html()=='mode_edit'){
    $('#option_edit'+optionId).html('save');

    inputField =
      '<div class="group_edit edit_data">'+
      '<input type="text" id="newOptionText'+optionId+'" required value="'+ o.option_text +'">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#option_text'+optionId).html(inputField);
  } else {

    o.option_text = $('#newOptionText'+optionId).val();
    saveOption(o);
  }
}

/**
 * This Function sets the valuation of an option in the database.
 * @params{number} index id of security type
 */
function setOptionValuation(optionId){
  let o = getOptionById(optionId);
  if($('#option_edit_valuation'+optionId).html()=='mode_edit'){
    $('#option_edit_valuation'+optionId).html('save');

    inputField =
      '<div class="group_edit edit_data">'+
      '<input type="text" id="newOptionValuation'+optionId+'" required value="'+ o.valuation +'">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#option_valuation'+optionId).html(inputField);
  } else {

    o.valuation = $('#newOptionValuation'+optionId).val();
    saveOption(o);
  }
}
