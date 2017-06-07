/**
 * Created by lizakanitz on 25.04.17.
 */


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



/*
 * This function sets events when page is loaded
 */
$(document).ready(function() {


  window.sessionStorage.setItem('options','');

  $("span[class='mdl-button__ripple-container']").height(36);

  /**
   * This function sets events for Start-Button
   */
  $("#btn_start_check").on('click touch', function() {
    //setSession
    sessionStorage.clear();
    options = "";
    load_Options();
    load_Statements(getStatementsLayout);
    $(".mdl-layout__content").addClass("light_blue_background");
  });


  /**
   * This function creates DOM Elements for Statement layout and adds them to the page.
   * @param{Object} currentStatement
   */
  function getStatementsLayout(currentStatement) {
    var progress_circles;
    progress_circles = setProgressCircles(statements.length, currentStatement.statement_rank);


    var card_layout;
    var card_grid_definition = "<div class=\"mdl-grid\">" +



     "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp card_recom\" id=\"card_grid_content\">";
    var card_statement = "<div class=\"mdl-card__title\" statement_id='" + currentStatement.statement_rank+ "'><h2 class=\"mdl-card__title-text statement_number\"> "
      + currentStatement.statement_rank + "/" + statements.length + "</h2></div>" +
      "<div class=\"mdl-card__supporting-text statement_text\">" + currentStatement.statement_text + "</div>";


    var slider_for_options = "<div class=\"slider_area\"><div id=\"slider\"></div><div id=\"list_of_options\">";
    var option_step = 0;
    var score = [100,0,-1];
    slider_for_options += "<table class='options_table'><tr>";
    for (var j = 0; j < ops.length; j++) {
      switch(j)
      {
        case 0:
          slider_for_options += "<td class='option_cell_first'>";
          break;
        case ops.length-1:
          slider_for_options += "<td class='option_cell_last'>";
          break;
        default:
          slider_for_options += "<td class='option_cell'>";
          break;

      }

      slider_for_options += "<span step='"+option_step+"' id='option_with_step_" + score[j] + "' option_rang='"+ops[j].rank+"' option_id='" + ops[j]._id+ "' ";
      if (j == 0) {
        slider_for_options += "class='option_with_step selected_option'>";
      }
      else {
        slider_for_options += "class='option_with_step'>";
      }
      slider_for_options += ops[j].option_text + " </span></td>";
      option_step += 100 / (ops.length - 1);//score[j];


    }
    slider_for_options+="</tr></table>";
    slider_for_options += "</div></div>";
    var card_grid_end = "<div class='option_back'></div></div></div>";

    card_layout = progress_circles+card_grid_definition + card_statement + slider_for_options + card_grid_end;

    $("#main_content").html(card_layout);


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
      var newvalue = $(this).attr("step");//.split('_')[3]
      sliderChangedValue(currentStatement, newvalue, $(this).attr("option_id"));
    });



    $("#slider").slider({
      step: 50, change: function (event, ui) {

       }
    });


  }

  /**
   * This function creates DOM Elements for Statement layout and adds them to the page.
   * @param{Object} currentStatement,
   * @param{Object} newvalue,
   * @param{Object} optionId
   */
  function sliderChangedValue(currentStatement, newvalue, optionId) {
    var selection = $("#slider").slider("value");

    var selected_option = $(".option_with_step[step='" + newvalue + "']");
    var newscore=$(".option_with_step[step='" + newvalue + "']").attr("id").split('_')[3];


    currentStatement.score = currentStatement.points * (newscore / 100);

    // Slider Value Setter
    $("#slider").slider("option", "value", newvalue);

    // Mark Slider Selected Value
    $('.option_with_step').removeClass("selected_option");
    selected_option.addClass("selected_option");


    var next_statement = parseInt($(".mdl-card__title[statement_id]").attr("statement_id"));

// Save options in Session Storage
    if ($(".show_result").length == 0 || (currentStatement.statement_rank == statements.length && sessionStorage.options.split('~').length<statements.length)) {
      if (sessionStorage.options != "" && sessionStorage.options != undefined) {
        sessionStorage.options += "~";
      } else {
        sessionStorage.options = "";
      }
      sessionStorage.options += getResultIdByStatementIdAndOptionId(currentStatement._id, optionId);
    }

    if (currentStatement.statement_rank < statements.length) {

      setTimeout(function () {
        getStatementsLayout(statements[next_statement]);
      }, 300);
    }


  }

});


