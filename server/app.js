const express = require('express');
const cors  = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const OrdersSchema = require('../schema/orders-schema');

const app = express();
const PORT = 3005;

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
}));

app.use('/Orders', graphqlHTTP({
    schema: OrdersSchema,
    graphiql: true
}))

// app.use('/CustomersLookup', graphqlHTTP({
//     CustomersLookupSchema,
// }))

// app.use('/ShippersLookup', graphqlHTTP({
//     ShippersLookupSchema,
// }))

app.listen(PORT, err => {
    err ? console.log(err) : console.log('server started!')
})