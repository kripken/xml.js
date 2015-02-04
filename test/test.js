var fs = require('fs')
, xmllint = require('../xmllint.js')
, xml = fs.readFileSync('./test/test.xml').toString()
, schema = fs.readFileSync('./test/test.xsd').toString()
;


console.log(xmllint.validateXML({
	xml: [xml, xml],
	schema: [schema, schema]
}));
