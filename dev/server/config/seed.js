/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
//import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
//import Frage from '../api/frage/frage.model';
//import Produkt from '../api/produkt/produkt.model';
//import Katalog from '../api/katalog/katalog.model';
//import Sicherheitstyp from '../api/sicherheitstyp/sicherheitstyp.model';
import Option from '../api/option/option.model';
import Statement from '../api/statement/statement.model';
import Result from '../api/result/result.model';

Option.find({}).remove()
  .then(() => {
    Option.create(
  {
    _id: '617364617364616473736461',
    option_text: 'Supergeil.',
    valuation: 123
  },{
  _id: '617364617364616473736462',
  option_text: 'Superkacke.',
  valuation: 123
  });
});

Result.find({}).remove()
  .then(() => {
  Result.create(
  {
    _id: '617364617364616473736464',
    result_text: 'Nice!'
  },{
    _id: '617364617364616473736465',
    result_text: 'Bad!'
  });
});

Statement.find({}).remove()
  .then(() => {
  Statement.create({
    _id: '617364617364616473736463',
    statement_text: 'asdasdad',
    statement_rank: 1,
    options: [{option_id: '617364617364616473736461', result_id:'617364617364616473736464'},
              {option_id: '617364617364616473736462', result_id:'617364617364616473736465'}],
    points: 12123
  });
});

User.find({}).remove()
  .then(() => {
    User.create({
      name: 'Test User',
      email: 's144513@hftl.de',
      password: 'test'
    }, {
      name: 'Admin',
      email: 's144513@hftl.de',
      password: 'admin'
    });
});
