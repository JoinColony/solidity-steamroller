const fs = require('fs');
const path = require('path');
const parser = require('solidity-parser-antlr');
const semver = require('semver');

const flatten = (file, store = { imported: new Set(), pragmas: [] }, depth = 0) => {
  const basePath = path.dirname(file);
  let contract = fs.readFileSync(file).toString();
  const parsed = parser.parse(contract, { loc: true });
  const imports = parsed.children
    .filter(node => node.type === 'ImportDirective')
    .map(node => ({
      absPath: path.resolve(basePath, node.path),
      contents: flatten(path.resolve(basePath, node.path), store, depth + 1),
      loc: node.loc
    }));
  const lines = contract.split(/\r?\n/);
  imports
    .forEach(({ absPath, contents, loc }) => {
      contract = replaceInLoc(contract, lines, loc, !store.imported.has(absPath) ? contents : '');
      // Save the imported file for later so that we don't import it twice
      store.imported.add(absPath);
    });
  // Save the pragma directives for later
  parsed.children
    .filter(node => node.type === 'PragmaDirective')
    .forEach(({ loc, name, value }) => {
      store.pragmas.push({ name, value });
      contract = replaceInLoc(contract, lines, loc, '');
    });
  if (depth === 0) {
    const solidityPragma = findPragmaVersion(store.pragmas, 'solidity');
    const experimentalPragma = findPragmaVersion(store.pragmas, 'experimental');
    if (experimentalPragma) {
      contract = `pragma experimental "v${experimentalPragma}";\n${contract}`;
    }
    if (solidityPragma) {
      contract = `pragma solidity ^${solidityPragma};\n${contract}`;
    }
  }
  return contract.trim();
}

function replaceInLoc(str, lines, loc, replace) {
  // + 1 because of semicolon
  const importStatement = lines[loc.start.line - 1].slice(loc.start.column, loc.end.column + 1);
  return str.replace(importStatement, replace);
}

function findPragmaVersion(pragmas, name) {
  return pragmas
    .filter(pragma => pragma.name === name)
    .map(pragma => semver.coerce(pragma.value).version)
    .reduce((current, next) => {
      if (!current && !next) return null;
      if (!current) return next;
      return semver.gt(current, next) ? current : next;
    }, null);
}

module.exports = flatten;
