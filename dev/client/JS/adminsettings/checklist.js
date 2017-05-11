//###################################### ajax requests ###################################################

/**
 * Erzeuge neues Statement und speichere es in der DB via POST-Message
 */
function newStatement(){
  //calculate rang
  var newRank = 0;
  for(var i = 0; i < statements.length; i++){
    if(newRank < statements[i].statement_rank){
      newRank = statements[i].statement_rank;
    }
  }
  newRank = newRank+1;
  params = {
    statement_text: "neues Statement",
    statement_rank: newRank,
    points: 0,
    options: []
  };

  //add Question
  $.ajax({
    type: "POST",
    url: base_url + "statements/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getStatementsData();
    },
    error: function (response) {
    }
  });
}

//###################################### change HTML content #############################################

/**
 * Erstelle HTML-Code für die Checklist und gebe das Ergebnis zurück
 * @returns {String}
 */
function buildHTMLChecklist() {
  var html='';

  let card_checklist = '<div id="statementsInChecklist"></div>'+
    '<!-- Button statement hinzufügen-->'+
    '<div class="mdl-card__actions mdl-card--border add_question_frame">'+
    '<button  onclick="newStatement()" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_question">'+
    '<i class="material-icons">add</i>'+
    '</button>'+
    'Statement hinzufügen'+
    '</div>';

  let card_foot =
    '<div class="mdl-card__menu">'+

    '</div>'+
    '</div>';

  html += card_checklist + card_foot;

  return html;
}
