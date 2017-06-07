/**
 * This function makes all statements in checklist draggable
 */
function finilizeDragAndDrop(){

  var el = $("ul.simple_with_animation").first().get(0);

  Sortable.create(el, {
    group: 'sviews',
    animation: 100,
    ghostClass: "sortable-ghost",  // Class name for the drop placeholder
    chosenClass: "sortable-chosen",

    onAdd: function (evt) {},
    onEnd: function (evt) {
      refreshQuestionSortNumber(el);
    }
  });
}

/**
 * This function updates all stat numbers (rang) after sorting or deleting
 * @param dragdrop_area
 */
function refreshQuestionSortNumber(dragdrop_area) {
  var counter = 0;

  var l = $(dragdrop_area).find("li").length;

  var current_element;

  for(var i=0; i < l; i++){

    current_element=$(dragdrop_area).find("li").eq(i);
    var current_question_id=current_element.attr("id");
    var rang_of_current_question = $("#"+current_question_id+" .question_title .question_rang").html();   //  <- MUSS MAN MIT ID VON DER FRAGE GENAUR DEFINIEREN
    current_element.find(".statement_title .statement_rang").html(i+1);
    //var id=current_question_id.split('_')[1];
    var s = getStatementByID(current_question_id);

    s.statement_rank = i+1;
    $.ajax({
      type: "PUT",
      url: base_url + "statements/" + current_question_id,
      data: s,
      beforeSend: setHeader,
      success: function (response) {
        if(i==l-1) {
          getStatementsData();
        }
      }
    });
  }
}
