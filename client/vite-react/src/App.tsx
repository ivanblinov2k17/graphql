import React, { useState } from 'react';

import {
  DataGrid, Column, Editing, Scrolling, Lookup, Summary, TotalItem,
} from 'devextreme-react/data-grid';
import { DataGridTypes } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';

import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';
import { useQuery, gql, useApolloClient, useMutation } from '@apollo/client';

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
mutation($OrderID: ID, $CustomerID: String, $OrderDate: String, $Freight: Float, $ShipCountry: String, $ShipVia: Int){
  InsertOrder(OrderID: $OrderID, CustomerID: $CustomerID, OrderDate: $OrderDate, Freight: $Freight, ShipCountry: $ShipCountry, ShipVia: $ShipVia){
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
  const [InsertOrder, {data: mutationData, loading, error}] = useMutation(InsertOrderMutation);
  const [ordersData, setOrdersData] = useState(new CustomStore({
    key: 'OrderID',
    load: () => sendRequest(`Orders`),
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

  const sendRequest = (query: string, method = 'GET', data = {}) => {
    logRequest(method, query, data);
    switch (query){
      case 'Orders':
        return appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
      case 'Customers':
        return appoloClient.query({query: CustomersQuery}).then(response => response.data.Customers);
      case 'Shippers':
        return appoloClient.query({query: ShippersQuery}).then(response => response.data.Shippers);
      case 'InsertOrder':
        return InsertOrder({variables: data.values}).then(res => console.log(res));
        
        
        
    }
    const response = appoloClient.query({query: OrdersQuery}).then(response => response.data.Orders);
    console.log(response);
    return response;
  }

  const logRequest = (method, url, data) => {
    const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');

    const time = formatDate(new Date(), 'HH:mm:ss');
    const request = [time, method, url.slice(URL.length), args].join(' ');

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
