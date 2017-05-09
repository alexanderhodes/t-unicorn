/**
 * Created by vladimirdoroch on 02.01.17.
 */
var statements;

// Methode zum Abruf von Statements
function getStatementsData() {

  // Lade Fragen und speichere in questions
  var reqStatements = new XMLHttpRequest();
  reqStatements.open("GET", base_url + "statements", true);
  setHeader(reqStatements);
  reqStatements.send();
  reqStatements.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      statements = JSON.parse(this.responseText);
      statements.sort(function(a,b){
        return a.statement_rank - b.statement_rank;
      });
      console.log("STATEMENT");
      setHTMLForChecklist();//setHTMLforEachCatalog();
      finilizeDragAndDrop();
    }
  };

}

/**
 *  get statement by ID
 * @param id {String} StatementID
 * @returns {JSON} question
 */
function getStatementByID(id){
  for(var i = 0; i<statements.length; i++){
    if(statements[i]._id == id){
      return statements[i];
    }
  }
}

/**
 *  edit statement text
 * @param catalogId {String}
 * @param id {String} questionID
 * @param index {Integer} number of question
 */
function editStatementText(statementId){
  var s = getStatementByID(statementId);
  if($('#button_edit'+statementId).attr('value')=='set'){
    $('#button_edit'+statementId).attr('value','set_mode');
    $('#button_iconStatement'+statementId).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" class="statementEdit edit_data" id="newStatementText" required value="' + s.statement_text + '">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#statementTitle'+statementId).html(inputField);

  } else {
    s.statement_text = $('#newStatementText').val();

    $.ajax({
      type: "PUT",
      url: base_url + "statements/" + statementId,
      data: s,
      beforeSend: setHeader,
      success: function (response) {
        getStatementsData();
      },
      error: function (response) {
      }
    });
  }
}

/**
 *  delete Statement
 * @param statementId
 */
function deleteStatement(statementId){

  //delete Question
  $.ajax({
    type: "DELETE",
    url: base_url + "statements/"+statementId,
    beforeSend: setHeader,
    success: function (response) {
      getStatementsData();
    }
  });
}

/**
 *  builds the html content of adminsettings catalog part
 */
function setHTMLForChecklist() {
  $("#checklist").html(buildHTMLChecklist());
  $("#statementsInChecklist").html(buildHTMLStatements());
  finilizeDragAndDrop();

  //Methode die alle Antworten anklickbar macht und klappt die Liste von Produkten auf
  //AnswerProductsFoldOut(); //TODO
  //optionResultsFoldOut();

}

/**
 *  load question By Id
 * @param id - questionID
 * @returns {Array}
 */
function loadQuestionByID(id) {
  return $.grep(questions, function (e) {
    return e._id === id;
  });
}

/**
 *  builds the html content for statements
 *  @returns {string} - html content
 */
function buildHTMLStatements() {
  var html = '<div><ul class="simple_with_animation">';

  for (var i=0;i<statements.length;i++){
    let s=statements[i];
    if(s != undefined){ // if statement was deleted
      html +=
        '<!-- Checkliste -->'+
        '<!-- Statement '+'i'+'-->'+


            '<!-- statementtext --><li id="'+s._id+'">'+
            '<div  class="statement_title"><span class="statement_rang">'+s.statement_rank+'</span>'+
              '<span id="statementTitle'+s._id+'" class="statementtext">'+s.statement_text+
              '</span>'+

              '<!-- Buttons für die '+i+'. Frage -->'+
              '<span class="statement_buttons">'+

                '<!-- Button Statement '+i+' ändern-->'+
                '<button id="button_edit'+s._id+'" value="set" onclick="editStatementText(\''+s._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
                '<i id="button_iconStatement'+s._id+'" class="material-icons">mode_edit</i>'+
                '</button>'+
                '<!-- Button Frage '+i+' löschen-->'+
                '<button onclick="deleteStatement(\''+s._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
                '<i  class="material-icons">delete</i>'+
                '</button>'+
              '</span>'+
            '</div>'+

            buildHTMLOptions(s) +

          '</li>';

    }
  }
html+="</ul></div>";
  return html;
}

/**
 *  builds the html content of options for a statement
 * @param statement {JSON} - statement
 * @returns {string} - html content
 */
function buildHTMLOptions(statement){

  var html = '';
  //let options =

  html += '<!-- Antwortmöglichkeiten für die Frage--><div class="option_list">';

  for(var i = 0; i < statement.options.length; i++) {

    html +=
      '<!-- Option -->' +
      '<div id="option_frame'+statement._id+i+'" class="option_pr_frame"><div class="option_text">' + //
      '<div id="optionText'+statement._id+i+'" class="option_text_span">'+ options[i].option_text +
      '</div>'+

      '<span class="option_buttons">' +

      '<!-- Button Options Results ausklappen-->' +
      '<button id="buttonResults' + options[i].option_id +'"  value="set"  onclick="optionResultsFoldOut(\'' + options[i].options_id + '\',\'' + statement._id + '\',\'' + i + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
      '<i id="buttonProductsIcon' + options[i].option_id +'" class="material-icons">keyboard_arrow_down</i>' +
      '</button>' +

  //    '<!-- Button Antwort löschen-->' +
  //    '<button onclick="deleteAnswer(' +  i + ',\'' + quest._id + '\',\'' + answers[i]._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
  //    '<i class="material-icons">delete</i>' +
  //    '</button>' +


      '</span>' +

      '</div>' +
      '</div>' +
      '<div class="divs_chb"></div>';
  }

  return html;
}


