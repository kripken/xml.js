var xmllint = require('xmllint');

var fs = require('fs');
xml = fs.readFileSync('./test/test.xml');
schema = fs.readFileSync('./test/test.xsd');

xml = xml.toString();
schema = schema.toString();

console.log(xmllint.validateXML({
	xml: [xml],
	schema: [schema, schema]
}));
