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
 *  Lade Produkte per HTTP GET-Request und speichere in globaler variable products
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
  console.log(result);
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
 * Speichere neues Produkt in Datenbank per HTTP-POST-Request
 */
function newResult(){
  params = {
    result_text: "Neuen Ergebnistext einfügen!"
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
      '<!-- Resulttext -->'+
      '<div class="statement_title margin_result">'+
      '<b>'+ i +'. Ergebnis:</b>'+
      '<!-- Button Produkt 1 löschen-->'+
      '<button onclick="deleteResult(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
      '<i class="material-icons">delete</i>'+
      '</button>';


      html +=
        '<div class="div_parent"><div class="div_text result_text"><p id="result_text' + result._id + '" class="statementtext"><b>+ </b>' + result.chance_text +
        '</p></div>' +

        '<!-- Buttons für das erste Result -->' +
        //'<span class="statement_buttons">' +

        '<!-- Button Produkt 1 ändern-->' +
        '<div class="div_button"><button onclick="setResultChanceText(\'' + result._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i id="result_edit' + result._id + '" class="material-icons">mode_edit</i>' +
        '</button>' +
        '</div></div>';

      html +=
        '<div class="div_parent"><div class="div_text result_text"><p id="result_text_risk'+result._id+'" class="statementtext"><b>- </b>' +' '+ result.risk_text +
        '</p></div>'+

        '<!-- Buttons für das erste Result -->'+

        '<!-- Button Produkt 1 ändern-->'+
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
 * Ändere Produktname anhand der produkt_id via HTTP-PUT-Request
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
 * Ändere Produktname anhand der produkt_id via HTTP-PUT-Request
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

