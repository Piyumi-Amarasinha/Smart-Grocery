# MyFirstAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.2.

## Development server

This app has two parts that both need to be running: the Angular frontend and a small local Express API (backed by a JSON file) that the frontend talks to for product data.

1. Start the API (in one terminal): `npm run api` — listens on `http://localhost:4000`.
2. Start the frontend (in another terminal): `npm start` (same as `ng serve`) — navigate to `http://localhost:4200/`. The dev server proxies `/api` requests to the API on port 4000 (see `proxy.conf.json`), and reloads automatically on source changes.

Product data lives in `server/api/products.json`, which is created automatically from the seed data in `server/api/products.seed.json` the first time the API runs. Delete `products.json` and restart the API to reset to the seed data.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
