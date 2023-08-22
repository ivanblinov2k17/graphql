import React, { useState } from 'react';
import './App.css';
import {
  DataGrid, Column, Editing, Scrolling, Lookup, Summary, TotalItem,
} from 'devextreme-react/data-grid';

import CustomStore from 'devextreme/data/custom_store';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { OrderValues } from './types';

import _ from 'lodash';

type KeyValues = { key?: string, values?: any };

const OrdersQuery = gql`
query{
  Orders {
    OrderID,
    CustomerID,
    EmployeeID,
    OrderDate,
    RequiredDate,
    ShippedDate,
    ShipVia,
    Freight,
    ShipName,
    ShipAddress,
    ShipCity,
    ShipRegion,
    ShipPostalCode,
    ShipCountry,
    Customer,
    Employee,
    Shipper
  }
}`;
const CustomersQuery = gql`
query{
  Customers {
    Value,
    Text
  }
}`;

const ShippersQuery = gql`
query{
  Shippers {
    Value,
    Text
  }
}`;

const InsertOrderMutation = gql`
mutation($CustomerID: String, $OrderDate: String, $Freight: Float, $ShipCountry: String, $ShipVia: Int){
  InsertOrder(CustomerID: $CustomerID, OrderDate: $OrderDate, Freight: $Freight, ShipCountry: $ShipCountry, ShipVia: $ShipVia){
    OrderID,
    CustomerID,
    OrderDate,
    Freight,
    ShipCountry,
    ShipVia
  }
}`

const DeleteOrderMutation = gql`
mutation($OrderID: ID){
  DeleteOrder(OrderID: $OrderID){
    OrderID
  }
}`

const UpdateOrderMutation = gql`
mutation($OrderID: ID, $CustomerID: String, $OrderDate: String, $Freight: Float, $ShipCountry: String, $ShipVia: Int){
  UpdateOrder(OrderID: $OrderID, CustomerID: $CustomerID, OrderDate: $OrderDate, Freight: $Freight, ShipCountry: $ShipCountry, ShipVia: $ShipVia){
    OrderID,
    CustomerID,
    OrderDate,
    Freight,
    ShipCountry,
    ShipVia
  }
}`

export default function App() {
  const appoloClient = useApolloClient();
  const [InsertOrder] = useMutation(InsertOrderMutation);
  const [DeleteOrder] = useMutation(DeleteOrderMutation);
  const [UpdateOrder] = useMutation(UpdateOrderMutation);
  const [ordersData] = useState(new CustomStore<OrderValues, string>({
    key: 'OrderID',
    load: () => sendRequest(`Orders`).then(data => _.cloneDeep(data)),
    insert: (values) => sendRequest(`InsertOrder`, {
      values,
    }),
    update: (key, values) => sendRequest(`UpdateOrder`, {
      key,
      values,
    }),
    remove: (key) => sendRequest(`DeleteOrder`, {
      key,
    }),
  }));
  const [customersData] = useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`Customers`),
  }));
  const [shippersData] = useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`Shippers`),
  }));

  const sendRequest = (query: string, data: KeyValues = {}) => {
    switch (query) {
      case 'Orders':
        return appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
      case 'Customers':
        return appoloClient.query({query: CustomersQuery}).then(response => response.data.Customers);
      case 'Shippers':
        return appoloClient.query({query: ShippersQuery}).then(response => response.data.Shippers);
      case 'InsertOrder':
        return InsertOrder({variables: data.values}).then(res => res.data.InsertOrder);
      case 'DeleteOrder':
        return DeleteOrder({variables: { OrderID: data.key }});
      case 'UpdateOrder':
        return UpdateOrder({variables: { OrderID: data.key, ...data.values }}).then(res => res.data.UpdateOrder);
      default:
        return appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
    }
  }

  return (
    <React.Fragment>
      <DataGrid
        id="grid"
        showBorders={true}
        dataSource={ordersData}
        repaintChangesOnly={true}
      >
        <Editing
          mode="cell"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
          refreshMode='reshape'
        />

        <Scrolling
          mode="virtual"
        />

        <Column dataField="OrderID" dataType="string" allowEditing={false}>
        </Column>

        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
        </Column>

        <Column dataField="OrderDate" dataType="date">
        </Column>

        <Column dataField="Freight">
        </Column>

        <Column dataField="ShipCountry">
        </Column>

        <Column
          dataField="ShipVia"
          caption="Shipping Company"
          dataType="number"
        >
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Summary>
          <TotalItem column="CustomerID" summaryType="count" />
          <TotalItem column="Freight" summaryType="sum" valueFormat="#0.00" />
        </Summary>
      </DataGrid>
    </React.Fragment>
  );
}
