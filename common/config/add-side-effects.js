const path = require('path');
const fs = require('fs');
const { exit } = require('process');

const reactIconsPackageJsonPath = path.resolve(__dirname, '../../packages/react-components/node_modules/@fluentui/react-icons/package.json');
console.log('Path: ', reactIconsPackageJsonPath);
const exists = fs.existsSync(reactIconsPackageJsonPath);
console.log('Does file exist: ', exists);

if (!exists) exit(1);

const packageJson = require(reactIconsPackageJsonPath);
packageJson.sideEffects = true;

console.log(packageJson);

fs.writeFileSync(reactIconsPackageJsonPath, JSON.stringify(packageJson));

console.log("Done?");

const contents = fs.readFileSync(reactIconsPackageJsonPath, 'utf-8');
console.log("New contents: ", contents);
exit(0);