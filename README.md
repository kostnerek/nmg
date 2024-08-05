# nestjs-module-generator

Custom module generator for applications using NestJS, mongoose and GraphQL.

Use this generator to create a new module with a model, service, resolver and input type.

It will create the following files:
```bash npx nestjs-mg --name=test --rootDir=src```
```bash
src/
└── test
    ├── errors
    │   ├── graphql-test-errors.ts
    │   └── test-not-found.error.ts
    ├── inputs
    │   └── test.input.ts
    ├── models
    │   └── test.model.ts
    ├── schemas
    │   └── test.schema.ts
    ├── test.module.ts
    ├── test.repository.ts
    ├── test.resolver.ts
    └── test.service.ts
```
