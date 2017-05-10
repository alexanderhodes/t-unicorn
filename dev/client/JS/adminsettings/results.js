var results;

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
      $("#result_container").html(buildResultListHTML());
    }

  };

}

/**
 * Erstelle für jedes Result eine HTML-Card
 *
 * Gibt HTML-Cards aller Produkte als String zurück
 * @returns {string}
 */
function buildResultListHTML(){
  let html = '';

  results.forEach(function (result) {
    html +=
      '<!-- Resulttext -->'+
      '<div class="statement_title">'+
        '<span id="result_text'+result._id+'" class="statementtext">' +
          '<b>Ergebnis: </b>' + result.result_text +
        '</span>'+

        '<!-- Buttons für das erste Result -->'+
        '<span class="statement_buttons">'+

          '<!-- Button Produkt 1 ändern-->'+
          '<button onclick="setResultText(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
          '<i id="result_edit'+result._id+'" class="material-icons">mode_edit</i>'+
          '</button>'+

          '<!-- Button Produkt 1 löschen-->'+
          '<button onclick="deleteResult(\''+result._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">delete</i>'+
          '</button>'+
        '</span>'+
      '</div>';
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
 * Lade Produkt aus globaler variable products anhand der ID
 *
 * Produkt ID
 * @param id {string}
 *
 * Gebe JSON von passendem Produkt zurück
 * @returns {*}
 */
function getResultById(id) {
  for(var i = 0; i<results.length; i++){
    if(results[i]._id == id){
      return results[i];
    }
  }
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
 * Ändere Produktname anhand der produkt_id via HTTP-PUT-Request
 * @param result_id {string}
 */
function setResultText(result_id){
  let r = getResultById(result_id);
  if($('#result_edit'+result_id).html()=='mode_edit'){
    $('#result_edit'+result_id).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" id="newResultText'+result_id+'" required value="'+ r.result_text +'">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#result_text'+result_id).html(inputField);
  } else {
    r.result_text = $('#newResultText'+result_id).val();
    saveResult(r);
  }
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

