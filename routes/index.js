var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var fs = require("fs");

var year = new Date().getFullYear();

/* GET home page. */
router.get('/', function(req, res, next) {
 let page = "index";
 res.render("index",{page:page,year:year});
});

router.get('/about', function(req, res, next) {
 let page = "index";
 res.render("about",{page:page,year:year});
});

router.get('/freight', function(req, res, next) {
 let page = "freight";
 let title = "freight";
 let service = "Freight Services";
 let pointers = [];
 pointers[0] = "The form below is just a guide for you to input the information we need, and format your enquiry to be more readable for us.";
 pointers[1] = "Do note that all prices offered are subject to changes on actual weight & dimensions, please fill in as much information as you can so that we can give you a more accurate quote.";
 pointers[2] = "*Land transport is limited only to neighbouring countries (i.e. Singapore/Malaysia).";

 res.render("services",{page:page,title:title,service:service,pointers:pointers,year:year});
});

router.get('/localclearance', function(req, res, next) {
 let page = "localclearance";
 let title = "clearance";
 let service = "Local Clearance (Singapore)";
 let pointers = [];
 pointers[0] = "Many freight services end at the port of destination country. The local clearance service allows you to clear your cargo from customs (and pay the appropriate duties & taxes) and deliver the goods to you anywhere in Singapore.";
 pointers[1] = "Please note that this service is only available in Singapore only";

 res.render("services",{page:page,title:title,service:service,pointers:pointers,year:year});
});



router.post("/freight", function (req,res) {
var error = false;

//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('../config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

const options = {
      endpoint: endpoint,
      key: key,
      userAgentSuffix: 'HongYuanEnquiriesDB'
    };

const client = new CosmosClient(options)

async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read()
}

/**
 * Create the container if it does not exist
 */
async function createContainer(containerId) {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey }
    )
}

/**
 * Read the container definition
 */
async function readContainer(containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer(containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  
  try
  {
      const {resources: offers} = await client.offers.readAll().fetchAll();
  
      const newRups = 500;
      for (var offer of offers) {
        if (containerDefinition._rid !== offer.offerResourceId)
        {
            continue;
        }
        offer.content.offerThroughput = newRups;
        const offerToReplace = client.offer(offer.id);
        await offerToReplace.replace(offer);
        break;
      }
  }
  catch(err)
  {
      if (err.code == 400)
      {
          console.log(`Cannot read container throuthput.\n`);
          console.log(err.body.message);
      }
      else 
      {
          throw err;
      }
  }
}

/**
 * Create family item
 */
async function createFamilyItem(itemBody,containerId) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.create(itemBody)
}

/**
 * Upsert family item
 */
async function upsertFamilyItem(itemBody,containerId) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody)
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message)
  console.log('Press any key to exit')
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume()
  process.stdin.on('data', process.exit.bind(process, 0))
}





 var form = new formidable.IncomingForm({multiples:true});

 form.parse(req,function(err,fields,files) {
  var uploadedFiles = [];
  for (let i=0; i<files.docs.length; i++) {
   var oldpath = files.docs[i].filepath;
   var newpath = ("../files/" + files.docs[i].originalFilename);
   uploadedFiles.push(files.docs[i].originalFilename);
   fs.copyFile(oldpath,newpath,function(err){
    if (err) {
     if (err.errno === -4048) {
      /* ignore for now */
     } else {
      console.log(err);
      error = true;
     };
    };
   });
  };


  var pkgWeightData = []
  let count = 1;
  for (let i=0; i<fields.pkgWeight.length; i+=2) {
   pkgWeightData.push("Package No. " + count + ": " + fields.pkgWeight[i] + fields.pkgWeight[i+1]);
   count++;
  }; 

  var pkgDimData = [];
  let ii = 0;
  count = 1;
  for (let i=0; i<fields.pkgLBH.length; i+=4) {
   pkgDimData.push(["Package No. " + count,fields.pkgLBH[i]+"x"+fields.pkgLBH[i+1]+"x"+fields.pkgLBH[i+2]+fields.pkgLBH[i+3],fields.pkgVol[ii]+fields.pkgVol[ii+1]]);
   ii+=2;
   count++;
  };


  function customerData() {
   var customerData = {
     id: fields.Email.toLowerCase(),
     name: fields.Name.toLowerCase(),
     tel: fields.Tel,
     partitionKey: fields.Tel,
     lastUpdated: (new Date().toDateString() + " " + new Date().toTimeString())
    };
  return customerData;
  };

  function freightData(customerData) {
   var freightData = {
    id:(new Date().toDateString() + " " + new Date().toTimeString()),
    customer: customerData,
    type: "Freight",
    partitionKey: "Freight",
    from:{
     terms:fields.pickupTerm,
     address:(fields.Country1 + " " + fields.pickupAddr)
    },
    to:{
     terms:fields.deliveryTerm,
     address:(fields.Country2 + " " + fields.deliveryAddr)
    },
    NoP:(fields.NoP[0] + " " + fields.NoP[1]),
    tWeight:(fields.tWeight[0] + fields.tWeight[1]),
    pkgWeight:pkgWeightData,
    tVol:(fields.totalVol[0] + " " + fields.totalVol[1]),
    pkgDim:pkgDimData,
    mode:fields.mode,
    repacking:fields.repacking,
    insurance:fields.insurance,
    commodity:fields.commodity,
    remarks:fields.remarks,
    docs:uploadedFiles
   };
   return freightData;
  };

createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer(config.containerCustomers.id))
  .then(() => createContainer(config.containerEnquiry.id))
  .then(() => readContainer(config.containerCustomers.id))
  .then(() => scaleContainer(config.containerCustomers.id))
  .then(() => readContainer(config.containerEnquiry.id))
  .then(() => scaleContainer(config.containerEnquiry.id))
  .then(() => upsertFamilyItem(customerData(),config.containerCustomers.id))
  .then(() => createFamilyItem(freightData(customerData()),config.containerEnquiry.id))
  .then(() => {
    if (error) {
     exit(`An error occurred`);
     console.log(error);
    } else {
     exit(`Completed successfully`);
    };
    let page = "index";
    res.render("submitted", {page:page,err:error,year:year});
  })
  .catch(err => {
    exit(err);
    let page = "index";
    res.render("submitted", {page:page,err:true,year:year});
  })

  if (err) {
   error = true;
  };
 });
});







