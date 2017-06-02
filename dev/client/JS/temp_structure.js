/**
 * Created by lizakanitz on 25.04.17.
 */

var statements;
var ops;
var res;
var r = [];

function loadResultsByIdFromSessionStorage() {
  res = sessionStorage.options.split('~');
  index2 = 0;
  for (index = 0; index < res.length; index++){
    var req = new XMLHttpRequest();
    req.open("GET", base_url + "results/" + res[index], true);
    req.send();
    req.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        r.push(JSON.parse(this.responseText));
        index2 = index2 +1;
        if (index2 == res.length) {show_result(r)}
      }
    };
  }
}

function getResultIdByStatementIdAndOptionId(statement_id, option_id) {
  for (index = 0; index < statements.length; ++index) {
    if (statements[index]._id == statement_id){
      for (ix = 0; ix < statements[index].options.length; ++ix) {
        if(statements[index].options[ix].option_id == option_id) {
          return statements[index].options[ix].result_id;
        }
      }
    }
  }
}

function load_Statements(callback) {
  var req = new XMLHttpRequest();
  req.open("GET", base_url + "statements", true);
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){

      statements = JSON.parse(this.responseText);
      statements.sort(function(a,b){
        return a.statement_rank - b.statement_rank;
      });

      for (index = 0;index < statements.length;index++){
        statements[index].options.sort(function (a,b) {
          return a.option_id - b.option_id;
        });
      }

      callback(statements[0]);
    }
  };
};

function load_Options() {
  var req = new XMLHttpRequest();
  req.open("GET", base_url + "options", true);
  req.send();
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){

      ops = JSON.parse(this.responseText);
      ops.sort(function(a,b){
        return a._id - b._id;
      });
    }
  };
};
