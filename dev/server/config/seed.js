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

Option.find({}).remove()
  .then(() => {
    Option.create({
      _id: '617364617364616473736461',
      option_text: '',
      valuation: 123
  });
});

Statement.find({}).remove()
  .then(() => {
  Statement.create({
    _id: '617364617364616473736462',
    statement_text: 'asdasdad',
    options: ['asdas', 'asdads'],
    results: {benefit: String, risk: String},
    points: 12123,
    user_option: String
  });
});

/*
Thing.find({}).remove()
  .then(() => {
    Thing.create({
      name: 'Development Tools',
      info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
            + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
            + 'Stylus, Sass, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, '
            + 'AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep '
            + 'tests alongside code. Automatic injection of scripts and '
            + 'styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more '
            + 'code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript '
            + 'payload, minifies your scripts/css/images, and rewrites asset '
            + 'names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku '
            + 'and openshift subgenerators'
    });
  });
*/
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
/*
Frage.find({}).remove()
  .then(() => {
    Frage.create({
      _id : '585905b9b0aa37948705ed73',
      frage : 'Welche Unternehmensart trifft auf Dich am ehesten zu?',
      rang : 1,
      antworten : [{
        antwort_text : 'Kleinständisch',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed64', punkte: 3}] //VSO
      }, {
        antwort_text : 'Mittelständisch',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed67', punkte: 2},{ //Fireeye
          produkt_id : '585905b9b0aa37948705ed66', punkte: 3},{ //Cyber Defense M
          produkt_id : '585905b9b0aa37948705ed65', punkte: 2}] // Qualys
      }, {
        antwort_text : 'Startup',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed64', punkte: 3}]}] // VSO
    }, {
      _id : '585905b9b0aa37948705ed74',
      frage : 'Wie ist Dein Arbeitsplatz gestaltet?',
      rang : 2,
      antworten : [{
        antwort_text : 'Mobil, an Laptops, Smartphones oder Tablets.',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed61', punkte: 3}] // Mobile Protect
      }, {
        antwort_text : 'Stationär, an Tower-PC oder Workstations.',
        produkte : [ ] // empty
      }, {
        antwort_text : 'Mobil sowie stationär.',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed61', punkte: 3}]}] // Mobile Protect
      }, {
        _id : '585905b9b0aa37948705ed75',
      frage : 'Hacker versuchen durch Schadsoftware Zugriff auf Deine Geschäftsgeheimnisse zu bekommen. Wie reagierst du?',
        rang : 3,
        antworten : [{
          antwort_text : 'Meine Firewall ist sicher, ich brauche mir keine Sorgen machen.',
          produkte : [ ] // empty
        }, {
          antwort_text : 'Ich weiß nicht, ob meine Daten sicher sind. Ich fürchte mich vor einem Datenverlust.',
          produkte : [ {
            produkt_id : '585905b9b0aa37948705ed67', punkte: 0.5},{ // Fireeye
            produkt_id : '585905b9b0aa37948705ed63', punkte: 2},{ // Internet Protect Pro
            produkt_id : '585905b9b0aa37948705ed60', punkte: 3}] // Symantec Endpoint Protection
        }]
  }, {
      _id : '585905b9b0aa37948705ed76',
      frage : "Deine Systeme werden durch einen Angriff lahmgelegt. Wie sehr bist Du betroffen ?",
      rang : 4,
      antworten : [{
        antwort_text : "Ich bin nicht abhängig von meinen Systemen, ein kleiner Ausfall stört mich nicht.",
        produkte : [ ] // empty
      }, {
        antwort_text : "Meine Systeme sind sehr wichtig, ein Ausfall würde einen Umsatzverlust bedeuten.",
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed62', punkte: 3}] // DDos Defense
      }]
    }, {
      _id : '585905b9b0aa37948705ed77',
      frage : "Sind Dir im Unternehmen immer die aktuellsten Sicherheitsschwachstellen bekannt?",
      rang : 5,
      antworten : [{
        antwort_text : "Ja, wir sind immer auf dem aktuellsten Stand und wissen, wie wir die Sicherheitslücken schließen können.",
        produkte : [ ] // empty
      }, {
        antwort_text : "Nein,  wir  sind nicht aktuell und nicht ausreichend über unsere Sicherheitslücken informiert.",
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed64', punkte: 3},{ //VSO
          produkt_id : '585905b9b0aa37948705ed65', punkte: 1}] //Qualys
      }]
    }, {
      _id : '585905b9b0aa37948705ed78',
      frage : "Wie würdest du die Menge Deiner ein- und ausgehenden Daten im Internet beurteilen?",
      rang : 6,
      antworten : [{
        antwort_text : 'Wir arbeiten hauptsächlich über das Internet.',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed67', punkte: 0.5},{ // Fireeye
          produkt_id : '585905b9b0aa37948705ed63', punkte: 2}] // Internet Protect Pro
      }, {
        antwort_text : 'Wir arbeiten vorwiegend offline.',
        produkte : [ ] //empty
      }]
    }, {
      _id : '585905b9b0aa37948705ed79',
      frage : "Wie möchtest du Deine Daten dargestellt bekommen?",
      rang : 7,
      antworten : [{
        antwort_text : 'Ich möchte die Sachverhalte veranschaulicht bekommen.',
        produkte : [ {
          produkt_id : '585905b9b0aa37948705ed63', punkte: 1},{ // Internet Protect Pro
          produkt_id : '585905b9b0aa37948705ed65', punkte: 1}] //Qualys
      }, {
        antwort_text : "Für mich sind Zahlen und Fakten ausreichend, bunte Bilder braucht keiner.",
        produkte : [ ]
      }]
    });
});

Katalog.find({}).remove()
  .then(() => {
    Katalog.create({
      titel : 'Standard',
      fragen_id : [
        '585905b9b0aa37948705ed73',
        '585905b9b0aa37948705ed74',
        '585905b9b0aa37948705ed75',
        '585905b9b0aa37948705ed76',
        '585905b9b0aa37948705ed77',
        '585905b9b0aa37948705ed78',
        '585905b9b0aa37948705ed79'],
      ist_aktiv : true
    })});

Produkt.find({}).remove()
  .then(() => {
    Produkt.create({
        _id: "585905b9b0aa37948705ed60",
        titel: "Symantec Endpoint Protection",
        beschreibung: "Schnelle und effektive Antivirus- sowie Firewall-Lösung für Windows-basierte Laptops, Desktops und Server.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/427/thumbs_64/img1502148165477637124.png",
        link: "https://cloud.telekom.de/software/symantec-endpoint-protection/?xtor=SEC-50-GOO-[691248457_35368042443]-[161803635117_c_1t2]-S-[_inurl:https://cloud.telekom.de/software/_b]"
      }, {
        _id: "585905b9b0aa37948705ed61",
        titel: "Mobile Protect Pro",
        beschreibung: "Echtzeitschutz Ihrer Unternehmensdaten gegen Angriffe auf mobile Endgeräte, Netze und Applikationen.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://cloud.telekom.de/magenta-security/mobile-protect-pro/"
      }, {
      _id: "585905b9b0aa37948705ed62",
        titel: "DDos-Defense",
        beschreibung: "Effektive Abwehrmaßnahmen gegen Großangriffe. Rund um die Uhr einsatzbereit und genau auf Ihre Internet-Anbindung zugeschnitten.",
        uri_logo: "https://geschaeftskunden.telekom.de/blobCache/umn/uti/306006_1461922717000/blobBigBinary/bild-product-item1.png",
        link: "https://geschaeftskunden.telekom.de/startseite/cloud-it/sicherheit-effizienz/fuer-netzwerke/306002/ddos-defence.html"
      }, {
      _id: "585905b9b0aa37948705ed63",
        titel: "Internet Protect Pro",
        beschreibung: "Echtzeitschutz gegen Bedrohungen beim Zugriff auf das Internet, auch wenn diese noch unbekannt sind.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/726/thumbs_64/img5698328164554237389.png",
        link: "https://cloud.telekom.de/magenta-security/internet-protect-pro/?xtmc=internetprotectpro&xtnp=1&xtcr=1"
      }, {
      _id: "585905b9b0aa37948705ed64",
        titel: "Virtual Security Officer",
        beschreibung: "Analysiert die Sicherheit ihrer Office IT und gibt einen Überblick über die derzeitige Sicherheitslage.",
        uri_logo: "http://www.laboratories.telekom.com/public/pictures/VirtualSecurityOfficer_300x218.jpg",
        link: "http://www.laboratories.telekom.com/public/Deutsch/Innovation/Exponate/Pages/Virtual-Security-Officer.aspx"
      }, {
      _id: "585905b9b0aa37948705ed65",
        titel: "Vulnerability Scan aaS",
        beschreibung: "Qualys untersucht Komponenten des IP-Netzwerkes über deren Zugangspunkt automatisiert auf Sicherheitsschwachstellen und Konformität mit vorgegebenen Sicherheitsrichtlinien.",
        uri_logo: "https://d1dejaj6dcqv24.cloudfront.net/asset/image/qualys-logo-87.png",
        link: "https://www.qualys.com/"
      }, {
      _id: "585905b9b0aa37948705ed66",
        titel: "Cyber Defense für den Mittelstand",
        beschreibung: "Cyber Defense überprüft Ihr Netzwerk kontinuierlich auf Schwachstellen und Bedrohungen.",
        uri_logo: "https://geschaeftskunden.telekom.de/blobCache/umn/uti/305928_1461922591000/blobBigBinary/01_m10-image-text_316xflexibel-im.png",
        link: "https://geschaeftskunden.telekom.de/startseite/cloud-it/sicherheit-effizienz/fuer-netzwerke/305924/cyber-defense.html"
      }, {
      _id: "585905b9b0aa37948705ed67",
        titel: "FireEye",
        beschreibung: "Durchgängig gemanagter Service, um Unternehmen schnell und wirkungsvoll vor IT-Spionage und Cyberattacken zu schützen.",
        uri_logo: "https://www.fireeye.com/content/dam/fireeye-www/fw/images/fireeye-2-color.png",
        link: "https://www.fireeye.com/products.html"
      }, {
      _id: "585905b9b0aa37948705ed68",
        titel: "Browser in the Box",
        beschreibung: "Verhindert, dass durch einen unsicheren Browser Elemente, die Schadcode verbreiten, auf den Rechner und in das Unternehmensnetzwerk gelangen.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://www.telekom.com/de/medien/medieninformationen/detail/browser-in-the-box-445112"
      }, {
      _id: "585905b9b0aa37948705ed69",
        titel: "Cyber Defense as a Service",
        beschreibung: "SIEM-Systeme greifen Log-Daten aus internen und externen Quellen ab, verdichten und korrelieren sie zu einem Lagebild des Sicherheitszustands der Unternehmens-IT im Hinblick auf sicherheitsrelevante Vorgänge.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://www.telekom.com/de/medien/medieninformationen/detail/cyber-defense-as-a-service-445114"
      }, {
      _id: "585905b9b0aa37948705ed70",
        titel: "Identity Protect Pro",
        beschreibung: "Services zur Verwaltung von Nutzerkennungen und Zugriffsberechtigungen für Anwendungen und Unternehmensressourcen.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://www.telekom.com/de/medien/medieninformationen/detail/identity-protect-pro-445094"
      }, {
      _id: "585905b9b0aa37948705ed71",
        titel: "Offline Scanner Pro",
        beschreibung: "Liefert im Zusammenspiel mit einer kommerziellen Schwachstellen-Management-Software einen Report, der den Nutzer über auf dem System vorhandene Schwachstellen und deren Bedrohungspotenzial informiert.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://www.telekom.com/de/medien/medieninformationen/detail/offline-scanner-pro-445096"
      }, {
      _id: "585905b9b0aa37948705ed72",
        titel: "Versiegelte Cloud",
        beschreibung: "Mit dem Dienst ist ein sicherer mobiler Zugriff auf Unterlagen und Nachrichten, ein versiegelter Chat und ein abgesicherter Terminierungsdienst möglich.",
        uri_logo: "https://apps.telekomcloud.com/static//app_resources/724/thumbs_64/img3556890261719062379.png",
        link: "https://www.telekom.com/de/medien/medieninformationen/detail/versiegelte-cloud-445098"
      });
  });

    Sicherheitstyp.find({}).remove()
      .then(() => {
        Sicherheitstyp.create({
          titel : 'Mobile Worker',
          beschreibung : 'Mobile Worker, immer unterwegs via GR und Nutzung diverser Internetschnittstellen.',
          produkte_id : [
            "585905b9b0aa37948705ed61", // Mobile Protect Pro
            "585905b9b0aa37948705ed63", // Internet Protect Pro
            "585905b9b0aa37948705ed72"] // Versiegelte Cloud
        }, {
          titel : 'Keep it Classic',
          beschreibung : 'Deutsches Mittelständisches Unternehmen, ohne mobile Workstations, alle Mitarbeiter haben einen eigenen Arbeitsplatz.',
          produkte_id : [
            "585905b9b0aa37948705ed66", // Cyber Defense f. M.
            "585905b9b0aa37948705ed62", // DDoS Defense
            "585905b9b0aa37948705ed69", // Cyber Defense as a service
            "585905b9b0aa37948705ed70", // Identity Protect Pro
            "585905b9b0aa37948705ed71", // Offline Scanner Pro
            "585905b9b0aa37948705ed65", // Qualys
            "585905b9b0aa37948705ed67"] // Fireeye
        }, {
          titel : 'Small but safe',
          beschreibung : 'Mobile Worker, immer unterwegs via GR und Nutzung diverser Internetschnittstellen.',
          produkte_id : [
            "585905b9b0aa37948705ed68", // Browser in the Box
            "585905b9b0aa37948705ed64", // VSO
            "585905b9b0aa37948705ed60", // Symantec Endpoint Security
            "585905b9b0aa37948705ed61", // Mobile Protect Pro
            "585905b9b0aa37948705ed62", // DDoS Defense
            "585905b9b0aa37948705ed72"] // Versiegelte Cloud
        })})
      .then(() => {
        console.log('finished populating users');
      });*/
