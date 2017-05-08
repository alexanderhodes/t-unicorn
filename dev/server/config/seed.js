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
  valuation: 15
  },{
    _id: '617364617364616473736469',
    option_text: 'Superegal.',
    valuation: 14
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
  },,{
    _id: '617364617364616473736468',
    result_text: 'Whatever!'
  });
});

Statement.find({}).remove()
  .then(() => {
  Statement.create({
    _id: '617364617364616473736463',
    statement_text: 'Wer das liest ist doof.',
    statement_rank: 1,
    options: [{option_id: '617364617364616473736461', result_id:'617364617364616473736464'},
              {option_id: '617364617364616473736462', result_id:'617364617364616473736465'}],
    points: 6
  },{
  _id: '617364617364616473736466',
  statement_text: 'Wer das nicht liest ist doof.',
  statement_rank: 2,
  options: [{option_id: '617364617364616473736461', result_id:'617364617364616473736464'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736465'}],
  points: 3
},{
  _id: '617364617364616473736467',
  statement_text: 'Wer sich das vorlesen lässt ist doof.',
  statement_rank: 3,
  options: [{option_id: '617364617364616473736461', result_id:'617364617364616473736464'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736465'}],
  points: 66
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
