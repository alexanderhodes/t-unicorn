/**
 * Created by lizakanitz on 25.04.17.
 */



/*
 *This function activates the start button if 'Enter' is pressed.
 */
$(document).on('keyup',function(e){
  if (e.which == 13){
    $("#btn_start_check").click();
  }
});



/**
 * This function sets events when page is loaded
 */
$(document).ready(function() {



  $("span[class='mdl-button__ripple-container']").height(36);

  /**
   * This function sets events for Start-Button
   */
  $("#btn_start_check").on('click touch', function() {
    //setSession
    sessionStorage.clear();
    window.sessionStorage.setItem('options','');
    options = "";
    getStatementsLayout(statements[0]);

  });




  $(".contact_link").on('click touch', function() {
    sendMail();
  });





  /**
   * This function creates DOM Elements for Statement layout and adds them to the page.
   * @param{Object} currentStatement
   */

  function getStatementsLayout(currentStatement) {
alert(currentStatement.statement_text);
    //var progress_circles;
    //progress_circles = setProgressCircles(q.length, currentStatement.rang);


    var card_layout;
    var card_grid_definition = "<div class=\"mdl-grid\">" +
      "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp card_recom\" id=\"card_grid_content\">";
    var card_statement = "<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text statement_number\"> "
      + currentStatement.rang + "</h2></div>" +
      "<div class=\"mdl-card__supporting-text statement_text\">" + currentStatement.statement_text + "</div>";

    var card_options = "";
    alert("6");
    for (var i = 0; i < currentStatement.options.length(); i++) {

      var option_id = i + 1;
      for (var j=0; j<ops.length(); j++)
      {
        if(currentStatement.options[i].option_id==ops[j].option_id)
        {
          card_options +="<div class=\"mdl-card__actions mdl-card--border option_card\" id='"+option_id+"'>"+
            ops[j].option_text+"</div>";
          break;
        }
      }

    }

    var card_grid_end = "</div></div><div class='option_back'></div></div></div>";

    card_layout = card_grid_definition + card_statement + card_options + card_grid_end;

    $("#main_content").html(card_layout);

    $(".mdl-layout").attr("class", "mdl-layout mdl-js-layout mdl-layout--fixed-header  white-layout");

    if (currentStatement.rang > 1 && currentStatement.rang <= statements.length) {
      $(".option_back").html("<button class=\"mdl-button mdl-js-button mdl-button--raised statement_back_back\" goto=\"" + (currentStatement.rang - 1) + "\">" +
        "<i class=\"material-icons arrow_back\">arrow_back</i>Zurück " +
        "</button>");
    }

    $(".statement_back").on('click touch', function () {

      var previousNumber = $(this).attr("goto");
      setTimeout(function () {
        getStatementsLayout(statements[previousNumber - 1]);
      }, 200);
      var options = sessionStorage.options.split('~');
      var last_option = options[options.length - 1];
      sessionStorage.options = sessionStorage.options.substr(0, sessionStorage.options.length - last_option.length - 1);

      setTimeout(function () {
        $(".option_card[id='" + last_option + "']").addClass("option_clicked");
        $(".option_card[id='" + last_option + "']").html($(".option_card[id='" + last_option + "']").html() + "<i class=\"material-icons done_icon\">done</i>");
      }, 200);
    });


    $(".option_card").one('click touch', function () {
      //(id_option ins sessionStorage bei der Optionauswahl speichern)

      var next_statement = currentStatement.rang;

      if($(".show_result").length()==0) {
        if (sessionStorage.options != "") {
          //trennzeichen zum splitten
          sessionStorage.options += "~";
        }
        sessionStorage.options += $(this).attr("id");

        $(this).css("background", "#CCCCCC");
        $(this).html($(this).html() + "<i class=\"material-icons done_icon\" style=color:#E20074!important>done</i>");
      }
      if (currentStatement.rang < q.length) {

        setTimeout(function () {
          getStatementsLayout(q[next_statement]);
        }, 300);
      }

      //show "zum Ergebnis" button
      if (currentStatement.rang == q.length && $(".show_result").length==0) {

        $(".option_back").html($(".option_back").html() + "<button class=\"mdl-button mdl-js-button mdl-button--raised show_result" + "\">" +
          "Zum Ergebnis <i class=\"material-icons arrow_back\">arrow_forward</i>" +
          "</button>");
        $(".statement_back").on('click touch', function () {

          var previousNumber = $(this).attr("goto");
          setTimeout(function () {
            getStatementsLayout(q[previousNumber - 1]);
          }, 200);
          var options = sessionStorage.options.split('~');
          var last_option = options[options.length - 1];
          var double_last_option = options[options.length - 2];
          sessionStorage.options = sessionStorage.options.substr(0, sessionStorage.options.length - last_option.length - double_last_option.length - 2);

          setTimeout(function () {
            $(".option_card[id='" + last_option + "']").addClass("option_clicked");
            $(".option_card[id='" + last_option + "']").html($(".option_card[id='" + last_option + "']").html() + "<i class=\"material-icons done_icon\">done</i>");
          }, 200);
        });
        $(".show_result").on('click touch', function () {
            startProductCalculation();
            $("#progress_circles").remove();
          }
        );
      }

    });
  }

});


/* This Function generates the html code of the result with security type, products and an overview about the options.
 * @params{array} p array of products
 * @returns(text) html_text DOM elements as string
 */
