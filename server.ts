// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';


// Import module map for lazy loading
// import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';


// renderModuleFactory needed to make Universal work in a node environment
// and contains all the information necessary for rendering the application on the server
import { renderModuleFactory } from '@angular/platform-server';
const { AppServerModuleNgFactory } = require('./angularUuniversal1-server/bundle');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();



const indexHtml = readFileSync(__dirname + '/dist/index.html', 'utf-8').toString();

// renderModuleFactory() heart of the Angular Universal pre-rendering solution.
app.route('*').get((req, res) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // The document property is a string containing the template that we want to render.
    // In this case, we want to render the application root component
    document: indexHtml,
    url: req.url
  })
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });

});

// Server static files from /browser
app.get('*.*', express.static(__dirname + '/dist', {
  maxAge: '1y'
}));


const PORT = process.env.PORT || 4000;
// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
