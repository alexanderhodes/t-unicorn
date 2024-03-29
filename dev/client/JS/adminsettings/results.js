var results;

//###################################### functions for calculations ######################################

/**
 * Lade result aus globaler variable results anhand der ID
 *
 * result ID
 * @param id {string}
 *
 * Gebe JSON von passendem result zurück
 * @returns {*}
 */
function getResultById(id) {
  for(var i = 0; i<results.length; i++){
    if(results[i]._id == id){
      return results[i];
    }
  }
}

//###################################### ajax requests ###################################################

/**
 *  Lade Results per HTTP GET-Request und speichere in globaler variable results
 */
function getResultData() {

  // Lade Produkte und speichere in products
  var reqResults = new XMLHttpRequest();
  reqResults.open("GET", base_url + "results",true);
  setHeader(reqResults);
  reqResults.send();
  reqResults.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      results = JSON.parse(this.responseText);
      setHTMLForChecklist();
      finilizeDragAndDrop();
      $("#option_container").html(buildHTMLOption());
      $("#result_container").html(buildResultListHTML());
    }
  };
}

/**
 * Überschreibe ein Result in der DB mit dem mitgeschickten Result in JSON-Form
 * @param result {*}
 */
function saveResult(result) {
  $.ajax({
    type: "PUT",
    url: base_url + "results/" + result._id,
    data: result,
    beforeSend: setHeader,
    success: function (response) {
      getResultData();
      getStatementsData();
    }
  });
}

/**
 * Lösche Result anhand der result_id aus der Datenbank per HTTP-DELETE-Request
 * @param result_id {string}
 */
function deleteResult(result_id){
  $.ajax({
    type: "DELETE",
    url: base_url + "results/"+result_id,
    beforeSend: setHeader,
    success: function (response) {
      getResultData();
      getStatementsData();
    },
    error: function (response) {
    }
  });
}

/**
 * Speichere neues Result in Datenbank per HTTP-POST-Request
 */
function newResult(){
  params = {
    risk_text: "Neuen Risiko Kurztext eingeben",
    risk_short_text: "Neuen Risiko Text eingeben",
    chance_text: "Neuen Chance Kurztext eingeben",
    chance_short_text: "Neuen Chance Text eingeben"
  };

  $.ajax({
    type: "POST",
    url: base_url + "results/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getResultData();
      getStatementsData();
    }
  });
}

//###################################### change HTML content #############################################

/**
 * Erstelle für jedes Result eine HTML-Card
 *
 * Gibt HTML-Cards aller Produkte als String zurück
 * @returns {string}
 */
function buildResultListHTML(){
  let html = '';

  var i = 0;
  results.forEach(function (result) {
    i++;
    html +=
      //Titel
      '<div class="statement_title margin_result">'+
      '<b>'+ i +'. Ergebnis:</b>'+
      '<!-- Button Produkt 1 löschen-->'+
      '<button onclick="deleteResult(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i class="material-icons">delete</i>'+
      '</button>'+

       //Short-Text
      '<div class="div_parent"><div class="div_text result_text"><p id="result_text_short' + result._id + '" class="statementtext">' + result.chance_short_text +'<b>:</b>'+
      '</p></div>' +
      '<!-- Buttons für das erste Result -->' +
      '<div class="div_button"><button onclick="setResultChanceShortText(\'' + result._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
      '<i id="result_edit_short' + result._id + '" class="material-icons">mode_edit</i>' +
      '</button>' +
      '</div></div>'+

      //Long Chance Text
      '<div class="div_parent margin_long"><div class="div_text result_text"><p id="result_text' + result._id + '" class="statementtext"><b>+ </b>' + result.chance_text +
      '</p></div>' +
      '<!-- Button Produkt 1 ändern-->' +
      '<div class="div_button"><button onclick="setResultChanceText(\'' + result._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
      '<i id="result_edit' + result._id + '" class="material-icons">mode_edit</i>' +
      '</button>' +
      '</div></div>'+

      //short risk text
      '<div class="div_parent"><div class="div_text result_text"><p id="result_text_risk_short'+result._id+'" class="statementtext">' +' '+ result.risk_short_text + '<b>:</b>' +
      '</p></div>'+
      '<div class="div_button"><button onclick="setResultRiskShortText(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i id="result_edit_risk_short'+result._id+'" class="material-icons">mode_edit</i>'+
      '</button>'+
      '</div></div>'+

      //long risk text
      '<div class="div_parent margin_long"><div class="div_text result_text"><p id="result_text_risk'+result._id+'" class="statementtext"><b>- </b>' +' '+ result.risk_text +
      '</p></div>'+
      '<div class="div_button"><button onclick="setResultRiskText(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i id="result_edit_risk'+result._id+'" class="material-icons">mode_edit</i>'+
      '</button>'+
      '</div></div>';

    html+= '</div>';
  });

  html +=

    '<!-- Button Result hinzufügen-->'+
    '<div class="mdl-card__actions mdl-card--border add_statement_frame">'+
    '<button onclick="newResult()" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_statement">'+
    '<i class="material-icons">add</i>'+
    '</button>'+
    'Ergebnis hinzufügen'+
    '</div>';

  return html;
}

