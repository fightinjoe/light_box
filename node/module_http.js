/*== Setup HTTP server ==*/
var servi = require('servi');
var html_server = new servi(true);  // servi instance
html_server.port(8080);             // port number to run the server on
 
// configure the server's behavior:
html_server.serveFiles("../http"); 
html_server.start();