/**
 * This function calculates the padding value from the left side for each option.
 * @param{Object} option_index
 */
function getActualPaddingFromLeft(option_index) {

  var actualPadding;
  var allWidth = $(".slider_area").width();

  if (option_index == 1) {
    actualPadding = 0;
  }
  else {
    actualPadding = parseInt(allWidth / ops.length);// - elem_width
  }
  elem_width = $(".option_with_step[option_rang='" + option_index + "']").width();
  return actualPadding;
}
/**
 * This function loads the results from database.
 */
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
/**
 * This function generates the HTML code for the results page.
 * @param{Object} r
 */
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

  var result_card="", result_card_begin = "", result_card_end="";
  result_card_begin += "<div class=\"mdl-grid\">";
var middle_card;



  middle_card="<div class=\"mdl-card mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-shadow--2dp middle_card\">";
  // //<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp\" id=\"card_grid_content\">";
  middle_card +=  "<div class=\"mdl-card__title middle_card\"><h2 class=\"mdl-card__title-text id='result_as_text' \">";
  middle_card +=  "Ihre Bereitschaft für die Cloud beträgt: <span id='result_in_percent'></span></h2></div>" ;
  middle_card +=  "<div class=\"mdl-card__supporting-text id='card_for_chart'\">";
  middle_card += "<div id='chart_area'><canvas id='myChart' style=\"width='100%';\"></canvas></div>";
  middle_card +=  "</div></div>";

  var box1 ="<div class=\"mdl-card mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-shadow--2dp box1\">";
  //box1+='<div class="box1">';//<div class="header1">VORTEILE</div>';
  box1+=  "<div class=\"mdl-card__title \"><h2 class=\"mdl-card__title-text box1_text\">";
  box1 +=  "VORTEILE</h2></div>" ;
  var lfdNr = 0;
  for (var i = 0; i < 5; i++) {
    if (r[i] == undefined){
      //next element
    } else {
      var Text = '<p><dfn class="tooltip1">'+r[i].chance_short_text+
      '<span rel="tooltip1">' + r[i].chance_text + '</span>' +
      '</dfn>' +
      '</p>';
    if (r[i].chance_text != "") {
        lfdNr += 1;
        box1 += '<div class="data"><div class="thumb_icon"><img class="Thumbs" src="Images/Thumb_Up.png" alt="Daumen hoch"</img></div><div class="datatext">' + Text +  '</div></div>';
      }
    }}
  box1 += '</div>';

  var box2 ="<div class=\"mdl-card mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-shadow--2dp box2\">";
 // box2+='<div class="box2">';//<div class="header2">RISIKEN</div>';
  box2+=  "<div class=\"mdl-card__title box2\"><h2 class=\"mdl-card__title-text box2_text\">";
  box2 +=  "RISIKEN</h2></div>" ;
  lfdNr = 0;
  for ( i = 0; i < 5; i++) {
    Text = '<p><dfn class="tooltip2">' +r[i].risk_short_text+
      '<span rel="tooltip2">' + r[i].risk_text + '</span>' +
      '</dfn>' +
      '</p>';

    if (r[i].risk_text != "") {
      lfdNr += 1;
     box2 += '<div class="data"><div class="thumb_icon"><img class="Thumbs" src="Images/Thumb_Down.png" alt="Daumen runter"</img></div><div class="datatext">' + Text + '</div></div>';

    }

  }
  box2+="</div>";

  result_card_end="</div></div>";
  result_card +=result_card_begin+ box1 +middle_card+ box2 + result_card_end;


  var buttons_atresult = "<div class='mail_buttons_div'><button class = 'mail_buttons' onclick=answer_mailto()>Ergebnisse versenden</button>" + "<button class = 'mail_buttons' onclick=sendMail()> Kontaktieren </button></div>";


  $("#main_content").html(result_card + buttons_atresult);
  $("#result_in_percent").html(+percentage+'%');
 var new_width=$("#main_content").find("#card_for_chart").width();

  $("#myChart").css("width", new_width);