/**
 * Ändere Result Chance Text via HTTP-PUT-Request
 * @param result_id {string}
 */
function setResultChanceText(result_id){
  let r = getResultById(result_id);
  if($('#result_edit'+result_id).html()=='mode_edit'){
    $('#result_edit'+result_id).html('save');

    inputField =
      '<div style="margin-top: 16px; margin-bottom: 26px;" class="group_edit">'+
      '<textarea class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"' +
      'cols="120" rows="3" id="newResultText'+result_id+'" required></textarea>'+
      '</div>';

    $('#result_text'+result_id).html(inputField);
    document.getElementById('newResultText'+result_id+'').innerHTML = r.chance_text;
  } else {
    r.chance_text = document.getElementById('newResultText'+result_id+'').value;
    saveResult(r);
  }
}

/**
 * Ändere Result Risk Text via HTTP-PUT-Request
 * @param result_id {string}
 */
function setResultRiskText(result_id){
  let r = getResultById(result_id);
  if($('#result_edit_risk'+result_id).html()=='mode_edit'){
    $('#result_edit_risk'+result_id).html('save');

    inputField =
      '<div style="margin-top: 16px; margin-bottom: 26px;" class="group_edit">'+
      '<textarea class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"' +
      ' cols="120" rows="3" id="newResultText'+result_id+'" required></textarea>'+
      '</div>';



    $('#result_text_risk'+result_id).html(inputField);
    document.getElementById('newResultText'+result_id+'').innerHTML = r.risk_text;
  } else {
    r.risk_text = document.getElementById('newResultText'+result_id+'').value;
    saveResult(r);
  }
}

/**
 * Ändere Result Chance Short Text via HTTP-PUT-Request
 * @param result_id {string}
 */
function setResultChanceShortText(result_id){
  let r = getResultById(result_id);
  if($('#result_edit_short'+result_id).html()=='mode_edit'){
    $('#result_edit_short'+result_id).html('save');

    inputField =
      '<div style="margin-top: 16px; margin-bottom: 26px;" class="group_edit">'+
      '<textarea class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"' +
      ' cols="120" rows="1" id="newResultText'+result_id+'" required></textarea>'+
      '</div>';

    $('#result_text_short'+result_id).html(inputField);
    document.getElementById('newResultText'+result_id+'').innerHTML = r.chance_short_text;
  } else {
    r.chance_short_text = document.getElementById('newResultText'+result_id+'').value;
    saveResult(r);
  }
}

/**
 * Ändere Risk Chance Short Text via HTTP-PUT-Request
 * @param result_id {string}
 */
function setResultRiskShortText(result_id){
  let r = getResultById(result_id);
  if($('#result_edit_risk_short'+result_id).html()=='mode_edit'){
    $('#result_edit_risk_short'+result_id).html('save');

    inputField =
      '<div style="margin-top: 16px; margin-bottom: 26px;" class="group_edit">'+
      '<textarea class="ui-autocomplete-input" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"' +
      ' cols="120" rows="1" id="newResultText'+result_id+'" required></textarea>'+
      '</div>';

    $('#result_text_risk_short'+result_id).html(inputField);
    document.getElementById('newResultText'+result_id+'').innerHTML = r.risk_short_text;
  } else {
    r.risk_short_text = document.getElementById('newResultText'+result_id+'').value;
    saveResult(r);
  }
}

