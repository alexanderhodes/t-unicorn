/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Option from '../api/option/option.model';
import Statement from '../api/statement/statement.model';
import Result from '../api/result/result.model';

Option.find({}).remove()
  .then(() => {
    Option.create(
  {
    _id: '617364617364616473736458',
    option_text: 'Trifft zu',
    rank: 1,
    valuation: 1
  },/*{
  _id: '617364617364616473736459',
  option_text: 'Trifft eher zu',
  valuation: 0.66
  },{
    _id: '617364617364616473736460',
    option_text: 'Trifft eher nicht zu',
    valuation: 0.33
  },*/{
    _id: '617364617364616473736461',
    option_text: 'Trifft nicht zu',
    rank: 2,
    valuation: 0
  },{
    _id: '617364617364616473736462',
    option_text: 'Keine Angabe',
    rank: 3,
    valuation: 0
  });
});

Result.find({}).remove()
  .then(() => {
  Result.create(
  {
    _id: '617364617364616473736463',
    risk_text: [''],
    risk_short_text: ['Abhängigkeit'],
    chance_short_text: ['Leistungsfähigkeit'],
    chance_text: ['CSP weisen eine im Vergleich zur IT der KMU deutlich höhere Leistungsfähigkeit auch in Bezug auf Ausfallsicherheit auf']
  },{
    _id: '617364617364616473736464',
    risk_text: ['eine 100% Ausfallsicherheit wird nicht garantiert, eine (kritische) Anwendung kann für Minuten -Tage nicht Verfügbar sein, ohne das (je nach SLA) Kompensation aus Vertragsstrafen geleistet wird.'],
    risk_short_text: ['Nichtverfügbarkeit'],
    chance_short_text: ['Ausfallsicherheit'],
    chance_text: ['auch bei Standard-SLA ist die Ausfallsicherheit oftmals wesentlich höher als die durch die eigene IT geleistet werden kann']
  },{
    _id: '617364617364616473736465',
    risk_short_text: ['Dauerhafte Verbindung'],
    chance_short_text: ['Zuverlässigkeit'],
    risk_text: ['Dauerhafte Verbindung zwischen Endgerät und Anwendung besteht, wodurch Mitarbeiter überwacht werden könnten'],
    chance_text: ['Zuverlässigkeit der Daten steigt',
                  'Verbesserung der Datenspeicherung und Erhöhung der Prozessorleistung',
                  'Mobiler/ geographisch verteilter Zugriff wird erleichtert']
  },{
    _id: '617364617364616473736466',
    risk_short_text: ['Eingeschränkte Mobilität'],
    chance_short_text: ['Zentrale Speicherung'],
    risk_text: ['Mobile Einsätze der Mitarbeiter werden erschwert'],
    chance_text: ['Daten werden zentral im Unternehmen gespeichert und verwaltet']
  },{
    _id: '617364617364616473736467',
    risk_short_text: ['Unerwartete Kosten'],
    chance_short_text: ['Schnelle Reaktion'],
    risk_text: [''],
    chance_text: ['Durch höhere Flexibilität in SaaS Anwendung kann Unternehmen schneller auf Änderungen des Marktes reagieren und seine Strategie dynamischer anpassen',
                  'Vorteil gegenüber anderen Unternehmen erwachsen, die kein SaaS nutzen']
  },{
    _id: '617364617364616473736468',
    risk_short_text: ['Kosten'],
    chance_short_text: ['Flexibilität nicht benötigt'],
    risk_text: ['Die gewonnene Flexibilität wird für die Anwendung nicht benötigt. Die Kosten der Cloudumstellung werden durch die Verbesserungen durch die höhere Flexibilität der SaaS nicht gedeckt.'],
    chance_text: ['']
  },{
    _id: '617364617364616473736469',
    risk_short_text: ['Fehlerquellenpotential steigt'],
    chance_short_text: ['Kosteneinsparungen'],
    risk_text: ['Fehlerquellen-Potential steigt mit Anzahl der Schnittstellen',
                'unktionsfähigkeit der Schnittstellen durch Cloud Migration beeinträchtigt'],
    chance_text: ['Auslagerung aller Applikationen in die Cloud ermöglicht Kosteneinsparung',
                  'Standardisierung der Anwendungen']
  },{
    _id: '617364617364616473736470',
    risk_short_text: ['Optimierungspotential'],
    chance_short_text: ['Keine beeinträchtigung der Schnittstellen'],
    risk_text: [''],
    chance_text: ['Funktionsfähigkeit der Schnittstellen zu anderen Anwendungen ist nicht beeinträchtigt']
  },{
    _id: '617364617364616473736471',
    risk_short_text: ['Hohe Kosten'],
    chance_short_text: ['Keine Abhängigkeiten'],
    risk_text: ['Hohe Kosten durch großen Aufwand',
                'Kein ausreichendes Know-How',
                'Große Ressourcenbindung',
                'Kein Support bei technischen Problemen'],
    chance_text: ['Keine Abhängigkeiten',
                  'Unternehmens-informationen bleiben offline']
  },{
    _id: '617364617364616473736472',
    risk_short_text: ['Hohe Abhängigkeit'],
    chance_short_text: ['Automatische Auswertung'],
    risk_text: ['Hohe Abhängigkeit vom Cloudanbieter',
                'Wartungsvertrag ist aufzusetzen und zu abzuschließen'],
    chance_text: ['Kosten nach Verursacherprinzip (pay per use)',
                  'Know-How des Cloudanbieters nutzen (Spezialisten)',
                  'Eigene Ressourcen schonen',
                  'Automatische Auswertunge',
                  'Echtzeit-informationen',
                  'Frühwarnsystem',
                  'Fernwartung']
  },{
    _id: '617364617364616473736473',
    risk_short_text: ['Keine Schnittstellen'],
    chance_short_text: ['Verfügbarkeit und Performance'],
    risk_text: ['Es sind keine oder wenige Schnittstellen vorhanden, sodass die Integration schwierig ist',
                'Schnittstellen in der Client-Ebene noch entwickelt werden'],
    chance_text: ['Verfügbarkeit und Performance der Anwendungen steigen',
                  'Organisatorische Flexibilität nimmt zu']
  },{
    _id: '617364617364616473736474',
    risk_short_text: ['Optimierungspotential'],
    chance_short_text: ['Keine Schnittstellen notwendig'],
    risk_text: ['Prozesse besitzen Optimierungspotenzial, das nicht ausgeschöpft wird'],
    chance_text: ['Schnittstellen zu anderen Anwendungen werden nicht benötigt']
  },{
    _id: '617364617364616473736475',
    risk_short_text: ['Unterschiedliche Datenschutzgesetze'],
    chance_short_text: ['Verhinderung Imageschäden'],
    risk_text: ['Bei ausländischen Partnern gilt kein deutscher Datenschutz',
                'Interne Regelungen können den Weg zur Auslagerung verbauen'],
    chance_text: ['Verhinderung von Image-Schäden',
                  'Vertrauen bei Kunden und Partnern schaffen',
                  'Vermeidung von Strafen und Bußgeldern']
  },{
    _id: '617364617364616473736476',
    risk_short_text: ['Eigener Aufwand'],
    chance_short_text: ['Eigenverantwortung bei Speicherung'],
    risk_text: ['Eigener Aufwand für die Einhaltung der Datenschutzregelungen'],
    chance_text: ['Daten werden intern gespeichert, sodass die inländischen Datenschutzregelungen gelten',
                  'Eigenverantwortung für die Speicherung der Daten']
  },{
    _id: '617364617364616473736477',
    risk_short_text: ['Schlechte Verfügbarkeit'],
    chance_short_text: ['Verfügbarkeit'],
    risk_text: ['Schlechte Verfügbarkeit = hohes Risiko der zusätzlichen Kosten durch Einkauf von Fremdkräften',
                'Hohes Risiko des Zeitverbrauchs bei der Migration durch Schulungen von Mitarbeitern. Sonst Risiko der unsauberen Planung durch ungeübte und Themenfremde Mitarbeitern'],
    chance_text: ['Besserer Einsatz der limitierten Ressourcen nach der Migration',
                  'Gute Verfügbarkeit = Hohe Einsparungschancen von Geld, Zeit, Mitarbeitereffizienz nach Migration']
  },{
    _id: '617364617364616473736478',
    risk_short_text: ['Verfügbarkeit später wichtig'],
    chance_short_text: ['Verfügbarkeit ausreichend'],
    risk_text: ['Abhängigkeit von Qualität des Cloud Anbieters'],
    chance_text: ['Know-how-Transfer/Support bei der Umsetzung des Hard- und Softwarelebenszyklus durch Cloudanbieter',
                  'Keine Abschreibung von eigener Hardware und Software nötig']
  },{
    _id: '617364617364616473736479',
    risk_short_text: ['Abhängigkeit von Cloud-Anbieter'],
    chance_short_text: ['Keine Abschreibung'],
    risk_text: ['Hoher Ressourceneinsatz nötig um den dauerhaften Verbesserungsprozess aufrechtzuerhalten'],
    chance_text: ['Hard- und Softwarelebenszyklus  komplett unter eigener Kontrolle']
  },{
    _id: '617364617364616473736480',
    risk_short_text: ['Hoher Ressourceneinsatz'],
    chance_short_text: ['Eigene Kontrolle'],
    risk_text: ['Unzureichende Datensicherheit der Cloud-Provider kann zu Wettbewerbsnachteilen führen',
                'Anwendung kann aufgrund des geringen Standardisierungsgrades nicht 1:1 in der Cloud abgebildet werden',
                'Verlust der Kontrolle über erfolgskritische Daten',
                'Vertragliche / Rechtliche Verstöße'],
    chance_text: ['']
  },{
    _id: '617364617364616473736481',
    risk_short_text: ['Wettbewerbsnachteile'],
    chance_short_text: ['Wettbewerbsvorteile'],
    risk_text: ['höhere Investitionskosten durch eigene Verwaltung'],
    chance_text: ['Geschäfts- und Erfolgskritische Daten bleiben im Unternehmen und in eigener Hand']
  },{
    _id: '617364617364616473736400',
    risk_short_text: ['Investitionskosten'],
    chance_short_text: ['Eigene Verantwortung'],
    risk_text: [''],
    chance_text: ['']
  });
});

