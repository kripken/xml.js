// @flow
import * as xmllint from '../index-node';

xmllint.validateXML({
	xml: [],
	normalization: 'format',
});

xmllint.validateXML({
	// Error expected: normalization or schema param is required
});

import * as fs from 'fs';

async function example() {
	const [myXMLFile, mySchemaFile] = await Promise.all([
		fs.promises.readFile('./my-xml-file.xml', 'utf8'),
		fs.promises.readFile('./my-schema-file.xml', 'utf8'),
	]);

	const validationResult = await xmllint.validateXML({
		xml: [{
			fileName: 'my-xml-file.xml',
			contents: myXMLFile,
		}],
		// All the schema files that are required to validate the documents.
		// The main XSD should be first in the array, followed by its possible dependencies.
		schema: [mySchemaFile],
	});
  
	if (validationResult.valid) {
		console.log('There were no errors!');
	} else {
		console.warn(validationResult.errors);
	}
}
