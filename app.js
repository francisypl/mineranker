'use strict';

var SwaggerRestify = require('swagger-restify-mw');
var restify = require('restify');
var app = restify.createServer();

module.exports = app; // for testing

var config = {
    appRoot: __dirname // required config
};

app.use(
  function crossOrigin(req,res,next){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      return next();
  }
);

app.get('/', restify.serveStatic({
    directory: './build/mineranker',
    default: 'index.html'
}));

app.get(/\/.*\..*/, restify.serveStatic({
    directory: './build/mineranker',
    default: 'index.html'
}));

// app.get(/\/mineranker\/.*\..*/, function() {
//     console.log('sup');
// });

SwaggerRestify.create(config, function(err, swaggerRestify) {
    if (err) {
        throw err;
    }

    swaggerRestify.register(app);

    var port = process.env.PORT || 10010;
    app.listen(port);
    console.log(`Started on ${port}...`);
});
