/**
 * Created by lizakanitz on 14.10.16.
 */
/**
 * URL to remote server storing questions
 * @type {string}
 * @ Vladimir Doroch
 */
let url = location.protocol + '//' + location.host+'/';
//let url = 'http://localhost:4000/'; //for loacal access
let base_url = url + 'api/'; // for local testing
//let url = 'http://10.1.88.8:4000/ // REST-Api deployment server
//let base_url = 'http://10.1.88.8:3001/api/'; // REST-Api deployment server

// Array which will be storing questions
var q;
var products_string ="";
var p;

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

  if (typeof(Storage) !== "undefined") {
    // Code für sessionStorage:
    window.sessionStorage.setItem("answers", "");
  }


  $("span[class='mdl-button__ripple-container']").height(36);
  //clicks calculation for progress bar
  var lastClick = 0;

  //ProgressBar, wird evtl. später umgesetzt
  function moveProgressBar() {
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }
  }

  /**
   * This function sets events for Button
   */
    $("#btn_start_check").on('click touch', function() {
      //setSession
      sessionStorage.clear();
      window.sessionStorage.setItem('answers','');
      answers = "";
        getHeaderWithLogo();
        loadQuestions();
        setTimeForProgressBar();
    });

  /**
   * time for progress bar
   */
  function  setTimeForProgressBar() {
  var d = new Date();
  var t = d.getTime();
  lastClick = t;
}


    $(".contact_link").on('click touch', function() {
        sendMail();
    });

  /**  function showContact() {
    getHeaderWithLogo();
    var kontakt_content = "<div class=\"mdl-grid\">" +
      "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp contact_card\" id=\"card_grid_content\">" +
      "<div id='contact_frame'>Volker Presse </br> +4915113132424 </br> Deutsche Telekom AG</div>" +
      "<button class = 'btn_mail'> Kontaktieren </button>" + "</div>";



    $("#main_content").html(kontakt_content);
    $(".btn_mail").on('click touch', function() {
      sendMail();

    });
  }*/

