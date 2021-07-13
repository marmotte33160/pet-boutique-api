const express = require('express')
const cors = require('cors')
const { getCustomers, getCustomerById, getCustomerByQuery, createCustomer} = require('./customers')

const app = express()       //using express in our app
app.use(express.json())
app.use(cors())             //is nmaking our app use cors

app.get('/customers/search', getCustomerByQuery)
app.get('/customers/:id', getCustomerById)
//we add a cust id the : is a dynamique paramater
app.get('/customers', getCustomers)
app.post('/customers', createCustomer)


app.listen(3000, () => {
    //app.listen(port:3000, callback () => {
    console.log('listening to http://localhost:3000')
})

