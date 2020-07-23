global.a = function a(fn) { try { fn() } catch(err) { console.error(err) } }
global.x = require('./xmllint.js')
global.xml = fs.readFileSync('./test/test.xml', 'utf8')
global.schema = fs.readFileSync('./test/test.xsd', 'utf8')

