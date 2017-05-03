/**
 * Created by vladimirdoroch on 02.01.17.
 */
var catalogs;

/**
 * Lade Kataloge aus Datenbank vie HTTP-GET-Request und triggere das laden weiterer Collections
 */
function getCatalogData() {

  // Lade Kataloge und speichere in catalogs
  var reqCatalogs = new XMLHttpRequest();
  reqCatalogs.open("GET", base_url + "kataloge",true);
  setHeader(reqCatalogs);
  reqCatalogs.send();
  reqCatalogs.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      catalogs = JSON.parse(this.responseText);
      catalogs.sort(function(a,b){
        return a._id - b._id;
      });

      $("#catalogs_container").html(buildHTMLCatalog(true));
      getQuestionsData();
      getProductsData();

    }
  };
}

/**
 * Ändere Katalognamen und schicke Änderungen per HTTP-PUT-Request anhand.
 *
 * Index ist die Position im globalen Array catalogs ( catalogs[index] )
 * @param index {Integer}
 */
function setNameCatalog(index){
  if($('#catalog_edit'+index).attr('value')=='set'){
    $('#catalog_edit'+index).attr('value','set_mode');
    $('#catalog_icon'+index).html('save');

    inputField =
      '<div class="edit_catalog_name">' +
      '<div class="group">'+
        '<input type="text" id="newCatalogName" required value="' + catalogs[index].titel+ '">'+
      '<label>Gib einen neuen Titel ein.</label>'+
      '</div>' +
    '</div>';

    $('#catalog'+index).html(inputField);
  } else {
    catalogs[index].titel = $('#newCatalogName').val();
    $.ajax({
      type: "PUT",
      url: base_url + "kataloge/" + catalogs[index]._id,
      data: catalogs[index],
      beforeSend: setHeader,
      success: function (response) {
        getCatalogData();
      },
      error: function (response) {
      }
    });
  }
}

/**
 * Lege neuen Katalog in DB an per HTTP-POST-Request
 */
function newCatalog(){
  params = {
    titel:"neuer Katalog",
    fragen:[],
    ist_aktiv: false
  };

  $.ajax({
    type: "POST",
    url: base_url + "kataloge/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData();
    },
    error: function (response) {
    }
  });
}

/**
 * Lösche Katalog aus DB via HTTP-DELETE-Request über die Katalog-ID
 * @param catalog_id {String}
 */
function deleteCatalog(catalog_id){
$.ajax({
    type: "DELETE",
    url: base_url + "kataloge/"+catalog_id,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData();
    },
    error: function (response) {
    }
  });
}

/**
 * Setzte einen Katalog auf Aktiv vie HTTP-PUT-Request
 *
 * Katalog ID
 * @param catalog_id {String}
 *
 * Position in globalem catalogs Array ( catalogs[index] }
 * @param index {Integer}
 */
function setCatalogActive(catalog_id, index) {

  if($('#catalog_edit'+index).attr('value')=='set') {
    for (var i = 0; i < catalogs.length; i++) {

      if (catalogs[i]._id == catalog_id) {
        catalogs[i].ist_aktiv = true;
      } else {
        catalogs[i].ist_aktiv = false;
      }

      $.ajax({
        type: "PUT",
        url: base_url + "kataloge/" + catalogs[i]._id,
        data: catalogs[i],
        beforeSend: setHeader,
        success: function (response) {
          getCatalogData();
        },
        error: function (response) {
        }
      });
    }

    getCatalogData();
  }

}

/**
 * Get Catalog by ID
 * @param id {String} CatalogId
 * @returns {JSON} Catalog element
 */
function getCatalogByID(id){
  for(var i = 0; i<catalogs.length; i++){
    if(catalogs[i]._id == id){
      return catalogs[i];
    }
  }
}

/**
 *
 * Erzeuge neue Frage im Katalog und speichere die neue FrageID im Katalog in der DB via POST-Message
 *
 * @param catalogId {String}
 */
