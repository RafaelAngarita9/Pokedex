const express = require('express');
const cors = require('cors');
var config = require("./config.js").config
const app = express();

app.use(cors({
    origin: function(origin, callback) {
        console.log(origin)

        if (!origin) return callback(null, true)

        if (config.listablanca.indexOf(origin) === -1) {
            return callback('error de cors', false)
        }
        return callback(null, true)
    }

}))

app.all('*', function(request, response, next) {

    var url = request.headers.origin
    response.header('Access-Control-Allow-Origin', url);
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST,  DELETE, OPTIONS, HEAD');
    response.header('Access-Control-Allow-Headers', "Access-Control-Allow-Header, Origin, Accept, X-Requested-With, Access-Control-Requested-Method, Access-Control-Request-Headers");
    response.header("Access-Control-Allow-Credentials", "true");

    next()
})


var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(config.puerto, function() {
    console.log("Servervidor funcionando por el puerto " + config.puerto)
})