/**
 * This function places DOM elements for page header
 */
  function getHeaderWithLogo() {
    $("#main_header").html("<span class=\"mdl-layout-title\">CloudReadinessCheck</span>" +
      "<div class=\"mdl-layout-spacer\"></div>");
  }

  /**
   * This function creates DOM Elements for question layout and adds them to the page.
   * @param{Object} currentQuestion
   */

    function getQuestionsLayout(currentQuestion) {

      var progress_circles;
      progress_circles = setProgressCircles(q.length, currentQuestion.rang);

    setTimeForProgressBar();
    var card_layout;
    var card_grid_definition = "<div class=\"mdl-grid\">" +
      "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp card_recom\" id=\"card_grid_content\">";
    var card_question = "<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text frage_nummer\">Frage " + currentQuestion.rang + "</h2>" +
      "</div>" +
      "<div class=\"mdl-card__supporting-text question_text\">"
      + currentQuestion.frage +
      "</div>";

        var card_answers = "";

        for (var i = 0; i < currentQuestion.antworten.length; i++) {
          var answer_id = i + 1;
          card_answers +="<div class=\"mdl-card__actions mdl-card--border answer_card\" id='"+answer_id+"'>"+
          currentQuestion.antworten[i].antwort_text +
          "</div>";
        }

    var card_grid_end = "</div></div><div class='answer_back'></div></div></div>";

    card_layout = progress_circles + card_grid_definition + card_question + card_answers + card_grid_end;

    $("#main_content").html(card_layout);

    $(".mdl-layout").attr("class", "mdl-layout mdl-js-layout mdl-layout--fixed-header  white-layout");

    if (currentQuestion.rang > 1 && currentQuestion.rang <= q.length) {
      $(".answer_back").html("<button class=\"mdl-button mdl-js-button mdl-button--raised question_back\" goto=\"" + (currentQuestion.rang - 1) + "\">" +
        "<i class=\"material-icons arrow_back\">arrow_back</i>Zurück " +
        "</button>");
    }

    $(".question_back").on('click touch', function () {

      var previousNumber = $(this).attr("goto");
      setTimeout(function () {
        getQuestionsLayout(q[previousNumber - 1]);
      }, 200);
      var answers = sessionStorage.answers.split('~');
      var last_answer = answers[answers.length - 1];
      sessionStorage.answers = sessionStorage.answers.substr(0, sessionStorage.answers.length - last_answer.length - 1);

      setTimeout(function () {
        $(".answer_card[id='" + last_answer + "']").addClass("answer_clicked");
        $(".answer_card[id='" + last_answer + "']").html($(".answer_card[id='" + last_answer + "']").html() + "<i class=\"material-icons done_icon\">done</i>");
      }, 200);
    });


    $(".answer_card").one('click touch', function () {
      //(id_answer ins sessionStorage bei der Antwortauswahl speichern)

      var next_question = currentQuestion.rang;

      if($(".show_result").length==0) {
        if (sessionStorage.answers != "") {
          //trennzeichen zum splitten
          sessionStorage.answers += "~";
        }
        sessionStorage.answers += $(this).attr("id");

        $(this).css("background", "#CCCCCC");
        $(this).html($(this).html() + "<i class=\"material-icons done_icon\" style=color:#E20074!important>done</i>");
      }
      if (currentQuestion.rang < q.length) {

        setTimeout(function () {
          getQuestionsLayout(q[next_question]);
        }, 300);
      }

      //show "zum Ergebnis" button
      if (currentQuestion.rang == q.length && $(".show_result").length==0) {

        $(".answer_back").html($(".answer_back").html() + "<button class=\"mdl-button mdl-js-button mdl-button--raised show_result" + "\">" +
          "Zum Ergebnis <i class=\"material-icons arrow_back\">arrow_forward</i>" +
          "</button>");
        $(".question_back").on('click touch', function () {

          var previousNumber = $(this).attr("goto");
          setTimeout(function () {
            getQuestionsLayout(q[previousNumber - 1]);
          }, 200);
          var answers = sessionStorage.answers.split('~');
          var last_answer = answers[answers.length - 1];
          var double_last_answer = answers[answers.length - 2];
          sessionStorage.answers = sessionStorage.answers.substr(0, sessionStorage.answers.length - last_answer.length - double_last_answer.length - 2);

          setTimeout(function () {
            $(".answer_card[id='" + last_answer + "']").addClass("answer_clicked");
            $(".answer_card[id='" + last_answer + "']").html($(".answer_card[id='" + last_answer + "']").html() + "<i class=\"material-icons done_icon\">done</i>");
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

  /**
   * load Questions from webbrowser and build layout
   * @ Vladimir Doroch
   */
  function loadQuestions() {
    var req = new XMLHttpRequest();
    req.open("GET", base_url + "fragen/active", true);
    req.send();
    req.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){

        q = JSON.parse(this.responseText);
        q.sort(function(a,b){
          return a.rang - b.rang;
        });
        getQuestionsLayout(q[0]);
      }
    };
  }
});

/* This Function generates the html code of the result with security type, products and an overview about the answers.
 * @returns(array) p array of products
 */
  function loadProducts() {
    var req = new XMLHttpRequest();
    req.open("GET", base_url + "produkte", true);
    req.send();
    req.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        p = JSON.parse(req.responseText);
        var pSorted = [];
        a = [];
        for(var x of produkteMap) {
          a.push(x);
        }
        a.sort(function(x, y) {
          return y[1] - x[1];
        });
          for(var j = 0; j < a.length; j++){
            for (var i = 0; i < p.length; i++){
              var b = false;
              if(a[j][0] == p[i]._id){
                b = true;
              }
              //delete Product, it's not a recommendation
              if(b){
                pSorted.push(p[i]);
              }
            }
          }
        getProductRecomendation(pSorted);
      }
    };
  }
/* This Function generates the html code of the result with security type, products and an overview about the answers.
 * @params{array} p array of products
 * @returns(text) html_text DOM elements as string
 */
  function getProductRecomendation(p) {


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
  var user_answers="";
  for(var i=0; i<q.length; i++)
  {
    user_answers+='<span style=color:#000000 >'+ q[i].rang +'. '+ q[i].frage +'</span><br>';
    user_answers+='<span style=color:#9E9E9E class="overview_answers">'+' '+q[i].antworten[sessionStorage.answers.split('~')[i]-1].antwort_text+'</span><br>';
  }
  var question_overview = "";

  question_overview+='<br><div class="accordion_header">Die Produkte wurden auf Basis deiner Antworten ermittelt: </div><br><button id = "overview_button" onclick=fold_out("overview") class="accordion_button_overview"><span class="button_text">Hier findest Du deine Übersicht aller Ergebnisse</span></button><div id="overview" class="accordion_content"><p><br>' + user_answers + '</p></div><br>';


  var buttons_atresult = "<div class='mail_buttons_div'><button class = 'mail_buttons' onclick=answer_mailto()>Ergebnisse versenden</button>" + "<button class = 'mail_buttons' onclick=sendMail()> Kontaktieren </button></div>";
  $(".answer_back").remove();
  $("#card_grid_content").html(type + recommendations+question_overview+buttons_atresult);


  componentHandler.upgradeDom();
  $("#recom").width($("#recom").parent().width() - 40);


  $(".accordion_button_products").on('click touch', function () {
    var counter=$(this).attr("id").split('_')[1];
    fold_out("Produkt_" + counter);
    button_change("Button_"+counter);

  });
}

/**
 * opens mail programm of user with standard content and mail of "admin"
 */
function sendMail() {
  $.ajax({
    type: "GET",
    url: base_url + "users/contact",
    success: function (response) {
      var mail = response[0].email;

      var link = "mailto:"+mail
          +"?subject=Anfrage zu CloudReadinessCheck"
          +"&body=Sehr geehrte Damen und Herren,"+
          encodeURIComponent("\n\n bitte nehmen Sie Kontakt mit mir auf. Ich möchte mich genauer über ihre Sicherheitslösungen informieren. \n\n Vielen Dank")
        ;
      window.location.href = link;
    },
    error: function (response) {
    }
  });
}

/**
 *  This Function opens the local mail client and it sets the subject and the body.
 */
function answer_mailto(){
  var divider ="-----------------------------------------------------------------------------------";
  var mail_body = "\n"+divider+"\nDie Produkte wurden auf Basis deiner Antworten ermittelt:\n"+divider+"\n\n";
  var mail_info = "mailto:" + "?subject=" + "Ihr CloudReadinessCheck Ergebnis" + "&body="+divider;
  for(var i=0; i<q.length; i++)
  {
    mail_body+=q[i].rang +". "+ q[i].frage + "\n"+q[i].antworten[sessionStorage.answers.split('~')[i]-1].antwort_text+"\n\n";
  }
  var mail_products = "\nWir empfehlen Dir folgende Produkte für Dein Unternehmen:\n"+divider+"\n\n" + products_string;

  mail_body = encodeURIComponent(mail_products) + encodeURIComponent(mail_body);

  var mail_total = mail_info + mail_body;

  window.location.href = mail_total;
}

/**
 *  This Function activate the content of the products and overview by clicking on the button.
 * @params{number} content_id id of the content
 */
function fold_out(content_id) {
  var x = document.getElementById(content_id);
  if (x.className.indexOf("accordion_active") == -1) {
    if (x.id != "overview") {
      for (var i = 0; i < p.length; i++) {
        var y = document.getElementById('Produkt_' + i);
        if (y != undefined) {
          y.className = y.className.replace(" accordion_active", "");
        }
      }
    }
    x.className += " accordion_active";
    if (x.id == "overview"){
    $("#overview_button > .material-icons").html("keyboard_arrow_down");}
  } else {
    x.className = x.className.replace(" accordion_active", "");
    if (x.id == "overview"){
    $("#overview_button > .material-icons").html("keyboard_arrow_left");}
  }

}
/**
 *  This Function changes the arrows on the buttons by clicking them.
 * @params{number} button_id id of the button
*/
function button_change(button_id){
  var x = document.getElementById(button_id);
  if (x.className.indexOf("accordion_button_active") == -1) {
    for(var i = 0; i < p.length; i++){
      var y = document.getElementById('Button_' + i);
      if (y != undefined) {
        y.className = y.className.replace("accordion_button_active", " accordion_button_products");
        $("#"+y.id+" > .material-icons").html("keyboard_arrow_left");
      }
    }
    x.className = x.className.replace("accordion_button_products", "accordion_button_active");
    $("#"+button_id+" > .material-icons").html("keyboard_arrow_down");
  } else {
    x.className = x.className.replace("accordion_button_active", " accordion_button_products");
    $("#"+button_id+" > .material-icons").html("keyboard_arrow_left");
  }
}
