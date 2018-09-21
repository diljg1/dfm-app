# DFM Browser Client

Vue application with for for userinput and XHR-polling system for results.

### Install

Use git/yarn to develop the client on your local machine.

```
git clone https://github.com/Bixie/dfm-app
cd dfm-app
yarn install
```

### Build

Use yarn to run the vue-cli build scripts. Install vue-cli globally if needed: ``yarn global add @vue/cli``.

```
yarn build
```

This builds the Joomla! module in the folder `/mod_dfm_app`. An installable zip-file will be stored in the `/dist` folder. Update via Joomla! Extension Manager.

### Development

Use [Vue CLI Service](https://cli.vuejs.org/guide/cli-service.html) to serve a hot reloading development build.

```
yarn serve
```

You could also build a stand-alone html/js version with:

```
yarn dev-build
```

This creates `/dist/index.html` that can be viewed directly in the browser.