function getResults(p) {


  var type = "<span class='secruity_type_result_text' style='margin-top:1em' >Du gehörst zum Sicherheitstyp<br></span>" + "<span class=secruity_type_result id='sicherheitstyp'>" + sicherheitstyp + "</span><br>";


  var recommendations = '<br><div><div class="accordion_header">Wir empfehlen Dir folgende Produkte für Dein Unternehmen:</div></div><br><div>';
  for (var i = 0; i < p.length; i++) {
    if (p[i] == undefined){
      //next element
    } else {
      var Produkt = p[i].titel;
      products_string+=p[i].titel + "\n";
      var Bild = p[i].uri_logo;
      var Link = p[i].link;
      var Beschreibung = p[i].beschreibung.toString();
      recommendations += '<button id="Button_'+i+'" class="accordion_button_products"><img id="product_icon" src =' + Bild + '></img>' + Produkt + '<i class="material-icons accordion_button_arrow">keyboard_arrow_left</i></button><div id="Produkt_' + i + '" class="accordion_content"><br><div>' + Beschreibung + '</div><br><a href="' + Link + '" target="_blank">Hier gibt es weitere Informationen</a><br></div></div>';
    }}
  recommendations+= '</div>';
  var user_options="";
  for(var i=0; i<q.length; i++)
  {
    user_options+='<span style=color:#000000 >'+ q[i].rang +'. '+ q[i].frage +'</span><br>';
    user_options+='<span style=color:#9E9E9E class="overview_options">'+' '+q[i].antworten[sessionStorage.options.split('~')[i]-1].antwort_text+'</span><br>';
  }
  var statement_overview = "";

  statement_overview+='<br><div class="accordion_header">Die Produkte wurden auf Basis deiner Antworten ermittelt: </div><br><button id = "overview_button" onclick=fold_out("overview") class="accordion_button_overview"><span class="button_text">Hier findest Du deine Übersicht aller Ergebnisse</span></button><div id="overview" class="accordion_content"><p><br>' + user_options + '</p></div><br>';


  var buttons_atresult = "<div class='mail_buttons_div'><button class = 'mail_buttons' onclick=option_mailto()>Ergebnisse versenden</button>" + "<button class = 'mail_buttons' onclick=sendMail()> Kontaktieren </button></div>";
  $(".option_back").remove();
  $("#card_grid_content").html(type + recommendations+statement_overview+buttons_atresult);


  componentHandler.upgradeDom();
  $("#recom").width($("#recom").parent().width() - 40);


  $(".accordion_button_products").on('click touch', function () {
    var counter=$(this).attr("id").split('_')[1];
    fold_out("Produkt_" + counter);
    button_change("Button_"+counter);

  });
}





/**
 *  builds the html content for statements
 * @param statement - array of questions
 * @returns {string} - html content
 */
function buildHTMLStatements(statements) {
  var html = '<div><ul class="simple_with_animation">';
  //array sortieren
  //quest.sort(function(a,b){
  //return a[0].rang - b[0].rang;
  //});
  for (var i=0;i<statements.length;i++){
    var s=statements[i];
    if(s != undefined){ // if question was deleted
      html +=
        '<!-- Aussagen im Katalog-->'+
        '<!-- Aussage '+'i'+'-->'+


        '<!-- Fragetext -->' +
        '<li id="statement_'+s.statement_id+'">'+
        '<div  class="statement_title"><span class="statement_rang">'+s.rang+'</span>'+
        '<span id="statementTitle'+i+'" class="statementtext">'+s.statement_text+
        '</span>'+

        '<!-- Buttons für die '+i+'. Frage -->'+
        '<span class="statement_buttons">'+

        '<!-- Button Frage '+i+' ändern-->'+
        '<button id="button_edit'+i+'" value="set" onclick="editstatementText(\''+s.statement_id+'\','+i+')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i id="button_iconStatement'+i+'" class="material-icons">mode_edit</i>'+
        '</button>'+
        '<!-- Button Frage '+i+' löschen-->'+
        '<button onclick="deleteStatement(\''+s.statement_id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
        '<i  class="material-icons">delete</i>'+
        '</button>'+
        '</span>'+
        '</div>'+

        builtHTMLOptions(s) +

        '<!-- Neue Antwort zu der '+i+'. Frage hinzufügen-->'+
        '<div class="option_text">'+
        '<button onclick="addOption(\''+s.statement_id+'\','+i+')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_answer ">'+
        '<i class="material-icons">add</i>'+
        '</button>'+
        'Option hinzufügen'+
        '</div>'+
        '</li>';

    }
  }
  html+="</ul></div>";
  return html;
}

/**
 *  builds the html content of answers for a question
 * @param statement {JSON} - question
 * @returns {string} - html content
 */
function builtHTMLAnswers(s){

  var html = '';
  var currentOptions = s.options;

  html +=
    '<!-- Antwortmöglichkeiten für die Frage-->'+
    '<div class="option_list">';
  for(var i = 0; i < currentOptions.length; i++) {
    // answers.forEach(function(antwort){
    html +=
      '<!-- Antwort -->' +
      '<div id="option_frame'+currentOptions[i].option_id+'" class="option_pr_frame"><div class="option_text">' + //
      '<div id="optionText'+s.statement_id+i+'" class="option_text_span">'+currentOptions[i].option_text+
      '</div>'+

      '<span class="option_buttons">' +



      '</span>' +

      '</div>' +
      '</div>' +
      '<div class="divs_chb"></div>';
  }


  return html;
}