function newQuestion(catalogId){
  var questions = getQuestionsByCatalog(getCatalogByID(catalogId));
  //calculate rang
  var newRang = 0;
  for(var i = 0; i < questions.length; i++){
   // var q = getQuestionByID()

    if(newRang < questions[i][0].rang){
      newRang = questions[i][0].rang;
    }
  }
  newRang = newRang+1;
  params = {
    frage:"neue Frage",
    rang: newRang,
    antworten: []
  };

  //add Question
  $.ajax({
    type: "POST",
    url: base_url + "fragen/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      var catalog;
      for (var i = 0; i < catalogs.length; i++) {
        if(catalogs[i]._id == catalogId){
          catalog = catalogs[i];
        }
      }
      addAnswer(response._id,0);
      //add To Catalog
      //deleteCatalog(catalogId);
      let params = {id: catalogId, frageId: response._id};
      $.ajax({
        type: "PUT",
        url: base_url + "kataloge/"+ catalogId +"/fragen/new",
        data: params,
        beforeSend: setHeader,
        success: function (response) {
          getCatalogData();
        },
        error: function (response) {
        }
      });
    },
    error: function (response) {
    }
  });

  /*
   deleteCatalog(catalogId);
   $.ajax({
   type: "POST",
   url: base_url + "kataloge/",
   data: catalog,
   success: function (response) {
   getCatalogData();
   },
   error: function (response) {
   }
   });
   },
   error: function (response) {
   }
   });

   //deleteCatalog(catalogId);
  let params = {id: catalogId, frageId: response._id};
  $.ajax({
    type: "PUT",
    url: base_url + "kataloge/"+ catalogId +"/fragen",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData();
    },
    error: function (response) {
    }
  });
},
error: function (response) {
}
});
   */
}

/**
 * Erstelle HTML-Code für jeden Katalog und gebe das Ergebnis aus
 * @returns {String}
 */
function buildHTMLCatalog() {
  var html='';

  var addCatalogHTML =
    '<!-- Button Katalog hinzufügen -->'+
    '<button onclick="newCatalog()" id="add_catalog" type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect admin_button">'+
      'Katalog hinzufügen'+
    '</button>';

  for(var i=0;i<catalogs.length;i++) {
    var active_class = 'class="mdl-card__title-text catalog_name unactive"';
    if(catalogs[i].ist_aktiv===true){active_class = 'class="mdl-card__title-text catalog_name"'}

    var card_head = "<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp catalog\">" +
            '<div id="catalog'+i+'" onclick="setCatalogActive(\''+catalogs[i]._id+'\','+i+')" class="mdl-card__title grey-font">'+
              '<h2 d="catalogTitel'+i+'" ' + active_class + ">" + (i+1) + '. ' +  catalogs[i].titel + "</h2>";
    if(catalogs[i].ist_aktiv===true){card_head += "<i class=\"material-icons active_catalog\">check_circle</i>"}

    card_head +=
            "</div>" +
            "<div class=\"mdl-card__supporting-text grey-font\">"+ "Fragen im Katalog:" + "</div>";

    let card_questions = '<div " id="'+ catalogs[i]._id +'"></div>'+
      '<!-- Button Frage hinzufügen-->'+
      '<div class="mdl-card__actions mdl-card--border add_question_frame">'+
        '<button  onclick="newQuestion(\''+catalogs[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_question">'+
          '<i class="material-icons">add</i>'+
        '</button>'+
        'Frage hinzufügen'+
      '</div>';
    let card_foot =
        '<div class="mdl-card__menu">'+

          '<!-- Button Katalogname ändern-->'+
          '<button id="catalog_edit'+i+'" value="set" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="setNameCatalog('+i+')">'+
            '<i id="catalog_icon'+i+'" class="material-icons">mode_edit</i>'+
          '</button>'+

          '<!-- Button Katalog löschen-->'+
          '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="deleteCatalog(\''+catalogs[i]._id+'\')">'+
            '<i class="material-icons">delete</i>'+
          '</button>'+
        '</div>'+
      '</div>';

    html += card_head + card_questions + card_foot;
  }
  if(catalogs.length===0){
    return addCatalogHTML;
  } else {
    html += addCatalogHTML;}

  return html;
}


