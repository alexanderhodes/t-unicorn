var products;

/**
 *  Lade Produkte per HTTP GET-Request und speichere in globaler variable products
 */
function getProductsData() {

  // Lade Produkte und speichere in products
  var reqProducts = new XMLHttpRequest();
  reqProducts.open("GET", base_url + "produkte",true);
  setHeader(reqProducts);
  reqProducts.send();
  reqProducts.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      products = JSON.parse(this.responseText);
      products.sort(function(a,b){
        return a.titel - b.titel;
      });
      if(security_type != undefined) {
        $("#security_type_container").html(buildHTMLSecurityType());
      }
      $("#product_container").html(buildProductListHTML());
    }
  };

}

/**
 * Erstelle für jedes Produkt in products eine HTML-Card
 *
 * Gibt HTML-Cards aller Produkte als String zurück
 * @returns {string}
 */
function buildProductListHTML(){
  let html = '';

  products.forEach(function (product) {
    html +=
      '<!-- Produkttext -->'+
      '<div class="question_title">'+
        '<span id="product_titel'+product._id+'" class="questiontext">' +
          '<b>Produkt: </b>' + product.titel +
        '</span>'+

        '<!-- Buttons für das erste Produkt -->'+
        '<span class="question_buttons">'+

          '<!-- Button Produkt 1 ändern-->'+
          '<button onclick="setNameProduct(\''+product._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
          '<i id="product_edit'+product._id+'" class="material-icons">mode_edit</i>'+
          '</button>'+

          '<!-- Button Produkt 1 löschen-->'+
          '<button onclick="deleteProduct(\''+product._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i class="material-icons">delete</i>'+
          '</button>'+
        '</span>'+
      '</div>'+

      '<!-- Attribute für das Produkt-->'+
      '<div class="answer_list">'+

        '<!-- Beschreibung -->'+
        '<div class="answer_text">'+
          '<span id="product_description'+product._id+'">'+
          '<b>Beschreibung: </b>' + product.beschreibung+
          '</span>'+

          '<!-- Button Beschreibung ändern-->'+
          '<span class="answer_buttons">'+
            '<button onclick="setDescriptionProduct(\''+product._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i id="desc_edit'+product._id+'" class="material-icons">mode_edit</i>'+
            '</button>'+
          '</span>'+
        '</div>'+

        '<!-- Produktlogo -->'+
        '<div class="answer_text">'+
          '<span id="product_logo'+product._id+'">'+
            '<b>Produktbild: </b>' + product.uri_logo+
          '</span>'+
            '<!-- Button Produktlogo ändern-->'+
          '<span class="answer_buttons">'+
            '<button onclick="setLogoProduct(\''+product._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
            '<i id="logo_edit'+product._id+'" class="material-icons">mode_edit</i>'+
            '</button>'+
          '</span>'+
        '</div>'+

        '<!-- Produktlink -->'+
        '<div class="answer_text">'+
          '<span id="product_link'+product._id+'">'+
            '<b>Produktlink: </b>' + product.link+
          '</span>'+
            '<!-- Button Produktlink ändern-->'+
            '<span class="answer_buttons">'+
            '<button onclick="setLinkProduct(\''+product._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
              '<i  id="link_edit'+product._id+'" class="material-icons">mode_edit</i>'+
            '</button>'+
          '</span>'+
        '</div>'+
      '</div>';
  });

  html +=
    '<!-- Button Produkt hinzufügen-->'+
    '<div class="mdl-card__actions mdl-card--border add_question_frame">'+
      '<button onclick="newProduct()" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_question">'+
        '<i class="material-icons">add</i>'+
      '</button>'+
      'Produkt hinzufügen'+
    '</div>';

  return html;
}

/**
 * Lade Produkt aus globaler variable products anhand der ID
 *
 * Produkt ID
 * @param id {string}
 *
 * Gebe JSON von passendem Produkt zurück
 * @returns {*}
 */
function getProductById(id) {
  return $.grep(products, function (e) {
    return e._id === id;
  })[0];
}

