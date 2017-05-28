/**
 * Created by lizakanitz on 25.04.17.
 */


//let url = location.protocol + '//' + location.host+'/';
var url = 'http://localhost:4000/'; //for loacal access
var base_url = url + 'api/'; // for local testing
var r;

var elem_width = 0;


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
    //loadResults();
    load_Options();
    load_Statements(getStatementsLayout);
    $(".mdl-layout__content").addClass("light_blue_background");
    //getStatementsLayout(statements[0]);
  });




  /**
   * This function creates DOM Elements for Statement layout and adds them to the page.
   * @param{Object} currentStatement
   */

  function getStatementsLayout(currentStatement) {
    //var progress_circles;
    //progress_circles = setProgressCircles(q.length, currentStatement.rang);


    var card_layout;
    var card_grid_definition = "<div class=\"mdl-grid\">" +
      "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp card_recom\" id=\"card_grid_content\">";
    var card_statement = "<div class=\"mdl-card__title\" statement_id='" + currentStatement.statement_rank+ "'><h2 class=\"mdl-card__title-text statement_number\"> "
      + currentStatement.statement_rank + "/" + statements.length + "</h2></div>" +
      "<div class=\"mdl-card__supporting-text statement_text\">" + currentStatement.statement_text + "</div>";


    var slider_for_options = "<div class=\"slider_area\"><div id=\"slider\"></div><div id=\"list_of_options\">";
    var option_step = 0;
    var score = [100,65,35,0,-1];

    for (var j = 0; j < ops.length; j++) {

      slider_for_options += "<span id='option_with_step_" + score[j] + "' option_id='" + ops[j]._id + "' ";
      if (j == 0) {
        slider_for_options += "class='option_with_step selected_option'>";
      }
      else {
        slider_for_options += "class='option_with_step'>";
      }
      slider_for_options += ops[j].option_text + " </span>";
      option_step = score[j];//100 / (ops.length - 1);

    }
   // card_options="<div ng-controller=\"AppController\" ><rzslider rz-slider-model=\"slider.value\""+
    //     "rz-slider-options=\"slider.options\"></rzslider></div>";


    slider_for_options += "</div></div>";
    var card_grid_end = "<div class='option_back'></div></div></div>";

    card_layout = card_grid_definition + card_statement + slider_for_options + card_grid_end;

    $("#main_content").html(card_layout);



    $(".option_with_step").each(function () {
      var padding_from_left = getActualPaddingFromLeft($(this).attr("option_id"));
      $(this).css("padding-left", padding_from_left)

    });

    $(".mdl-layout").attr("class", "mdl-layout mdl-js-layout mdl-layout--fixed-header  white-layout");

    if (currentStatement.statement_rank > 1 && currentStatement.statement_rank <= statements.length) {
      $(".option_back").html("<button class=\"mdl-button mdl-js-button mdl-button--raised statement_back\" goto=\"" + (currentStatement.statement_rank - 1) + "\">" +
        "<i class=\"material-icons arrow_back\">arrow_back</i>Zurück " +
        "</button>");
    }
    if (currentStatement.statement_rank == statements.length) {
      $(".option_back").html($(".option_back").html() + "<button onclick='loadResultsByIdFromSessionStorage()' class=\"mdl-button mdl-js-button mdl-button--raised show_result\" >" +
        "<i class=\"material-icons arrow_forward\">arrow_forward</i>Zum Ergebnis " +
        "</button>");
    }


    $(".statement_back").on('click touch', function () {

      var previousNumber = $(this).attr("goto");
      setTimeout(function () {
        getStatementsLayout(statements[previousNumber - 1]);
      }, 200);
      var options = sessionStorage.options.split('~');
      var last_option = options[options.length - 1];
      if (currentStatement.statement_rank==1) {sessionStorage.options=""};
      sessionStorage.options = sessionStorage.options.substr(0, sessionStorage.options.length - last_option.length - 1);


    });


    $(".option_with_step").on('click touch', function () {
      var newvalue = $(this).attr("id").split('_')[3];
      currentStatement.score = currentStatement.points * (newvalue / 100);

      var selected_option = $(this);

      // Slider Value Setter
      $("#slider").slider("option", "value", newvalue);

      $('.option_with_step').removeClass("selected_option");
      selected_option.addClass("selected_option");


      var next_statement = parseInt($(".mdl-card__title[statement_id]").attr("statement_id"));


      if ($(".show_result").length == 0 || (currentStatement.statement_rank == statements.length && sessionStorage.options.split('~').length<statements.length)) {
        if (sessionStorage.options != "") {
          //trennzeichen zum splitten
          sessionStorage.options += "~";
        }
        sessionStorage.options += getResultIdByStatementIdAndOptionId(currentStatement._id,$(this).attr("option_id"));
        console.log(getResultIdByStatementIdAndOptionId(currentStatement._id,$(this).attr("option_id")));
      }

      if (currentStatement.statement_rank < statements.length) {

        setTimeout(function () {
          getStatementsLayout(statements[next_statement]);
        }, 300);
      }

    });





    $("#slider").slider({
      step: 50, change: function (event, ui) {
        sliderChangedValue()
      }
    });


  }

});