switch (true){
  case (parseInt(percentage)<30):
    //red
    $("#result_in_percent").addClass("percent_text_red");
        break;
  case (parseInt(percentage)<70):
    //yellow
    $("#result_in_percent").addClass("percent_text_yellow");
        break;
  default:
    //green
    $("#result_in_percent").addClass("percent_text_green");
        break;

}




  var data = {
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Bereitschaft',
      'Risiken'
    ],

    datasets: [{
      data: [percentage, 100-percentage],
      label: "%-Bereitschaft",
      backgroundColor: ["#FFFFFF", "#9E9E9E"]
    }]
  };

  //Diagram activation
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx,{
    type: 'pie',
    data: data,
    options: {
      legend: {
        display: false
      },
      animation: {
        duration: 0,
        onComplete: function () {
          var self = this,
            chartInstance = this.chart,
            ctx = chartInstance.ctx;

          ctx.font = '18px Arial';
          ctx.textAlign = "center";
          ctx.fillStyle = "#303F9F";

          Chart.helpers.each(self.data.datasets.forEach((dataset, datasetIndex) => {
            var meta = self.getDatasetMeta(datasetIndex),
              total = 0, //total values to compute fraction
              labelxy = [],
              offset = Math.PI / 2, //start sector from top
              radius,
              centerx,
              centery,
              lastend = 0; //prev arc's end line: starting with 0

            for (var val of dataset.data) { total += val; }

            Chart.helpers.each(meta.data.forEach((element, index) => {
              radius = 0.9 * element._model.outerRadius - element._model.innerRadius;
              centerx = element._model.x;
              centery = element._model.y;
              var thispart = dataset.data[index],
                arcsector = Math.PI * (2 * thispart / total);
              if (element.hasValue() && dataset.data[index] > 0) {
                labelxy.push(lastend + arcsector / 2 + Math.PI + offset);
              }
              else {
                labelxy.push(-1);
              }
              lastend += arcsector;
            }), self)

            var lradius = radius * 3 / 4;
            for (var idx in labelxy) {
              if (labelxy[idx] === -1) continue;
              var langle = labelxy[idx],
                dx = centerx + lradius * Math.cos(langle),
                dy = centery + lradius * Math.sin(langle),
                val = Math.round(dataset.data[idx] / total * 100);

                ctx.fillText(val + '%', dx, dy);


            }

          }), self);
        }
      }
    }
  });

  $("#myChart").css("width", "400px");
  $("#myChart").css("height", "400px");
  $("#myChart").css("font-size", "32px inportant!");

}
/**
 * This function opens the local mail client and fill the body with the result.
 */
function answer_mailto(){
  var divider ="-----------------------------------------------------------------------------------";
  var mail_body = divider+'\nVorteile:\n'+divider+'\n\n';
  var mail_info = "mailto: " + "?subject=" + "Ihr Cloud Readiness Check Ergebnis" + "&body=";
  var mail_advantages;
  var mail_risks = '\n'+divider+'\nRisiken:\n'+divider+'\n\n';
  for(var i=0; i<r.length; i++)
  {
    if(r[i].chance_text != "") {
      mail_advantages += r[i].chance_text + '\n';
    }
    if(r[i].risk_text != "") {
      mail_risks += r[i].risk_text + '\n';
    }
  }
  mail_body = encodeURIComponent(mail_body) + encodeURIComponent(mail_advantages)+ encodeURIComponent(mail_risks);
  var mail_total;
  mail_total = mail_info + mail_body;

  window.location.href = mail_total;
}

/**
 * This function opens the local mail client, fills the recipient with the mail address of the administrator and fills the body with a contact request.
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
          encodeURIComponent("\n\n bitte nehmen Sie Kontakt mit mir auf. Ich möchte mich genauer über eine Cloudlösung informieren. \n\n Vielen Dank")
        ;
      window.location.href = link;
    },
    error: function (response) {
    }
  });
}