router.post("/localclearance", function (req,res) {
var error = false;

//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('../config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

const options = {
      endpoint: endpoint,
      key: key,
      userAgentSuffix: 'HongYuanEnquiriesDB'
    };

const client = new CosmosClient(options)

async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read()
}

/**
 * Create the container if it does not exist
 */
async function createContainer(containerId) {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey }
    )
}

/**
 * Read the container definition
 */
async function readContainer(containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer(containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  
  try
  {
      const {resources: offers} = await client.offers.readAll().fetchAll();
  
      const newRups = 500;
      for (var offer of offers) {
        if (containerDefinition._rid !== offer.offerResourceId)
        {
            continue;
        }
        offer.content.offerThroughput = newRups;
        const offerToReplace = client.offer(offer.id);
        await offerToReplace.replace(offer);
        break;
      }
  }
  catch(err)
  {
      if (err.code == 400)
      {
          console.log(`Cannot read container throuthput.\n`);
          console.log(err.body.message);
      }
      else 
      {
          throw err;
      }
  }
}

/**
 * Create family item
 */
async function createFamilyItem(itemBody,containerId) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.create(itemBody)
}

/**
 * Upsert family item
 */
async function upsertFamilyItem(itemBody,containerId) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody)
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message)
  console.log('Press any key to exit')
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume()
  process.stdin.on('data', process.exit.bind(process, 0))
}


 var form = new formidable.IncomingForm({multiples:true});

 form.parse(req,function(err,fields,files) {

  var uploadedFiles = [];
  for (let i=0; i<files.docs.length; i++) {
   var oldpath = files.docs[i].filepath;
   var newpath = ("../files/" + files.docs[i].originalFilename);
   uploadedFiles.push(files.docs[i].originalFilename);
   fs.copyFile(oldpath,newpath,function(err){
    if (err) {
     if (err.errno === -4048) {
      /* ignore for now */
     } else {
      console.log(err);
      error = true;
     };
    };
   });
  };

  var pkgWeightData = []
  let count = 1;
  for (let i=0; i<fields.pkgWeight.length; i+=2) {
   pkgWeightData.push("Package No. " + count + ": " + fields.pkgWeight[i] + fields.pkgWeight[i+1]);
   count++;
  }; 

  var pkgDimData = [];
  let ii = 0;
  count = 1;
  for (let i=0; i<fields.pkgLBH.length; i+=4) {
   pkgDimData.push(["Package No. " + count,fields.pkgLBH[i]+"x"+fields.pkgLBH[i+1]+"x"+fields.pkgLBH[i+2]+fields.pkgLBH[i+3],fields.pkgVol[ii]+fields.pkgVol[ii+1]]);
   ii+=2;
   count++;
  };

  function customerData() {
   var customerData = {
     id: fields.Email.toLowerCase(),
     name: fields.Name.toLowerCase(),
     tel: fields.Tel,
     partitionKey: fields.Tel,
     lastUpdated: (new Date().toDateString() + " " + new Date().toTimeString())
    };
  return customerData;
  };

  function localClearanceData(customerData) {
   var localClearanceData = {
    id:(new Date().toDateString() + " " + new Date().toTimeString()),
    customer: customerData,
    type: "Local Clearance",
    partitionKey:"Local Clearance",
    arrivalBy:fields.arrivalBy,
    delivery:{
     delivery:fields.delivery,
     address:fields.deliverTo
    },
    NoP:(fields.NoP[0] + " " + fields.NoP[1]),
    tWeight:(fields.tWeight[0] + fields.tWeight[1]),
    pkgWeight:pkgWeightData,
    tVol:(fields.totalVol[0] + " " + fields.totalVol[1]),
    pkgDim:pkgDimData,
    commodity:fields.commodity,
    remarks:fields.remarks,
    docs:uploadedFiles
   };
   return localClearanceData;
  };

createDatabase()
  .then(() => readDatabase())
  .then(() => createContainer(config.containerCustomers.id))
  .then(() => createContainer(config.containerEnquiry.id))
  .then(() => readContainer(config.containerCustomers.id))
  .then(() => scaleContainer(config.containerCustomers.id))
  .then(() => readContainer(config.containerEnquiry.id))
  .then(() => scaleContainer(config.containerEnquiry.id))
  .then(() => upsertFamilyItem(customerData(),config.containerCustomers.id))
  .then(() => createFamilyItem(localClearanceData(customerData()),config.containerEnquiry.id))
  .then(() => {
    if (error) {
     exit(`An error occurred`);
     console.log(error);
    } else {
     exit(`Completed successfully`);
    };
    let page = "index";
    res.render("submitted", {page:page,err:error,year:year});
  })
  .catch(err => {
    exit(err);
    let page = "index";
    res.render("submitted", {page:page,err:true,year:year});
  })

  if (err) {
   error = true;
  };
 });
});


module.exports = router;
