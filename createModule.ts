const fs = require('node:fs');
const path = require('node:path');

const { program } = require('commander');
const Handlebars = require('handlebars');

program
  .option('-n, --name <name>', 'Name of the module')
  .option(
    '-d, --rootDir <name>',
    'Name of your root directory, default is src',
  );
program.parse(process.argv);
const options = program.opts();

const moduleName = options.name;

const rootPath = options.rootDir || 'src';

const folderNames = {
  rootModulePath: `${rootPath}/${moduleName}`,
  errors: `${rootPath}/${moduleName}/errors`,
  inputs: `${rootPath}/${moduleName}/inputs`,
  models: `${rootPath}/${moduleName}/models`,
  schemas: `${rootPath}/${moduleName}/schemas`,
};

const fileNames = {
  module: { path: `${folderNames.rootModulePath}/${moduleName}.module.ts`, template: 'module.hbs'},
  service: {path: `${folderNames.rootModulePath}/${moduleName}.service.ts`, template: 'service.hbs'},
  repository: {path: `${folderNames.rootModulePath}/${moduleName}.repository.ts`, template: 'repository.hbs'},
  resolver: {path: `${folderNames.rootModulePath}/${moduleName}.resolver.ts`, template: 'resolver.hbs'},

  graphqlError: {path: `${folderNames.errors}/graphql-${moduleName}-errors.ts`, template: 'graphql-error.hbs'},
  graphql: {path: `${folderNames.errors}/${moduleName}-not-found.error.ts`, template: 'error.hbs'},

  input: {path: `${folderNames.inputs}/${moduleName}.input.ts`, template: 'input.hbs'},

  schema: {path: `${folderNames.schemas}/${moduleName}.schema.ts`, template: 'schema.hbs'},

  model: {path: `${folderNames.models}/${moduleName}.model.ts`, template: 'model.hbs'},
};

//TODO: UNCOMMENT
/* if (fs.existsSync(folderNames.rootModulePath)) {
  console.error('Module already exists');
  process.exit(1);
} */

for (const folder in folderNames) {
  fs.mkdirSync(folderNames[folder], { recursive: true });
}

Handlebars.registerHelper('toUpperCase', function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('toFullUpperCase', function (str) {
  return str.toUpperCase();
});



for(const file in fileNames) {
  console.log(fileNames[file]);
  const { path: filePath, template } = fileNames[file];
  const templateContent = fs.readFileSync(
    path.join(__dirname, 'templates', template),
    'utf8',
  );
  const compiledTemplate = Handlebars.compile(templateContent);
  fs.writeFileSync(filePath, compiledTemplate({ moduleName }));
}
/* const template = Handlebars.compile(
  fs.readFileSync(
    path.join(__dirname, 'templates', fileNames.module.template),
    'utf8',
  ),
);
console.log(template({ moduleName })); */

