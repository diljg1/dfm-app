# DFM Browser Client

Vue application with for for userinput and XHR-polling system for results.

[Web Client](https://github.com/Bixie/dfm-app) - [Server API](https://github.com/Bixie/dfm-api) - [Nodejs Processor](https://github.com/Bixie/dfm-processor)

### Install

Use git/yarn to develop the client on your local machine.

```
git clone https://github.com/Bixie/dfm-app
cd dfm-app
yarn --production=false
```

### Build

Use yarn to run the [Vue CLI Service](https://cli.vuejs.org/guide/cli-service.html) build scripts.

```
yarn build
```

This builds the Joomla! module in the folder `/mod_dfm_app`. An installable zip-file will be stored in the `/dist` folder. Update via Joomla! Extension Manager.

### Development

Use Vue CLI Service to serve a hot reloading development build.

```
yarn serve
```

You could also build a stand-alone html/js version with:

```
yarn dev-build
```

This creates `/dist/index.html` that can be viewed directly in the browser.

### Parameter fields

The paramaters for DFM are defined in the [parameter-fields.json](https://github.com/Bixie/dfm-app/blob/master/data/parameter-fields.json) file.

### Language

All visible language strings in the client are defined in JSON files in the `/language` folder.

 - **nl-NL**
   - [General language](https://github.com/Bixie/dfm-app/blob/master/language/nl-NL/strings.json)
   - [Scroll messages](https://github.com/Bixie/dfm-app/blob/master/language/nl-NL/scroll-messages.json)
- **en-GB**
   - [General language](https://github.com/Bixie/dfm-app/blob/master/language/en-GB/strings.json)
   - [Scroll messages](https://github.com/Bixie/dfm-app/blob/master/language/en-GB/scroll-messages.json)