function sliderChangedValue() {
  var selection = $("#slider").slider("value");
  var selected_option = $('.option_with_step[id=option_with_step_' + selection + ']');
  $('.option_with_step').removeClass("selected_option");
  selected_option.addClass("selected_option");
}

function getActualPaddingFromLeft(option_index) {
  var actualPadding;
  var allWidth = $(".slider_area").width();

  if (option_index == 1) {
    actualPadding = 0;
    //last_padding=;
  }
  else {
    actualPadding = parseInt(allWidth / ops.length - elem_width);
  }
  elem_width = $(".option_with_step[option_id='" + option_index + "']").width();

  //actualPadding=parseInt((allWidth/ops.length)*(option_index-1))-parseInt(last_padding);

  return actualPadding;
}

function load_Results() {
  loadResultsByIdFromSessionStorage();
  var req = new XMLHttpRequest();
  req.open("GET", base_url + "results", true);
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){

      r = JSON.parse(this.responseText);
      r.sort(function(a,b){
        return a.rang - b.rang;
      });
      show_result(r);
    }
  };
};

function show_result(r){

  var percentage = 0;
  var statements_sum_points = 0;

  //calculate max. points
  for (index = 0; index < statements.length;index++){
    if(statements[index].score>=0){statements_sum_points += statements[index].points;}
  }
  //calculate score
  for (index = 0; index < statements.length;index++){
    if(statements[index].score>=0){percentage += (statements[index].score / statements_sum_points);}
  }

  percentage = Math.round(percentage*100);

  var result_percent = '<div class="result_background">' + percentage +' %</div>';
  var result = "";
  result += '<div class="bigbox">';
  var box1 = '<div class="box1"><div class="header1">VORTEILE</div>';
  var lfdNr = 0;
  for (var i = 0; i < 5; i++) {
    if (r[i] == undefined){
      //next element
    } else {
      var Text = r[i].chance_text;
      if (Text != "") {
        lfdNr += 1;
        box1 += '<div class="data"><div class="bild"><i class="material-icons">pan_tool</i></div><div class="dataheader1">' + lfdNr + '.Vorteil</div><div class="datatext">' + Text +  '</div></div>';
      }
    }}
  box1 += '</div>';
  var box2 = '<div class="box2"><div class="header2">RISIKEN</div>';
  lfdNr = 0;
  for ( i = 0; i < 5; i++) {
    var Text = r[i].risk_text;
    if (Text != "") {
      lfdNr += 1;
     box2 += '<div class="data"><div class="bild"><img src="Images\Thumb_Down.png" alt="Daumen runter"></div><div class="dataheader2">' + lfdNr + '.Risiko</div><div class="datatext">' + Text + '</div></div>';
     box2 += '<br><br>';
    }
  }
  result += box1 + box2 + '</div></div>';

  $("#main_content").html(result_percent + result);
}
