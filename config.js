var keys = require('./package.json').keys;
var config = {}

config.endpoint = 'https://hongyuan.documents.azure.com:443/'
config.key = keys.cosmoskey;

config.database = {
  id: 'Hong Yuan'
}

config.containerCustomers = {
  id: 'Customers'
}

config.containerEnquiry = {
  id: 'Enquiry'
}

module.exports = config
