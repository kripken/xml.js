const fs = require('fs');
let xml = fs.readFileSync('./test/test.xml', 'utf8');
const schema = fs.readFileSync('./test/test.xsd', 'utf8');

const api = require('./index');
async function test() {
  try {
    console.log(await api.validateXML({xml, schema}));
    console.log('success');
  } catch(err) {
    console.log(err);
    console.log('fail');
  }
}
test().then(() => {
  xml = xml.replace('quantity>1', 'quantity>-1');
  test();
});
