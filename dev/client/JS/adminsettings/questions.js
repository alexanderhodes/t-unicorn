/**
 * Created by vladimirdoroch on 02.01.17.
 */
var questions;

// Methode zum Abruf von Fragen
function getQuestionsData() {

  // Lade Fragen und speichere in questions
  var reqQuestions = new XMLHttpRequest();
  reqQuestions.open("GET", base_url + "fragen", true);
  setHeader(reqQuestions);
  reqQuestions.send();
  reqQuestions.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      questions = JSON.parse(this.responseText);
      questions.sort(function(a,b){
        return a.rang - b.rang;
      });
      setHTMLforEachCatalog();
      finilizeDragAndDrop();
    }
  };

}

/**
 *  get question by ID
 * @param id {String} QuestionID
 * @returns {JSON} question
 */
function getQuestionByID(id){
  for(var i = 0; i<questions.length; i++){
    if(questions[i]._id == id){
      return questions[i];
    }
  }
}

/**
 *  User is changing answertext which gets stored in DB
 * @param QuestionId {String}
 * @param index {Integer} index of answer
 * @param AnswerId {String}
 */
function editAnswerText(QuestionId, index, AnswerId){
  let q = getQuestionByID(QuestionId);
  if($('#button_editAnswer'+QuestionId+index).attr('value')=='set'){
    $('#button_editAnswer'+QuestionId+index).attr('value','set_mode');
    $('#button_iconAnswer'+QuestionId+index).html('save');

    inputField =
    //  '<div class="group">'+
      '<input type="text" class="answerEdit edit_data" id="newAnswerText" required  value="' + q.antworten[index].antwort_text + '">'+
      '<label class="labelEditAnswer" >Gib einen neue Antwort ein.</label>';//+
    //  '</div>';

    $('#answerText'+QuestionId+index).html(inputField);
  } else {
    var antwort_text = $('#newAnswerText').val();
    //params
    if(antwort_text != "") {
      let params = {antwort_text: antwort_text, antwortId: AnswerId};
      $.ajax({
        type: "PUT",
        url: base_url + "fragen/" + QuestionId + "/antwort/edit",
        data: params,
        beforeSend: setHeader,
        success: function (response) {
          getQuestionsData();
        },
        error: function (response) {
        }
      });
    } else {
      getQuestionsData();
    }
  }
}

/**
 *  edit question text
 * @param catalogId {String}
 * @param id {String} questionID
 * @param index {Integer} number of question
 */
function editQuestionText(catalogId,id, index){
  var q = getQuestionByID(id);
  if($('#button_edit'+catalogId+index).attr('value')=='set'){
    $('#button_edit'+catalogId+index).attr('value','set_mode');
    $('#button_iconQuestion'+catalogId+index).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" class="questionEdit edit_data" id="newQuestionText" required value="' + q.frage + '">'+
      '<label>Gib einen neuen Text ein.</label>'+
      '</div>';

    $('#questionTitle'+catalogId+index).html(inputField);
  } else {

    q.frage = $('#newQuestionText').val();
    $.ajax({
      type: "PUT",
      url: base_url + "fragen/" + id,
      data: q,
      beforeSend: setHeader,
      success: function (response) {
        getQuestionsData();
      },
      error: function (response) {
      }
    });
  }
}

/**
 *  delete question
 * @param question_id
 * @param catalogId
 */
function deleteQuestion(question_id,catalogId){

  //delete Question
  $.ajax({
    type: "DELETE",
    url: base_url + "fragen/"+question_id,
    beforeSend: setHeader,
    success: function (response) {
      //delete QuestionId in Catalog
      let params = {frageId: question_id};
      $.ajax({
        type: "PUT",
        url: base_url + "kataloge/"+catalogId+"/fragen/delete",
        data: params,
        beforeSend: setHeader,
        success: function (response) {
          getQuestionsData();
          getCatalogData();
        }
      });

    },
    error: function (response) {
    }
  });
  setTimeout(function(){
  //update Rang
 // refreshQuestionSortNumber($("ol.simple_with_animation").first());

  }, 500);
}

/**
 *  delete answer
 * @param index {Integer} index of answer
 * @param question_id {String}
 * @param answerId {String}
 */
function deleteAnswer(index, question_id, answerId){
  //params
  let params = {antwortId: answerId};
  $.ajax({
    type: "PUT",
    url: base_url + "fragen/" + question_id + "/antwort/delete",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getQuestionsData();
    },
    error: function (response) {
    }
  });

}

/**
 *  add answer
 * @param question_id
 * @param index {Integer} index of answer
 */
function addAnswer(question_id, index){
  $.ajax({
    type: "PUT",
    url: base_url + "fragen/" + question_id + "/antwort/add",
    beforeSend: setHeader,
    success: function (response) {
      getQuestionsData();
    },
    error: function (response) {
    }
  });


}

/**
 *  builds the html content of adminsettings catalog part
 */
