const graphql = require('graphql');
const orders = require('../data/orders.json');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLFloat } = graphql;

const OrderType = new GraphQLObjectType({
    name: `Order`,
    fields: ()=>({
        OrderID: {type: GraphQLID},
        CustomerID: {type: GraphQLString},
        EmployeeID: {type: GraphQLID},
        OrderDate: {type: GraphQLString},
        RequiredDate: {type: GraphQLString},
        ShippedDate: {type: GraphQLString},
        ShipVia: {type: GraphQLInt},
        Freight: {type: GraphQLFloat},
        ShipName: {type: GraphQLString},
        ShipAddress: {type: GraphQLString},
        ShipCity: {type: GraphQLString},
        ShipRegion: {type: GraphQLString},
        ShipPostalCode: {type: GraphQLString},
        ShipCountry: {type: GraphQLString},
        Customer: {type: GraphQLString},
        Employee: {type: GraphQLString},
        Shipper: {type: GraphQLString}
        
    })
})

const Query = new GraphQLObjectType({
    name: `Query`,
    fields: {
        Order: {
            type: OrderType,
            args: {},
            resolve(parent, args) {
                return orders.data;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
});
