# JHA / AHDC
This code in this directory is for the Application for Health and Drug Coverage, which is a combination of MSP enrolment, Fair PharmaCare enrolment, and Supplementary Benefits enrolment. Users select the relevant combination of programs to apply for, and the resulting online form fills with the appropriate sections, inputs, and questions. It is deployed to OpenShift, for more information on this, please refer to [the docs.](doc/Overview.md)

## Project setup
Make sure you have Node.js and npm installed (Node version 12.x)

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```
This project uses ESLint for linting.

```sh
npm run format
```

This project uses Prettier for code formatting.

### Dev Settings
Adjust the values in `src/settings.js` to more easily walk through the application during development

### Other important notes

This library requires a minimum of node 18 for compatibility with Vite and other dependencies, and a minimum of node 22 for compatibility with the pdf-js package used by the common library dependency.