/**
 * Speichere neues Produkt in Datenbank per HTTP-POST-Request
 */
function newProduct(){
  params = {
    titel: "Produkt Namen einfügen",
    beschreibung: "Beschreibung einfügen",
    uri_logo: "Link zum Produktbild einfügen",
    link: "Link zum Produkt einfügen."
  };

  $.ajax({
    type: "POST",
    url: base_url + "produkte/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData()
    },
    error: function (response) {
    }
  });
}

/**
 * Losche Produkt anhand der produkt_id aus der Datenbank per HTTP-DELETE-Request
 * @param product_id {string}
 */
function deleteProduct(product_id){
  $.ajax({
    type: "DELETE",
    url: base_url + "produkte/"+product_id,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData();
    },
    error: function (response) {
    }
  });

  //delete productId in sicherheitstyp
  for(var i = 0; i < security_type.length; i++){
    deleteProductSecurityType(security_type[i]._id, product_id);
  }

}

/**
 * Ändere Produktname anhand der produkt_id via HTTP-PUT-Request
 * @param product_id {string}
 */
function setNameProduct(product_id){
  let p = getProductById(product_id);
  if($('#product_edit'+product_id).html()=='mode_edit'){
    $('#product_edit'+product_id).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" id="newProductName'+product_id+'" required value="'+ p.titel +'">'+
      '<label>Gib einen neuen Titel ein.</label>'+
      '</div>';

    $('#product_titel'+product_id).html(inputField);
  } else {
    p.titel = $('#newProductName'+product_id).val();
    saveProduct(p);
  }
}

/**
 * Ändere Produktbeschreibung anhand der produkt_id via HTTP-PUT-Request
 * @param product_id {string}
 */
function setDescriptionProduct(product_id){
  let p = getProductById(product_id);
  if($('#desc_edit'+product_id).html()=='mode_edit'){
    $('#desc_edit'+product_id).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" class="edit_data" id="newDescription'+product_id+'" required value="'+ p.beschreibung +'">'+
      '<label>Gib eine neue Beschreibung ein.</label>'+
      '</div>';

    $('#product_description'+product_id).html(inputField);
  } else {

    p.beschreibung = $('#newDescription'+product_id).val();
    saveProduct(p);
  }
}

/**
 * Ändere Produktlogo anhand der produkt_id via HTTP-PUT-Request
 * @param product_id {string}
 */
function setLogoProduct(product_id){
  let p = getProductById(product_id);
  if($('#logo_edit'+product_id).html()=='mode_edit'){
    $('#logo_edit'+product_id).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" class="edit_data" id="newLogo'+product_id+'" required value="'+ p.uri_logo +'">'+
      '<label>Gib eine neue URL zum Produktlogo ein.</label>'+
      '</div>';

    $('#product_logo'+product_id).html(inputField);
  } else {

    p.uri_logo = $('#newLogo'+product_id).val();
    saveProduct(p);
  }
}

/**
 * Ändere Produktlink anhand der produkt_id via HTTP-PUT-Request
 * @param product_id {string}
 */
function setLinkProduct(product_id){
  let p = getProductById(product_id);
  if($('#link_edit'+product_id).html()=='mode_edit'){
    $('#link_edit'+product_id).html('save');

    inputField =
      '<div class="group">'+
      '<input type="text" class="edit_data" id="newLink'+product_id+'" required value="'+ p.link +'">'+
      '<label>Gib eine neue Produkt-URL ein.</label>'+
      '</div>';

    $('#product_link'+product_id).html(inputField);
  } else {

    p.link = $('#newLink'+product_id).val();
    saveProduct(p);
  }
}

/**
 * Überschreibe ein Produkt in der DB mit dem mitgeschickten Produkt in JSON-Form
 * @param product {*}
 */
function saveProduct(product) {
  $.ajax({
    type: "PUT",
    url: base_url + "produkte/" + product._id,
    data: product,
    beforeSend: setHeader,
    success: function (response) {
      getCatalogData();
    },
    error: function (response) {
    }
  });
}

