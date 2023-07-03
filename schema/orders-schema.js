const graphql = require('graphql');
const orders = require('../data/orders.json').data;

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLFloat, GraphQLList } = graphql;

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
        Orders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return orders;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
});
