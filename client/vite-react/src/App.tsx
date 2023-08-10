import React, { useState } from 'react';
import './App.css';
import {
  DataGrid, Column, Editing, Scrolling, Lookup, Summary, TotalItem,
} from 'devextreme-react/data-grid';
import { DataGridTypes } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';

import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { OrderValues } from './types';

import _ from 'lodash';

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

const refreshModeLabel = { 'aria-label': 'Refresh Mode' };
// const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';
const URL = 'http://localhost:3005';

const REFRESH_MODES = ['full', 'reshape', 'repaint'];

export default function App() {
  const appoloClient = useApolloClient();
  const [InsertOrder] = useMutation(InsertOrderMutation);
  const [DeleteOrder] = useMutation(DeleteOrderMutation);
  const [UpdateOrder] = useMutation(UpdateOrderMutation);
  const [ordersData, setOrdersData] = useState(new CustomStore<OrderValues, string>({
    key: 'OrderID',
    load: () => sendRequest(`Orders`).then(data => _.cloneDeep(data)),
    insert: (values) => sendRequest(`InsertOrder`, 'POST', {
      values,
    }),
    update: (key, values) => sendRequest(`UpdateOrder`, 'PUT', {
      key,
      values,
    }),
    remove: (key) => sendRequest(`DeleteOrder`, 'DELETE', {
      key,
    }),
  }));
  const [customersData, setCustomersData] = useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`Customers`),
  }));
  const [shippersData, setShippersData] = useState(new CustomStore({
    key: 'Value',
    loadMode: 'raw',
    load: () => sendRequest(`Shippers`),
  }));
  const [requests, setRequests] = useState<string[]>([]);
  const [refreshMode, setRefreshMode] = useState<DataGridTypes.GridsEditRefreshMode>('reshape');

  const sendRequest = (query: string, method = 'GET', data: { key?: string, values?: any } = {}) => {
    //logRequest(method, query, data);
    switch (query){
      case 'Orders':
        return appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
      case 'Customers':
        return appoloClient.query({query: CustomersQuery}).then(response => response.data.Customers);
      case 'Shippers':
        return appoloClient.query({query: ShippersQuery}).then(response => response.data.Shippers);
      case 'InsertOrder':
        return InsertOrder({variables: data.values}).then(res => res.data.InsertOrder);
      case 'DeleteOrder':
        return DeleteOrder({variables: { OrderID: data.key }}).then(res => console.log(res));
      case 'UpdateOrder':
        return UpdateOrder({variables: { OrderID: data.key, ...data.values }}).then(res => res.data.UpdateOrder);
    }
    const response = appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
    console.log(response);
    return response;
  }

  const logRequest = (method: string, query: string, data: { key?: string, values?: any }) => {
    const args = (data.key ? `key=${data.key} (${typeof data.key})` : '').concat(Object.keys(data.values || {}).map((key) => `${key}=${data.values[key]} (${typeof data.values[key]})`).join(' '));

    const time = formatDate(new Date(), 'HH:mm:ss');
    const request = [time, method, query, args].join(' ');

    setRequests((requests) => [request].concat(requests))
  }

  const clearRequests = () => {
    setRequests([]);
  }

  const handleRefreshModeChange = (e) => {
    setRefreshMode(e.value);
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
          refreshMode={refreshMode}
          mode="cell"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
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
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Refresh Mode: </span>
          <SelectBox
            value={refreshMode}
            inputAttr={refreshModeLabel}
            items={REFRESH_MODES}
            onValueChanged={handleRefreshModeChange}
          />
        </div>
        <div id="requests">
          <div>
            <div className="caption">Network Requests</div>
            <Button id="clear" text="Clear" onClick={clearRequests} />
          </div>
          <ul>
            {requests.map((request, index) => <li key={index}>{request}</li>)}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}