function setHTMLforEachCatalog() {
  catalogs.forEach(function(catalog){
    var questionArray = getQuestionsByCatalog(catalog);
    $('#'+catalog._id).html(buildHTMLQuestions(questionArray, catalog._id));
    finilizeDragAndDrop();

  });


  //Methode die alle Antworten anklickbar macht und klappt die Liste von Produkten auf
  AnswerProductsFoldOut();

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
 *  load Answer of a question
 * @param a_id - answerId
 * @param q_id - questionid
 * @returns {Array} - JSON of answer
 */
function loadQuestionAnswerByID(a_id, q_id) {
  let q = loadQuestionByID(q_id);
  return $.grep(q[0].antworten, function (e) {
    return e._id === a_id;
  });
}

/**
 *  returns the questions of a catalog
 * @param catalog - catalogId
 * @returns {Array} - with JSON of questions
 */
function getQuestionsByCatalog(catalog) {
  var arrQeustions = new Array(catalog.fragen_id.length);

  for(var i=0;i<arrQeustions.length;i++){
    arrQeustions[i]=loadQuestionByID(catalog.fragen_id[i]);
  }

  return arrQeustions;
}

/**
 *  builds the html content for questions in a catalog
 * @param quest - array of questions
 * @param catalogId
 * @returns {string} - html content
 */
function buildHTMLQuestions(quest, catalogId) {
  var html = '<div><ul class="simple_with_animation">';
  //array sortieren
  quest.sort(function(a,b){
    return a[0].rang - b[0].rang;
  });
  for (var i=0;i<quest.length;i++){
    let q=quest[i][0];
    if(q != undefined){ // if question was deleted
      html +=
        '<!-- Fragen im Katalog-->'+
        '<!-- Frage '+'i'+'-->'+


            '<!-- Fragetext --><li id="question_'+q._id+'">'+
            '<div  class="question_title"><span class="question_rang">'+q.rang+'</span>'+
              '<span id="questionTitle'+catalogId+i+'" class="questiontext">'+q.frage+
              '</span>'+

              '<!-- Buttons für die '+i+'. Frage -->'+
              '<span class="question_buttons">'+

                '<!-- Button Frage '+i+' ändern-->'+
                '<button id="button_edit'+catalogId+i+'" value="set" onclick="editQuestionText(\''+catalogId+'\',\''+q._id+'\','+i+')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
                '<i id="button_iconQuestion'+catalogId+i+'" class="material-icons">mode_edit</i>'+
                '</button>'+
                '<!-- Button Frage '+i+' löschen-->'+
                '<button onclick="deleteQuestion(\''+q._id+'\',\''+catalogId+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
                '<i  class="material-icons">delete</i>'+
                '</button>'+
              '</span>'+
            '</div>'+

            builtHTMLAnswers(q) +

            '<!-- Neue Antwort zu der '+i+'. Frage hinzufügen-->'+
            '<div class="answer_text">'+
              '<button onclick="addAnswer(\''+q._id+'\','+i+')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_answer ">'+
                '<i class="material-icons">add</i>'+
              '</button>'+
              'Antwort hinzufügen'+
            '</div>'+
          '</li>';

    }
  }
html+="</ul></div>";
  return html;
}

/**
 *  builds the html content of answers for a question
 * @param quest {JSON} - question
 * @returns {string} - html content
 */
function builtHTMLAnswers(quest){

  var html = '';
  let answers = quest.antworten;

  html +=
    '<!-- Antwortmöglichkeiten für die Frage-->'+
    '<div class="answer_list">';
    for(var i = 0; i < answers.length; i++) {
      // answers.forEach(function(antwort){
      html +=
        '<!-- Antwort -->' +
        '<div id="answer_frame'+answers[i]._id+'" class="answer_pr_frame"><div class="answer_text">' + //
        '<div id="answerText'+quest._id+i+'" class="answer_text_span">'+answers[i].antwort_text +
        '</div>'+
           // answers[i].antwort_text ++

        '<span class="answer_buttons">' +

        '<!-- Button Antwort Produkte ausklappen-->' +
        '<button id="buttonProducts' + answers[i]._id +'"  value="set"  onclick="AnswerProductsFoldOut(\'' + answers[i]._id + '\',\'' + quest._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i id="buttonProductsIcon' + answers[i]._id +'" class="material-icons">keyboard_arrow_down</i>' +
        '</button>' +

        '<!-- Button Antwort ändern-->' +
        '<button id="button_editAnswer'+ quest._id + i +'" value="set" onclick="editAnswerText(\'' + quest._id + '\',' + i + ', \'' + answers[i]._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i id="button_iconAnswer' + quest._id+i + '" class="material-icons">mode_edit</i>' +
        '</button>' +

        '<!-- Button Antwort löschen-->' +
        '<button onclick="deleteAnswer(' +  i + ',\'' + quest._id + '\',\'' + answers[i]._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
        '<i class="material-icons">delete</i>' +
        '</button>' +


        '</span>' +

        '</div>' +
        '</div>' +
        '<div class="divs_chb"></div>';
    }



  return html;
}


//Methode die alle Antworten anklickbar macht und klappt die Liste von Produkten auf
//wird in setHTMLforEachCatalog() aufgerufen
function AnswerProductsFoldOut(index, questionId) {
  if($('#buttonProducts' + index).attr('value')=='set') {
    $('#buttonProducts' + index).attr('value', 'set_mode');
    $('#buttonProductsIcon' + index).html('keyboard_arrow_up');

    $("#answer_frame" + index).after(getListOfProductsForAnswer(questionId, index));
  } else {
    $("#productsForAnswer").remove();
    $('#buttonProductsIcon' + index).html('keyboard_arrow_down');
    $('#buttonProducts' + index).attr('value', 'set');
  }

}

/**
 *  load html content for products for answers of question
 * @param questionId
 * @param index - index for answer
 * @returns {string} - html content
 */
function getListOfProductsForAnswer(questionId, index){
    let answer = loadQuestionAnswerByID(index, questionId)[0];
    let prods = answer.produkte;
    let html = '';
    html += '<div id="productsForAnswer" class="productsForAnswer">';
    html += '<span class="productsForAnswer_title"><b>Produkte zu dieser Antwort:</b></span>';
  prods.forEach(function (product) {
    let p = getProductById(product.produkt_id);
    if(p){
      html +=
        '<!-- Produkttext -->'+

        '<div class="question_title">'+
        '<span class="product_points_text answer_text" id="product_titel'+p._id+'" class="questiontext">' + p.titel +
        '</span>'+

        '<!-- Buttons für das erste Produkt -->'+
        '<span class="question_buttons">'+

        '<!-- Button Produkt 1 löschen-->'+
        '<button onclick="removeProductAnswer(\''+questionId+'\',\''+answer._id+'\',\''+p._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i class="material-icons">delete</i>'+
        '</button>'+
        '</span>'+
        '</div>'+

        '<!-- Attribute für das Produkt-->'+
        '<div class="answer_list">'+

        '<!-- Punkte für Produkt -->'+
        '<div class="answer_text">'+
        '<span class="product_points" id="product_points'+answer._id+p._id+'">'+
        'Punkte: <span id="points'+answer._id+p._id+'">'+  product.punkte +
        '</span></span>'+

        '<!-- Button Beschreibung ändern-->'+
        '<span class="answer_buttons">'+
        '<button onclick="setProductPoints(\''+questionId+'\',\''+answer._id+'\',\''+p._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i id="desc_edit'+answer._id+p._id+'" class="material-icons">mode_edit</i>'+
        '</button>'+
        '</span>'+
        '</div>'+
        '</div>';
    }
    });
 var dropdown_string = setDropdown(prods, questionId, index);
    html += '<!-- Button Produkt hinzufügen-->'+
      '<div class="dropwdown productsForAnswer_title addProduct_font_size">' +
      '<button onclick="dropdownQuestions(\'' + index + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_question dropdown"><i class="material-icons">add</i></button>' + 'Produkt hinzufügen' +
      '<div id="myDropdown'+index+'" class="dropdown-content">' +
      '<input type="text" placeholder="Suche.." id="myInput" onkeyup="filterFunctionQuestions(\'' + index + '\')">' +
      dropdown_string +
      '</div>' +
      '</div>' +
      '</div>';

    return html;
}

/**
 *  edit product points for an answer
 * @param question_id
 * @param answer_id
 * @param product_id
 */
function setProductPoints(question_id, answer_id, product_id) {
  if($('#desc_edit'+answer_id+product_id).html()=='mode_edit'){
    $('#desc_edit'+answer_id+product_id).html('save');

    inputField =
      '<input type="text" value="'+$('#points'+answer_id+product_id).html()+'" class="answerEdit" id="input'+answer_id+product_id+'" required>'+
      '<label class="labelEditAnswer" >Gib die Punkte ein.</label>';
    $('#product_points'+answer_id+product_id).html(inputField);
  } else {
    let pPoints = $('#input'+answer_id+product_id).val();
    //params
    if(pPoints != "") {
      let params = {productId: product_id, questionId: question_id, answerId: answer_id};
      $.ajax({
        type: "DELETE",
        url: base_url + "fragen/" + question_id + "/antwort/" + answer_id + "/produkte/" + product_id,
        data: params,
        beforeSend: setHeader,
        success: function (response) {
          newProductAnswer(product_id, question_id, answer_id, pPoints);
        },
        error: function (response) {
        }
      });
    }
  }
}

/**
 * load dropdown html content (used for choosing a product)
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
      dropdown_string += '<a href="javascript:newProductAnswer(\'' + p_all._id + '\',\'' + questionId + '\',\'' + index + '\', 0 );">' + p_all.titel + '</a>';
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
function dropdownQuestions(index) {
  document.getElementById("myDropdown"+index).classList.toggle("show");
}

/**
 * filter products dropdown
 * @param index
 */
function filterFunctionQuestions(index) {
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



