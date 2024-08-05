const fs = require('node:fs');
const path = require('node:path');
const { program } = require('commander');
const Handlebars = require('handlebars');

const normalizeString = (sourceStr) => {
  const charsToSplitAt = ['_', '-']

  let resultStr=''
  for(let i=0;i<sourceStr.length;i++) {
    const char = sourceStr[i]
    if(charsToSplitAt.includes(char)) {
      resultStr+=sourceStr[i+1].toUpperCase()
      i++
    } else {
      resultStr+=char
    }
    
  }
  return resultStr;
}


program
  .option('-n, --name <name>', 'Name of the module')
  .option(
    '-d, --rootDir <name>',
    'Name of your root directory, default is src',
);
program.parse(process.argv);
const options = program.opts();
const moduleName = options.name.toLowerCase();

/* 

  errorName - MODULE_NAME
  className - ModuleName
  variables - moduleName
  pathName  - module-name
*/

const errorName = moduleName.replace("-", "_").toUpperCase()
const variableName = normalizeString(moduleName)
const className = variableName.charAt(0).toUpperCase() + variableName.slice(1)
const pathName = moduleName

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

if (fs.existsSync(folderNames.rootModulePath)) {
  console.error('Module already exists');
  process.exit(1);
}

for (const folder in folderNames) {
  fs.mkdirSync(folderNames[folder], { recursive: true });
}

for(const file in fileNames) {
  const { path: filePath, template } = fileNames[file];
  const templateContent = fs.readFileSync(
    path.join(__dirname, 'templates', template),
    'utf8',
  );
  const compiledTemplate = Handlebars.compile(templateContent);
  fs.writeFileSync(filePath, compiledTemplate({ moduleName, errorName, variableName, className, pathName }));
}
console.log(`Module [${moduleName}] created successfully`);

