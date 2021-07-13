const { request, response } = require("express");
const admin = require("firebase-admin"); //for firebase-admin
const creds = require("../credentials.json"); //came from firebase
//../credidentials.json

function connectDb() {
  if (!admin.apps.length) {
    admin.initializeApp({
      //options
      credential: admin.credential.cert(creds)
    })
  }
  return admin.firestore()
}
//this that connect to the database
exports.getCustomers = (request, response) => {
  const db = connectDb() //make the connection
  db.collection("customers")
    .get()
    .then(customerCollection => {
      const allCustomers = customerCollection.docs.map(doc => doc.data())
      response.send(allCustomers)
    })

    .catch(err => {
      console.error(err)
      response.status(500).send(err)
    })
}

exports.getCustomerById = (request, response) => {
  if (!request.params.id) {
    response.status(400).send('No customer specified')
    return
  }
  const db = connectDb()
  db.collection('customers').doc(request.params.customerId)
    .get()
    .then (customerDoc => {
      let customer = customerDoc.data()
      customer.id = customerDoc.id
      /* ***important to set id as a property because firestore doesn't
      automaticaly do this. so this pulls the doc id (name it self) and 
      assigns it  as a property of the doc.*/
      
      response.send(customer)
    
    })
    .catch( err => {
      console.error(err)
      response.status(500).send(err)
    })
}

// return results based on querry paramater (fname) in URL/path
exports.getCustomerByQuery = (request, response) => {
    //get query from req.query
    const { fname } = request.query

    //connect to firestore
    const db = connectDb()

    //search customers collection based on query
    db.collection('customers')
    .where('firstName', '==', fname )
    .get()
    //respond with results
    .then(customerCollection => {
      const matches = customerCollection.docs.map(doc => {
        let customer = doc.data()
        customer.id = doc.id
        return customer
      })
      response.send(matches)
    })

    .catch(err => 
    response.status(500).send(err))
  }

    // create new customer with post
    exports.createCustomer = (request, response) => {
      // connect to db
      const db = connectDb()         

  
    db.collection('customers')
    .add(request.body)
    .then(docRef => response.send(docRef.id))
    .catch((err) => response.status(500).send("customer could not be created"))

  }



