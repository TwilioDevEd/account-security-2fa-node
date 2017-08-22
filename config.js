if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var local_creds = env['compose-for-mongodb'][0].credentials;
    var uri_mongo = local_creds.uri;
    var ca = [new Buffer(local_creds.ca_certificate_base64, 'base64')];

    var local_creds_twilio = env['user-provided'][0].credentials;
    var authy_api_key = local_creds_twilio.app_api_key;
} else {
    var uri_mongo = process.env.MONGO_URL;
    var authy_api_key = process.env.AUTHY_API_KEY;
    var ca = ""
}

console.log("SERVER IS "+uri_mongo);

module.exports = {
    // HTTP port
    port: process.env.PORT || 3000,
    
    // Production Authy API key
    authyApiKey: process.env.AUTHY_API_KEY,

    // MongoDB connection string - MONGO_URL is for local dev,
    // MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
    mongoUrl: uri_mongo,
    twilioOptions:{
        authyApiKey: authy_api_key
    },
    mongoDbOptions: {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    }
};