//Methode die alle Optionen anklickbar macht und klappt die Liste von Ergebnissen auf
function optionResultsFoldOut(optionsId, statementId, index) {
  if($('#buttonResults' + optionsId).attr('value')=='set') {
    $('#buttonResults' + optionsId).attr('value', 'set_mode');
    $('#buttonResultsIcon' + optionsId).html('keyboard_arrow_up');

    $("#option_frame" + statementId + index).after(getListOfResultsForOption(statementId, optionsId));
  } else {
    $("#resultsForOptions").remove();
    $('#buttonProductsIcon' + optionsId).html('keyboard_arrow_down');
    $('#buttonProducts' + optionsId).attr('value', 'set');
  }

}

/**
 *  load html content for products for answers of question
 * @param questionId
 * @param index - index for answer
 * @returns {string} - html content
 */
function getListOfResultsForOption(statementId, optionsId){
    let statement = getStatementByID(statementId);
    let html = '';

    html += '<div id="resultsForOptions" class="resultsForOptions">';
    html += '<span class="resultsForOptions_title"><b>Ergebnisse zu dieser Option:</b></span>';

    options.forEach(function (option) {
    let r = getResultById(option.result_id);
    if(r){
      html +=
        '<!-- Result -->'+

        '<div class="statement_title">'+
        '<span class="result_points_text answer_text" id="result_titel'+r._id+'" class="statementtext">' + r.titel +
        '</span>'+

        '<!-- Buttons für das erste Produkt -->'+
        '<span class="question_buttons">'+

        '<!-- Button Result 1 löschen-->'+
        '<button onclick="removeResultOption(\''+statementId+'\',\''+optionsId+'\',\''+r._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i class="material-icons">delete</i>'+
        '</button>'+
        '</span>'+
        '</div>'+

        '</div>';
    }
    });

    var dropdown_string = setDropdown(prods, questionId, index);

    html += '<!-- Button Produkt hinzufügen-->'+
      '<div class="dropwdown resultsForOption_title addResult_font_size">' +
      '<button onclick="dropdownResults(\'' + index + '\')" ' +
      'class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_statement dropdown">' +
      '<i class="material-icons">add</i></button>' + 'Ergebnis hinzufügen' +
      '<div id="myDropdown'+index+'" class="dropdown-content">' +
      '<input type="text" placeholder="Suche.." id="myInput" onkeyup="filterFunctionResults(\'' + index + '\')">' +
      dropdown_string +
      '</div>' +
      '</div>' +
      '</div>';

    return html;
}


//TODO Dropdown
/**
 * load dropdown html content (used for choosing a result)
 * @param prods
 * @param questionId
 * @param index
 * @returns {string} - html content
 */
function setDropdown(prods, questionId, index){
  var dropdown_string ='';
  products.forEach ( function (p_all) {
    var flag = 0;
    prods.forEach(function (p_ans) {
      if(p_all._id === p_ans.produkt_id) {flag++;}
    });
    if(flag === 0){
      dropdown_string += '<a href="javascript:newResultOption(\'' + p_all._id + '\',\'' + questionId + '\',\'' + index + '\', 0 );">' + p_all.titel + '</a>';
    }
    flag = 0;
  });

  return dropdown_string;
}

/**
 *  saves the product of an answer
 * @param product_id
 * @param question_id
 * @param answer_id
 * @param points
 * @param bool
 */
function newProductAnswer (product_id, question_id, answer_id, points, bool){
  let params = {productId: product_id, questionId: question_id, answerId: answer_id, points: points};
  $.ajax({
    type: "POST",
    url: base_url + "fragen/"+question_id+"/antwort/"+answer_id+"/produkte",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      if(!bool){getCatalogData();}
    }
  });
}

/**
 *  removes a product from an answer
 * @param question_id
 * @param answer_id
 * @param product_id
 * @param bool
 */
function removeProductAnswer(question_id, answer_id, product_id, bool) {
  //delete QuestionId in Catalog
  let params = {productId: product_id, questionId: question_id, answerId: answer_id};
  $.ajax({
    type: "DELETE",
    url: base_url + "fragen/"+question_id+"/antwort/"+answer_id+"/produkte/"+product_id,
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      if(!bool){getCatalogData();}
    }
  });
}

/**
 *  show the dropdown for products of answer
 * @param index - which answer
 */
function dropdownResults(index) {
  document.getElementById("myDropdown"+index).classList.toggle("show");
}

/**
 * filter products dropdown
 * @param index
 */
function filterFunctionResults(index) {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown" + index);
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}



