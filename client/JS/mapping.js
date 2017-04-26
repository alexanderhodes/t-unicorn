/**
 * Created by Jonas on 15.12.16.
 */

var produkteMap = new Map();
var sicherheitstyp;

/**
 * starts calculation of Products by loading question from db
 */
function startProductCalculation(){
  getFragen(); //starts Product calculation
}
/**
 *  loads question from db and starts calculation
 */
function getFragen() {
  var myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function()
  {
    if (myrequest.status == 200 && myrequest.readyState == 4)
    {
      var q = JSON.parse(myrequest.responseText);
      q.sort(function(a,b){
        return a.rang - b.rang;
      });
      calculateProducts(q);
    }
  }
  myrequest.open("GET", window.location.protocol + "//" + window.location.host + "/api/fragen/active", true);
  myrequest.send();
}

/**
 * loads sectypes and takes the correct one for result
 */
function getSicherheitstypen() {
  var myrequest = new XMLHttpRequest();
  myrequest.onreadystatechange = function()
  {
    if (myrequest.status == 200 && myrequest.readyState == 4)
    {
      mapping(JSON.parse(myrequest.responseText));
    }
  }
  myrequest.open("GET", window.location.protocol + "//" + window.location.host + "/api/sicherheitstypen", true);
  myrequest.send();
}

/**
 * calculates products from given answers in sessionStorage
 * @param fragen {JSON} - questions
 */
function calculateProducts(fragen){
  var answers = window.sessionStorage.getItem("answers");
      for (i = 0; i < (answers.split("~").length); i++) {
          var answer = parseInt(answers.charAt(2*i))-1;
          //Schleife falls mehrere Produkte für eine Antwort
          for (j = 0; j < fragen[i].antworten[answer].produkte.length; j++){
              var currentProductID = fragen[i].antworten[answer].produkte[j].produkt_id;
              var currenPointsForProduct = fragen[i].antworten[answer].produkte[j].punkte;
              if (produkteMap.has(currentProductID)){

                produkteMap.set(currentProductID, (produkteMap.get(currentProductID) + currenPointsForProduct));
              } else {
                produkteMap.set(currentProductID, currenPointsForProduct);
              }
          }
     }
      produkteMap.forEach(function (value, key){
        if(value < 3){
          produkteMap.delete(key);
        }
      });

    getSicherheitstypen(); //starts mapping
}

/**
 * mapps the sectypes with calculated products
 * @param sicherheitstypen
 */
function mapping(sicherheitstypen){

    var sicherheitstypMap = new Map;

    for(i = 0; i < sicherheitstypen.length; i++){
        for(j=0; j < sicherheitstypen[i].produkte_id.length;j++){
          if(produkteMap.has(sicherheitstypen[i].produkte_id[j])){
            if(sicherheitstypMap.has(sicherheitstypen[i].titel)){
              //ist der Sicherheitstyp schon in der Map vorhanden, wird aktueller Stand um 1 erhöht
              sicherheitstypMap.set(sicherheitstypen[i].titel, sicherheitstypMap.get(sicherheitstypen[i].titel)+1)
            } else {
              sicherheitstypMap.set(sicherheitstypen[i].titel, 1);
            }
          }
        }
    }
    //sicherheitstyp mit den meisten Produkten, wird der Variablen zugewiesen
    var count1 = 0;
    sicherheitstypMap.forEach(function (value, key) {
      var count2 = sicherheitstypMap.get(key)
      if(count1 < count2){
        count1 = count2;
        sicherheitstyp = key;
        //document.getElementById("sicherheitstyp").textContent="Du gehörst zum Sicherheitstyp: " + sicherheitstyp;
      }
    });
  loadProducts();

}
