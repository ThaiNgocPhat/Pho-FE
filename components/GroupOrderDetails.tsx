import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';

type ToppingType = {
  name: string;
};

type DishType = {
  name: string;
  price: number;
  toppings: ToppingType[];
  quantity: number;
};

type GroupType = {
  groupId: number;
  groupName: string;
  orders: DishType[];
};

type TableType = {
  tableId: number;
  groups: GroupType[];
};

const tableOrders: TableType[] = [
  {
    tableId: 5,
    groups: [
      {
        groupId: 1,
        groupName: 'Nhóm 1',
        orders: [
          { name: "Phở", price: 35000, toppings: [{ name: "Tái" }, { name: "Nạm" }, { name: "Viên" }], quantity: 1 },
          { name: "Bún Bò", price: 40000, toppings: [{ name: "Chả" }, { name: "Giò" }], quantity: 1 }
        ]
      }
    ]
  }
];

const GroupOrderDetails: React.FC<{ groupId: number, tableId: number, onBack: () => void }> = ({ groupId, tableId, onBack }) => {
  const table = tableOrders.find(t => t.tableId === tableId);
  const group = table?.groups.find(g => g.groupId === groupId);

  const getTotalAmount = (orders: DishType[]) => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={onBack} style={[styles.button, { marginRight: 10 }]}>
          <Text style={styles.buttonText}>⬅ Quay lại</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.groupTitle}>{group?.groupName}</Text>

      <ScrollView contentContainerStyle={styles.orderContainer}>
        {group?.orders.map((order, index) => (
          <View key={index} style={styles.dishContainer}>
            <Text style={styles.dishName}>{order.name}</Text>
            <Text style={styles.quantityText}>{order.quantity} x {order.price} VND</Text>
            <Text style={styles.toppingText}>Toppings: {order.toppings.map(t => t.name).join(', ')}</Text>
            <View style={styles.separator} />
          </View>
        ))}
        <Text style={styles.totalText}>Tổng tiền: {getTotalAmount(group?.orders ?? [])} VND</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  orderContainer: {
    marginBottom: 20,
  },
  dishContainer: {
    marginBottom: 15,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    color: '#555',
  },
  toppingText: {
    fontSize: 14,
    color: '#777',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default GroupOrderDetails;
