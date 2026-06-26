'use strict';

const BILL_PATTERNS = {
  digitableLine: /\d{5}\.\d{5}\s\d{5}\.\d{6}\s\d{5}\.\d{6}\s\d\s\d+/g,
  amount: /\b(?:R\$\s*)?\d{1,3}(?:\.\d{3})*(?:,\d{2})\b/g,
  dueDate: /\b(?:\d{2}[-/]\d{2}[-/]\d{4}|\d{4}[-/]\d{2}[-/]\d{2})\b/g,
  cnpj: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g,
};

function parseBillFields(rawText = '') {
  const fields = {};
  for (const [key, regex] of Object.entries(BILL_PATTERNS)) {
    fields[key] = rawText.match(regex) || [];
  }
  return fields;
}

module.exports = { parseBillFields };
