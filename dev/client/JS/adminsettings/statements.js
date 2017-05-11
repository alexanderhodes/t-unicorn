var statements;

//###################################### functions for calculations ######################################

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

function getResultOfStatementOptionByIds(statementId, optionsId){
  var s = getStatementByID(statementId);
  console.log(optionsId);
  console.log(s);
  for(var i = 0; i < s.options.length; i++){
    if(s.options[i].option_id === optionsId){
      var r = getResultById(s.options[i].result_id);
      return r;
    }
  }
}

//###################################### ajax requests ###################################################

/**
 * Methode zum Abruf von Statements und speicher in statements variable
  */
function getStatementsData() {

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
      setHTMLForChecklist();
      finilizeDragAndDrop();
    }
  };
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
 *  saves the product of an answer
 * @param product_id
 * @param statement_id
 * @param answer_id
 * @param bool
 */
function newResultOption (result_id, statementId, optionsId, bool){
  let params = getStatementByID(statementId);
  for(var i = 0; i < params.options.length; i++){
    if(params.options[i].option_id === optionsId){
      params.options[i].result_id = result_id;
    }
  }
  $.ajax({
    type: "PUT",
    url: base_url + "statements/"+statementId,
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      if(!bool){
        getStatementsData();
      }
    }
  });
}

//###################################### change HTML content #############################################

/**
 *  edit statement text
 * @param catalogId {String}
 * @param id {String} questionID
 * @param index {Integer} number of question
 */
function editStatementText(statementId) {
  var s = getStatementByID(statementId);
  if ($('#button_edit' + statementId).attr('value') == 'set') {
    $('#button_edit' + statementId).attr('value', 'set_mode');
    $('#button_iconStatement' + statementId).html('save');

    inputField =
      '<div class="group_statement">' +
      '<input type="text" class="statementEdit edit_data" id="newStatementText" required value="' + s.statement_text + '">' +
      '<label>Gib einen neuen Text ein.</label>' +
      '</div>';

    $('#statementTitle' + statementId).html(inputField);

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
 *  edit statement text
 * @param catalogId {String}
 * @param id {String} questionID
 * @param index {Integer} number of question
 */
function editStatementPoints(statementId){
  var s = getStatementByID(statementId);
  if($('#button_edit_points'+statementId).attr('value')=='set'){
    $('#button_edit_points'+statementId).attr('value','set_mode');
    $('#button_iconStatement_points'+statementId).html('save');

    inputField =
      '<div class="group_statement">'+
      '<input type="text" class="statementEdit edit_data" id="newStatementText" required value="' + s.points + '">'+
      '<label>Gib einen neue Punktzahl ein.</label>'+
      '</div>';

    $('#statementPoints'+statementId).html(inputField);

  } else {
    s.points = $('#newStatementText').val();

    //check if null
    if(s.points != null){
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
}

/**
 *  builds the html content of adminsettings catalog part
 */
function setHTMLForChecklist() {
  $("#checklist").html(buildHTMLChecklist());
  $("#statementsInChecklist").html(buildHTMLStatements());
  finilizeDragAndDrop();
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

        '<!-- statement points -->' +
        '<div  class="statement_points">'+
        '<span id="statementPoints'+s._id+'" class="statementtext">'+ "Punktzahl: " +  s.points +
        '</span>'+

        '<!-- Buttons für die Punkte des '+i+'.  Statements -->'+
        '<span class="statement_button_points">'+

        '<!-- Button Statement '+i+' ändern-->'+
        '<button id="button_edit_points'+s._id+'" value="set" onclick="editStatementPoints(\''+s._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i id="button_iconStatement_points'+s._id+'" class="material-icons">mode_edit</i>'+
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
      //'</div>'+

      '<span class="option_buttons">' +

      '<!-- Button Options Results ausklappen-->' +
      '<button id="buttonResults' + statement._id + options[i]._id +'"  value="set"  onclick="optionResultsFoldOut(\'' + options[i]._id + '\',\'' + statement._id + '\',\'' + i + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
      '<i id="buttonProductsIcon' + statement._id +'" class="material-icons">keyboard_arrow_down</i>' +
      '</button>' +
      '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="divs_chb"></div>';
  }

  return html;
}


//Methode die alle Optionen anklickbar macht und klappt die Liste von Ergebnissen auf
function optionResultsFoldOut(optionsId, statementId, index) {
  if($('#buttonResults' + statementId + optionsId).attr('value')=='set') {
    $('#buttonResults' + statementId + optionsId).attr('value', 'set_mode');
    $('#buttonResultsIcon' + statementId + optionsId).html('keyboard_arrow_up');

    $("#option_frame" + statementId + index).after(getListOfResultsForOption(statementId, optionsId));
  } else {
    $("#resultsForOptions").remove();
    $('#buttonResultsIcon' + statementId + optionsId).html('keyboard_arrow_down');
    $('#buttonResults' + statementId + optionsId).attr('value', 'set');
  }

}

/**
 *  load html content for products for answers of question
 * @param statementId
 * @param optionsId - index for option of statement
 * @returns {string} - html content
 */
function getListOfResultsForOption(statementId, optionsId){
  let statement = getStatementByID(statementId);
  let html = '';

  html += '<div id="resultsForOptions" class="resultsForOptions">';
  html += '<span class="resultsForOptions_title"><b>Ergebnis zu dieser Option:</b></span>';

  let r = getResultOfStatementOptionByIds(statementId, optionsId);

  html +=
    '<!-- Result -->'+

    '<div class="statement_title">'+
    '<span class="result_points_text option_text" id="result_titel'+ r._id +'" class="statementtext">' + r.result_text +
    '</span>'+

    '<!-- Buttons für das erste Produkt -->'+
    '<span class="statement_buttons">'+

    '</span>'+
    '</div>';

  var dropdown_string = setDropdown(statementId, optionsId);

  html += '<!-- Button Produkt hinzufügen-->'+
    '<div class="dropwdown resultsForOption_title addResult_font_size">' +
    '<button onclick="dropdownResults(\'' + optionsId + '\')" ' +
    'class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_statement dropdown">' +
    '<i class="material-icons">mode_edit</i></button>' + 'Ergebnis ändern' +
    '<div id="myDropdown'+optionsId+'" class="dropdown-content">' +
    '<input type="text" placeholder="Suche..." id="myInput" onkeyup="filterFunctionResults(\'' + optionsId + '\')">' +
    dropdown_string +
    '</div>' +
    '</div>' +
    '</div>';

  return html;
}

/**
 *  show the dropdown for results of option
 * @param index - which answer
 */
function dropdownResults(optionsId) {
  document.getElementById("myDropdown"+optionsId).classList.toggle("show");
}

/**
 * filter results dropdown
 * @param index
 */
function filterFunctionResults(optionsId) {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown" + optionsId);
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

/**
 * load dropdown html content (used for choosing a result)
 * @param prods
 * @param statementId
 * @param index
 * @returns {string} - html content
 */
function setDropdown(statementId, optionsId){
  var dropdown_string ='';
  var s = getStatementByID(statementId);
  var resultOfOption = getResultOfStatementOptionByIds(statementId, optionsId);
  results.forEach ( function (r_all) {
    var flag = 0;
    for(var i = 0; i < s.options.length; i++){
      if(r_all._id === resultOfOption._id) {
        flag++;
      }
    }

    if(flag === 0){
      dropdown_string += '<a href="javascript:newResultOption(\'' + r_all._id + '\',\'' + statementId + '\',\'' + optionsId + '\', 0 );">' + r_all.result_text + '</a>';
    }
    flag = 0;
  });

  return dropdown_string;
}
