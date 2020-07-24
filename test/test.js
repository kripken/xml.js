const fs = require('fs');
const assert = require('assert').strict;
const xmllint = require('../index.js');
const xmlValid = fs.readFileSync('./test/test-valid.xml', 'utf8');
const xmlInvalid = fs.readFileSync('./test/test-invalid.xml', 'utf8');
const schema = fs.readFileSync('./test/test.xsd', 'utf8');

async function test() {
	const validationSuccess = await xmllint.validateXML({
		xml: xmlValid, schema,
	});
	console.log(validationSuccess);
	assert.deepEqual(validationSuccess, {errors: []}, 'No errors for valid XML');

	const validationErrors = await xmllint.validateXML({
		xml: xmlInvalid, schema,
	});
	const expectedErrors = {
		errors: [
			"file_0.xml:21: element quantity: Schemas validity error : Element 'quantity': [facet 'maxExclusive'] The value '1000' must be less than '100'.",
			"file_0.xml:25: element item: Schemas validity error : Element 'item', attribute 'partNum': [facet 'pattern'] The value '92-AA' is not accepted by the pattern '\\d{3}-[A-Z]{2}'."
		]
	};

	console.log(validationErrors);
	assert.deepEqual(validationErrors, expectedErrors, 'Two errors for the invalid XML');	

	console.log('All tests passed.');
}

test().catch(err => {
	console.error(err);
	process.exit(1);
});
