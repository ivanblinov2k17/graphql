const graphql = require('graphql');
const orders = require('../data/orders.json').data;
const customers = require('../data/customers.json').data;
const shippers = require('../data/shippers.json').data;

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

const CustomerType = new GraphQLObjectType({
    name: `Customer`,
    fields: () => ({
        Value: {type: GraphQLString},
        Text: {type: GraphQLString},
    })
})

const ShipperType = new GraphQLObjectType({
    name: `Shipper`,
    fields: () => ({
        Value: {type: GraphQLString},
        Text: {type: GraphQLString},
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
        },
        Customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args) {
                return customers;
            }
        },
        Shippers: {
            type: new GraphQLList(ShipperType),
            resolve(parent, args) {
                return shippers;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: `Mutation`,
    fields: {
        InsertOrder: {
            type: OrderType,
            args: ({
                OrderID: {type: GraphQLID},
                CustomerID: {type: GraphQLString},
                OrderDate: {type: GraphQLString},
                Freight: {type: GraphQLFloat},
                ShipCountry: {type: GraphQLString}, 
                ShipVia: {type: GraphQLInt}
            }),
            resolve(parent, args){
                const newOrder = {...args}
                console.log(args)
                orders.unshift(newOrder);
                return orders[0];
            }
        },
        DeleteOrder: {
            type: OrderType,
            args: ({OrderID: {type: GraphQLID}}),
            resolve (parent, args){
                const index = orders.findIndex(order=>order.OrderID == args.OrderID);
                return orders.splice(index, 1);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
