const graphql = require('graphql');
const orders = require('../data/orders.json').data;
const customers = require('../data/customers.json').data;
const shippers = require('../data/shippers.json').data;

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLFloat, GraphQLList } = graphql;

const OrderType = new GraphQLObjectType({
    name: `Order`,
    fields: () => ({
        OrderID: { type: GraphQLID },
        CustomerID: { type: GraphQLString },
        EmployeeID: { type: GraphQLID },
        OrderDate: { type: GraphQLString },
        RequiredDate: { type: GraphQLString },
        ShippedDate: { type: GraphQLString },
        ShipVia: { type: GraphQLInt },
        Freight: { type: GraphQLFloat },
        ShipName: { type: GraphQLString },
        ShipAddress: { type: GraphQLString },
        ShipCity: { type: GraphQLString },
        ShipRegion: { type: GraphQLString },
        ShipPostalCode: { type: GraphQLString },
        ShipCountry: { type: GraphQLString },
        Customer: { type: GraphQLString },
        Employee: { type: GraphQLString },
        Shipper: { type: GraphQLString }
    })
})

const CustomerType = new GraphQLObjectType({
    name: `Customer`,
    fields: () => ({
        Value: { type: GraphQLString },
        Text: { type: GraphQLString },
    })
})

const ShipperType = new GraphQLObjectType({
    name: `Shipper`,
    fields: () => ({
        Value: { type: GraphQLInt },
        Text: { type: GraphQLString },
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
                CustomerID: { type: GraphQLString },
                OrderDate: { type: GraphQLString },
                Freight: { type: GraphQLFloat },
                ShipCountry: { type: GraphQLString }, 
                ShipVia: { type: GraphQLInt }
            }),
            resolve(parent, args) {
                const newOrderID = Math.max(...orders.map(order => order.OrderID)) + 1;
                const newOrder = { OrderID: newOrderID, ...args }
                orders.push(newOrder);
                return orders[orders.length - 1];
            }
        },
        DeleteOrder: {
            type: OrderType,
            args: ({ OrderID: { type: GraphQLID } }),
            resolve(parent, args) {
                const index = orders.findIndex(order => order.OrderID == args.OrderID);
                return orders.splice(index, 1);
            }
        },
        UpdateOrder: {
            type: OrderType,
            args: ({
                OrderID: { type: GraphQLID },
                CustomerID: { type: GraphQLString },
                OrderDate: { type: GraphQLString },
                Freight: { type: GraphQLFloat },
                ShipCountry: { type: GraphQLString }, 
                ShipVia: { type: GraphQLInt }
            }),
            resolve(parent, args) {
                const index = orders.findIndex(order => order.OrderID == args.OrderID);
                const oldOrder = orders[index];
                const newOrder = { ...oldOrder, ...args }
                orders.splice(index, 1, newOrder)
                return newOrder;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
