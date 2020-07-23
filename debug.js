const fs = require('fs');
const x = require('./xmllint.js')
const xml = fs.readFileSync('./test/test.xml', 'utf8')
const schema = fs.readFileSync('./test/test.xsd', 'utf8')

async function test() {
  try {
    const res = await x.validateXML({xml, schema});
    console.log('success');
    console.log(res);
  } catch(err) {
    console.log('threw');
    console.error(err)
  }
}

test();