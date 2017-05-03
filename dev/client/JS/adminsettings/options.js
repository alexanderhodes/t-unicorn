var security_type;

/* This Function gets all security types from the database.
 * @returns{array} security_type security types as array
 */
function getSecurityTypeData() {

  var reqsecurity_type = new XMLHttpRequest();
  reqsecurity_type.open("GET", base_url + "sicherheitstypen",true);
  setHeader(reqsecurity_type);
  reqsecurity_type.send();
  reqsecurity_type.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      security_type = JSON.parse(this.responseText);
      getProductsData();
    }
  };
}
/* This Function sets the titel of a security type in the database.
 * @params{number} index id of security type
 */
function setNameSecurityType(index){
  let s = getSecurityTypeById(index);
    if($('#security_type_edit'+index).html()=='mode_edit'){
      $('#security_type_edit'+index).html('save');

    inputField =
      '<div class="group edit_data">'+
      '<input type="text" id="newSecurityTypeName'+index+'" required value="'+ s.titel +'">'+
      '<label>Gib einen neuen Titel ein.</label>'+
      '</div>';

    $('#security_type_titel'+index).html(inputField);
  } else {

      s.titel = $('#newSecurityTypeName'+index).val();
      saveSecurityType(s);
  }
}
/* This Function adds a new security type in the database.
 */
function newSecurityType(){
  params = {
    titel: "Bezeichnung des Sicherheitstypen einfügen"
  };

  $.ajax({
    type: "POST",
    url: base_url + "sicherheitstypen/",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getSecurityTypeData();
    },
    error: function (response) {
    }
  });
}
/* This Function adds a new product in one security type in the database.
 * @params{number} security_type_id id of security type
 * @params{number} prod_id id of the product
 */
function newProductSecurityType(prod_id, security_type_id){
  let params = {produkte_id: prod_id};
  $.ajax({
    type: "POST",
    url: base_url + "sicherheitstypen/"+security_type_id + "/produkt",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getSecurityTypeData();
    },
    error: function (response) {
    }
  });
}
/* This Function deletes one product in one security type in the database.
 * @params{number} security_type_id id of security type
 * @params{number} prod_id id of the product
 */
function deleteProductSecurityType(security_type_id, prod_id){
  let params = {produkte_id: prod_id};
  $.ajax({
    type: "DELETE",
    url: base_url + "sicherheitstypen/"+security_type_id + "/produkt",
    data: params,
    beforeSend: setHeader,
    success: function (response) {
      getSecurityTypeData();
    },
    error: function (response) {
    }
  });
}
/* This Function deletes a security type in the database.
 * @params{number} index id of security type
 */
function deleteSecurityType(index){
  $.ajax({
    type: "DELETE",
    url: base_url + "sicherheitstypen/"+index,
    beforeSend: setHeader,
    success: function (response) {
      getSecurityTypeData();
    },
    error: function (response) {
    }
  });
}
/* This Function returns the array of one security type.
 * @params{number} id id of security type
 * @returns{array} security type as array
 */
function getSecurityTypeById(id) {
  return $.grep(security_type, function (e) {
    return e._id === id;
  })[0];
}
/* This Function saves the changes of a security type in the database.
 * @params{array} sectype security type as array
 */
function saveSecurityType(sectype) {
  $.ajax({
    type: "PUT",
    url: base_url + "sicherheitstypen/" + sectype._id,
    data: sectype,
    beforeSend: setHeader,
    success: function (response) {
      getSecurityTypeData();
    },
    error: function (response) {
    }
  });
}
/* This Function creates DOM Elements for admin tab "Security Type" and adds them to the page.
 * @returns{text} html_text DOM elements as string
 */
function buildHTMLSecurityType() {

  let html_security_type='';
let card_sectype='';

    let active_class = 'class="mdl-card__title-text security_type_name"';

    let card_head = '<div class=\"mdl-cell--12-col mdl-card mdl-shadow--2dp security_type">' +
      '<h2>' + 'Sicherheitstypen mit Produkten:' + '</h2>' + '<div class="mdl-card__actions mdl-card--border">';

  for(var i=0; i<security_type.length; i++) {
     card_sectype +=

       '<div class="question_title">'+
       '<span id="security_type_titel'+security_type[i]._id+'" class="questiontext">' +
       '<b>Sicherheitstyp: </b>' + security_type[i].titel +
       '</span>' +
       '<span class="question_buttons">' +
       '<button onclick="setNameSecurityType(\''+security_type[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
       '<i id="security_type_edit'+security_type[i]._id+'" class="material-icons">mode_edit</i>'+
       '</button>'+
       '<button onclick="deleteSecurityType(\''+security_type[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
    '<i class="material-icons">delete</i>'+
    '</button>'+
    '</span>'+
    '</div>' +
    '<div class="answer_list">';
     if (products != undefined || security_type != undefined) {
       var dropdown_string = SetDropdown(security_type[i].produkte_id, security_type[i]._id);
     }
        for(var j=0; j<security_type[i].produkte_id.length; j++) {
          let p = getProductById(security_type[i].produkte_id[j]);
           card_sectype += '<div class="answer_text">' +
           '<span id="product_titel_security_type' + security_type[i].produkte_id[j] + '">' +
             p.titel +
           '</span>' +
             '<span class="question_buttons">'+
             '<button onclick="deleteProductSecurityType(\'' + security_type[i]._id  + '\',\'' + p._id + '\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
             '<i class="material-icons">delete</i>'+
             '</button>'+
             '</span>' +
             '</div>';

         }
    card_sectype +=
    '<div class="dropdown">' +
      '<button onclick="dropdown(\''+security_type[i]._id+'\')" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect add_question dropdown"><i class="material-icons">add</i></button>' + 'Produkt hinzufügen' +
      '<div id="myDropdown'+ security_type[i]._id + '" class="dropdown-content">' +
      '<input type="text" placeholder="Suche.." id="myInput" onkeyup="filterFunction(\''+security_type[i]._id+'\')">' +
    dropdown_string +
      '</div>' +
      '</div>' +
      '</div>';
  }
  let card_foot = '</div></div>'+ '</div>' +
    '<button onclick="newSecurityType()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect admin_button addProduct_SecType">'+
    'Sicherheitstyp hinzufügen'+
    '</button>' +
    '</div>' ;
    html_security_type += card_head + card_sectype + card_foot;

  return html_security_type;
}
/* This Function sets the content of a dropdown for adding products to a security type.
 * @params{number} produkte_index id of the products in one security type
 * @params{number} index id of the security type
 * @returns{text} html_text dropdown content as html string
 */
function SetDropdown(produkte_index, index){
  var dropdown_string ='';
  for(var i=0;i<products.length;i++) {
    var test = false;
    for (var j = 0; j < produkte_index.length; j++) {
      if (produkte_index[j] == products[i]._id) {
        test = true;
      }
    }
    if(test != true) {
      dropdown_string += '<a href="javascript:newProductSecurityType(\'' + products[i]._id  + '\',\'' + index + '\');">' + products[i].titel + '</a>';
    }
  }
  return dropdown_string;
}
/* This Function (de-)activates the content of a dropdown.
 */
function dropdown(index) {
    document.getElementById("myDropdown"+index).classList.toggle("show");
}

/* This Function makes it possible to search a product in the dropdown content.
 * @params{number} index id of security type
 */
function filterFunction(index) {
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
