export type OrderValues = {
  CustomerID: string;
  EmployeeID: string;
  OrderDate: string;
  RequiredDate: string;
  ShippedDate: string;
  ShipVia: number;
  Freight: number;
  ShipName: string;
  ShipAddress: string;
  ShipCity: string;
  ShipRegion: string;
  ShipPostalCode: string;
  ShipCountry: string;
  Customer: string;
  Employee: string;
  Shipper: string;
}

export type OrderKey = {
  OrderID: string;
}

export type Order = OrderKey & OrderValues;
