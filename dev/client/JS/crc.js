/**
 * Created by lizakanitz on 25.04.17.
 */


//let url = location.protocol + '//' + location.host+'/';
var url = 'http://localhost:4000/'; //for loacal access
var base_url = url + 'api/'; // for local testing
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

   // console.log("TEST");

    sessionStorage.clear();
    window.sessionStorage.setItem('options','');
    options = "";
    getStatementsLayout(statements[0]);
    $(".mdl-layout__content").addClass("light_blue_background");

   $("#slider").slider({step:25, change: function( event, ui ) {sliderChangedValue()} });
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


    var slider_for_options = "<div class=\"slider_area\"><div id=\"slider\"></div><div id=\"list_of_options\">";
   // for (var i = 0; i < currentStatement.options.length; i++)
  //  {
 //  var option_id = i + 1;
    var option_step=0;
    var padding_from_left;
      for (var j=0; j<ops.length; j++)
      {
padding_from_left=getActualPaddingFromLeft(j);
slider_for_options+= "<span id='option_with_step_"+option_step+"' option_id='"+ops[j].option_id+"' style='padding-left: "+padding_from_left+"'";
if(j==0)
{
  slider_for_options+="class='option_with_step selected_option'>";
}
else{
  slider_for_options+="class='option_with_step'>";
}
slider_for_options+=ops[j].option_text+" </span>";
option_step+=100/(ops.length-1);
       // if(currentStatement.options[i].option_id==ops[j].option_id)
        //{
         // break;
        //}
      }

  //  }

    slider_for_options+="</div></div>";
    var card_grid_end = "<div class='option_back'></div></div></div>";

    card_layout = card_grid_definition + card_statement + slider_for_options + card_grid_end;

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


    $(".option_with_step").on('click touch', function () {
      var newvalue = $(this).attr("id").split('_')[3];
      //  $( "#slider" ).slider( "value" );
      var selected_option=$(this);

      // Slider Value Setter
      $( "#slider" ).slider( "option", "value", newvalue );

      $('.option_with_step').removeClass("selected_option");
      selected_option.addClass("selected_option");
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

function sliderChangedValue(){
  var selection = $( "#slider" ).slider( "value" );
  var selected_option=$('.option_with_step[id=option_with_step_'+selection+']');
  $('.option_with_step').removeClass("selected_option");
  selected_option.addClass("selected_option");
}

function getActualPaddingFromLeft(option_index)
{
  var actualPadding;
  var allWidth=$(".slider_area").css(width);
  actualPadding=(allWidth/ops.length)*option_index;
  return actualPadding;
}
