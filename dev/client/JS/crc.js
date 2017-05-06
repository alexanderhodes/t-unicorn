/**
 * Created by lizakanitz on 25.04.17.
 */


let url = location.protocol + '//' + location.host+'/';
//let url = 'http://localhost:4000/'; //for loacal access
let base_url = url + 'api/'; // for local testing
//let url = 'http://10.1.88.8:4000/ // REST-Api deployment server
//let base_url = 'http://10.1.88.8:3001/api/'; // REST-Api deployment server

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
    $(".mdl-layout__content").addClass("light_blue_background");

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
    var card_statement = "<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text statement_number\"> "
      + currentStatement.rang + "/"+statements.length+"</h2></div>" +
      "<div class=\"mdl-card__supporting-text statement_text\">" + currentStatement.statement_text + "</div>";

    var card_options = "";

    for (var i = 0; i < currentStatement.options.length; i++) {

      var option_id = i + 1;
      for (var j=0; j<ops.length; j++)
      {
        if(currentStatement.options[i].option_id==ops[j].option_id)
        {
          card_options +="<div class=\"mdl-card__actions mdl-card--border option_card\" id='"+option_id+"'>"+
            ops[j].option_text+"</div>";
          break;
        }
      }

    }
   // card_options="<div ng-controller=\"AppController\" ><rzslider rz-slider-model=\"slider.value\""+
    //     "rz-slider-options=\"slider.options\"></rzslider></div>";


    var card_grid_end = "<div class='option_back'></div></div></div>";

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

      }

    });
  }

});






/*unction putSliderIn(){
  angular.module('crc', [])
  .controller('ArticlesCtrl', function($scope){
    $scope.slider = {
  value: 5,
  options: {
    showTicksValues: true,
    stepsArray: [
      {value: 1, legend: 'Very poor'},
      {value: 2},
      {value: 3, legend: 'Fair'},
      {value: 4},
      {value: 5, legend: 'Average'},
      {value: 6},
      {value: 7, legend: 'Good'},
      {value: 8},
      {value: 9, legend: 'Excellent'}
    ]
  }
};
  });
}
*/
function AppController($scope) {
$scope.slider = {
  value: 5,
  options: {
    showTicksValues: true,
    stepsArray: [
      {value: 1, legend: 'Trifft nicht zu'},
      {value: 2},
      {value: 3, legend: 'Trifft eher zu'},
      {value: 4},
      {value: 5, legend: 'Ich bin mir nicht sicher'},
      {value: 6},
      {value: 7, legend: 'Trifft eher nicht zu'},
      {value: 8},
      {value: 9, legend: 'Trifft nicht zu'}
    ]
  }
};
}

function show_result(){
  var result_percent = '<div class="resultbackground"><div class="result"></div></div>';
  var result = "";
  result += '<div class="bigbox">';
  var box1 = '<div class="box1"><div class="header1">VORTEILE</div>';
  for (var i = 0; i < 3; i++) {
    box1 += '<div class="data"><div class="bild"><i class="material-icons">pan_tool</i></div><div class="dataheader1">' + i + '.Vorteil</div><div class="datatext">Das ist ein Vorteil.</div></div>';
  }
  box1 += '</div>';
  var box2 = '<div class="box2"><div class="header2">RISIKEN</div>';
  for (var i = 0; i < 3; i++) {
    box2 += '<div class="data"><div class="bild"><i class="material-icons">pan_tool</i></div><div class="dataheader2">' + i + '.Risiko</div><div class="datatext">Das ist ein Risiko.</div></div>';
    box2 += '<br><br>';
  }
  result += box1 + box2 + '</div></div>';

  $("#card_grid_content").html(result_percent+result);

  componentHandler.upgradeDom();
  $("#recom").width($("#recom").parent().width() - 40);
}
