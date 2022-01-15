
import xmllint from './xmllint/index.js';

function getXml() {
  return document.getElementById("xml").value;
}

function getSchema() {
  return document.getElementById("schema").value;
}

function setXml(xml) {
  document.getElementById("xml").value = xml;
}

function setStatus(valid, messages) {
  const elem = document.getElementById("messages");
  elem.style.backgroundColor = valid ? 'green' : 'red';
  elem.value = messages;
}

async function process(normalize) {
  const xml = getXml();
  const schema = getSchema();
  const {valid, rawOutput, normalized, ...result} =
    await xmllint.validateXML(
      {xml: {fileName: 'editor.xml', contents: xml},
      schema,
      normalization: 'format'});
  setStatus(valid, rawOutput);
  if (valid && normalize) {
    setXml(normalized);
  }
};

export async function validate(event) {
  await process(false);
};

export async function normalize(event) {
  await process(true);
};