Statement.find({}).remove()
  .then(() => {
  Statement.create({
    _id: '617364617364616473736482',
    statement_text: 'Die benötigte Ausfallsicherheit der SaaS muss von einem potentiellen CSP zugesichert und sichergestellt werden.',
    statement_rank: 1,
    options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736463'},
              {option_id: '617364617364616473736459', result_id:'617364617364616473736463'},
              {option_id: '617364617364616473736460', result_id:'617364617364616473736464'},
              {option_id: '617364617364616473736461', result_id:'617364617364616473736464'},
              {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
    points: 1
  },{
  _id: '617364617364616473736483',
  statement_text: 'Die Nutzer benötigen einen mobilen Zugriff auf die Anwendung.',
  statement_rank: 2,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736465'},
    {option_id: '617364617364616473736459', result_id:'617364617364616473736465'},
    {option_id: '617364617364616473736460', result_id:'617364617364616473736466'},
            {option_id: '617364617364616473736461', result_id:'617364617364616473736466'},
            {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 1
},{
  _id: '617364617364616473736484',
  statement_text: 'Ich verspreche mir durch die Auslagerung in die Cloud einen Zuwachs an Flexibilität.',
  statement_rank: 3,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736467'},
    {option_id: '617364617364616473736459', result_id:'617364617364616473736467'},
    {option_id: '617364617364616473736460', result_id:'617364617364616473736468'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736468'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 2
},{
  _id: '617364617364616473736485',
  statement_text: 'Es bestehen Schnittstellen zu anderen Applikationen.',
  statement_rank: 4,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736469'},
    {option_id: '617364617364616473736459', result_id:'617364617364616473736469'},
    {option_id: '617364617364616473736460', result_id:'617364617364616473736470'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736470'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 2
},{
  _id: '617364617364616473736486',
    statement_text: 'Ich bin zufrieden mit der aktuellen Situation im Hinblick auf Monitoring und Support.',
    statement_rank: 5,
    options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736471'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736471'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736472'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736472'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
    points: 1
},{
  _id: '617364617364616473736487',
  statement_text: 'Eine Integration der Cloud in die Geschäftsprozesse ist für mich ohne Probleme möglich.',
  statement_rank: 6,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736473'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736473'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736474'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736474'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 2
},{
  _id: '617364617364616473736488',
  statement_text: 'Ich bin habe rechtliche Bedenken hinsichtlich der Auslagerung der Daten in die Cloud.',
  statement_rank: 7,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736475'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736475'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736476'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736476'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 2
},{
  _id: '617364617364616473736489',
  statement_text: 'Es bestehen Bedenken hinsichtlich der Verfügbarkeit von Ressourcen für eine Migration.',
  statement_rank: 8,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736477'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736477'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736400'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736400'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 1
},{
  _id: '617364617364616473736490',
  statement_text: 'Die Hard- und Software unserer IT, die eingesetzt wird, ist bereits amortisiert.',
  statement_rank: 9,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736478'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736478'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736479'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736479'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 1
},{
  _id: '617364617364616473736491',
  statement_text: 'Der Geschäftserfolg hängt von der betrachteten Applikation ab.',
  statement_rank: 10,
  options: [{option_id: '617364617364616473736458', result_id:'617364617364616473736480'},
      {option_id: '617364617364616473736459', result_id:'617364617364616473736480'},
      {option_id: '617364617364616473736460', result_id:'617364617364616473736481'},
    {option_id: '617364617364616473736461', result_id:'617364617364616473736481'},
    {option_id: '617364617364616473736462', result_id:'617364617364616473736400'}],
  points: 2
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
