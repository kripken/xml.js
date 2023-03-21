'use strict';
const fs = require('fs');
const assert = require('assert').strict;
const xmllint = require('../index-node.js');
const xmlValid = fs.readFileSync('./test/test-valid.xml', 'utf8');
const xmlValidFormatted = fs.readFileSync('./test/test-valid-formatted.xml', 'utf8');
const xmlInvalidFormatted = fs.readFileSync('./test/test-invalid-formatted.xml', 'utf8');
const xmlValidC14n = fs.readFileSync('./test/test-valid-c14n.xml', 'utf8');
const xmlInvalid = fs.readFileSync('./test/test-invalid.xml', 'utf8');
const schemaOptions = {
	schema: fs.readFileSync('./test/test.xsd', 'utf8'),
	preload: [
		{
			fileName: 'comment.xsd',
			contents: fs.readFileSync('./test/comment.xsd', 'utf8'),
		}
	]
};

async function testWithValidFile() {
	const {rawOutput, normalized, ...result} = await xmllint.validateXML({
		xml: {fileName: 'valid.xml', contents: xmlValid},
		...schemaOptions,
	});

	assert.deepEqual(result, {valid: true, errors: []});
	// "normalized" should be empty because we didn't pass the "normalization" option
	assert.equal(normalized, '');
	assert.equal(rawOutput.trim(), 'valid.xml validates');
}

async function testWithValidFileForFormat() {
	const {valid, normalized} = await xmllint.validateXML({
		xml: {fileName: 'valid.xml', contents: xmlValid},
		...schemaOptions,
		normalization: 'format'
	});

	assert(valid);
	assert.equal(normalized, xmlValidFormatted);
}

async function testWithValidFileForFormatWithoutSchema() {
	const {valid, normalized} = await xmllint.validateXML({
		xml: {fileName: 'valid.xml', contents: xmlValid},
		normalization: 'format'
	});

	assert(valid);
	assert.equal(normalized, xmlValidFormatted);
}

async function testWithValidFileForC14n() {
	const {valid, normalized} = await xmllint.validateXML({
		xml: {fileName: 'valid.xml', contents: xmlValid},
		...schemaOptions,
		normalization: 'c14n'
	});

	assert(valid);
	assert.equal(normalized, xmlValidC14n);
}

async function testWithInvalidFile() {
	const {rawOutput, normalized, ...result} = await xmllint.validateXML({
		...schemaOptions,
		xml: xmlInvalid,
	});
	const expectedErrorResult = {
		valid: false,
		errors: [
			{
				rawMessage: "file_0.xml:21: element quantity: Schemas validity error : Element 'quantity': [facet 'maxExclusive'] The value '1000' must be less than '100'.",
				message: "element quantity: Schemas validity error : Element 'quantity': [facet 'maxExclusive'] The value '1000' must be less than '100'.",
				loc: { fileName: 'file_0.xml', lineNumber: 21 }
			},
			{
				rawMessage: "file_0.xml:25: element item: Schemas validity error : Element 'item', attribute 'partNum': [facet 'pattern'] The value '92-AA' is not accepted by the pattern '\\d{3}-[A-Z]{2}'.",
				message: "element item: Schemas validity error : Element 'item', attribute 'partNum': [facet 'pattern'] The value '92-AA' is not accepted by the pattern '\\d{3}-[A-Z]{2}'.",
				loc: { fileName: 'file_0.xml', lineNumber: 25 }
			}
		]		
	};

	assert.equal(normalized, '');
	assert.deepEqual(result, expectedErrorResult);
}

async function testWithTwoFiles() {
	const input = [
		{
			fileName: 'valid.xml',
			contents: xmlValid,
		},
		{
			fileName: 'invalid.xml',
			contents: xmlInvalid,
		},
	];
	const {rawOutput, normalized, ...result} = await xmllint.validateXML({
		xml: input,
		...schemaOptions,
		normalization: 'format',
	});
	const expectedResultForBoth = {
		'valid': false,
		'errors': [
			{
				rawMessage: "invalid.xml:21: element quantity: Schemas validity error : Element 'quantity': [facet 'maxExclusive'] The value '1000' must be less than '100'.",
				message: "element quantity: Schemas validity error : Element 'quantity': [facet 'maxExclusive'] The value '1000' must be less than '100'.",
				loc: {
					fileName: 'invalid.xml',
					lineNumber: 21
				}
			},
			{
				rawMessage: "invalid.xml:25: element item: Schemas validity error : Element 'item', attribute 'partNum': [facet 'pattern'] The value '92-AA' is not accepted by the pattern '\\d{3}-[A-Z]{2}'.",
				message: "element item: Schemas validity error : Element 'item', attribute 'partNum': [facet 'pattern'] The value '92-AA' is not accepted by the pattern '\\d{3}-[A-Z]{2}'.",
				loc: {
					fileName: 'invalid.xml',
					lineNumber: 25
				}
			}
		]
	};

	assert.equal(normalized, xmlValidFormatted + xmlInvalidFormatted);
	assert.deepEqual(result, expectedResultForBoth);
}

async function testWithLargeFile() {
	// Takes the first item XML from the test file. I know I know, never parse
	// XML with regex, but this is good enough for our test case.
	const [partToRepliacate] = xmlValid.match(/<item\b(?:.|[\r\n])*<\/item>/) || [];
	if (!partToRepliacate) {
		throw new Error('Could not find item in test file.');
	}
	// Make a large XML file by repeating the item 100 000 times.
	// This will take about 90MB.
	const xml = xmlValid.replace(partToRepliacate, partToRepliacate.repeat(100000));
	let error = 'No error';
	try {
		await xmllint.validateXML({
			xml,
			...schemaOptions,
		});
	} catch (err) {
		error = String(err);
	}
	assert.match(error, /out of memory/);

	// Should pass if we increase the max heap size.
	const result = await xmllint.validateXML({
		xml,
		...schemaOptions,
		// This is not really relevant for the passing of the test, but included
		// here for a sanity check that the option doesn't blow things up either.
		initialMemoryPages: xmllint.memoryPages.MiB * 30,
		maxMemoryPages: xmllint.memoryPages.GiB,
	});
	assert(result.valid);
}

async function runTests(...tests) {
	for (const test of tests) {
		try {
			await test();
		} catch(err) {
			console.error(err);
			console.error(`Test ${test.name} failed. See the error above`);
			return process.exit(1);
		}
	}
	console.log('All tests passed.');
}

runTests(
	testWithValidFile,
	testWithValidFileForFormat,
	testWithValidFileForFormatWithoutSchema,
	testWithValidFileForC14n,
	testWithInvalidFile,
	testWithTwoFiles,
	testWithLargeFile,
);
