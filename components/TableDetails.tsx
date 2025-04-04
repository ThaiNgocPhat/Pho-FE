import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

type ToppingType = {
  name: string;
};

type DishType = {
  name: string;
  price: number;
  toppings: ToppingType[];
  quantity: number;
};

const sampleOrders = [
  { 
    id: 1, 
    tableId: 5, 
    items: [
      { name: "Phở", price: 35000, toppings: [{ name: "Tái" }, { name: "Nạm" }, { name: "Viên" }], quantity: 1 },
      { name: "Bún Bò", price: 40000, toppings: [{ name: "Chả" }, { name: "Giò" }], quantity: 1 }
    ]
  },
  { 
    id: 2, 
    tableId: 5, 
    items: [
      { name: "Phở", price: 35000, toppings: [{ name: "Thăng Long" }], quantity: 1 },
      { name: "Bún Bò", price: 40000, toppings: [{ name: "Tái" }], quantity: 1 }
    ]
  },
  { 
    id: 3, 
    tableId: 10, 
    items: [
      { name: "Bún Bò", price: 40000, toppings: [{ name: "Chả" }, { name: "Giò" }], quantity: 1 }
    ]
  }
];

const TableDetails: React.FC<{ tableId: number, onBack: () => void, onOrderPress: () => void; }> = ({ tableId, onBack, onOrderPress }) => {
  const order = sampleOrders.filter(o => o.tableId === tableId);

  const getTotalAmount = (order: DishType[]) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const generateRandomOrderNumber = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  return (
    <View style={styles.container}>
      {/* Top buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={onBack} style={[styles.button, { marginRight: 10 }]}>
          <Text style={styles.buttonText}>⬅ Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOrderPress} style={[styles.button, styles.orderButton]}>
          <Text style={styles.buttonText}>🍜 Gọi món</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>Bàn số {tableId}</Text>

      {order.length > 0 ? (
        <ScrollView contentContainerStyle={styles.cartContainer}>
          {order.map((orderItem, orderIndex) => {
            const totalAmount = getTotalAmount(orderItem.items);
            return (
              <View key={orderIndex} style={styles.orderContainer}>
                <Text style={styles.orderNumber}>Đơn hàng #{generateRandomOrderNumber()}</Text>
                {orderItem.items.map((item, index) => (
                  <View key={index} style={styles.dishContainer}>
                    <View style={styles.dishRow}>
                      <Text style={styles.dishName}>{item.name}</Text>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <Text style={styles.priceText}>{formatCurrency(item.price * item.quantity)}</Text>
                    </View>
                    <Text style={styles.toppingText}>{item.toppings.map(topping => topping.name).join(', ')}</Text>
                    <View style={styles.separator} />
                  </View>
                ))}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>
                </View>
                <View style={styles.separator} />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>Chưa có món nào được gọi.</Text>
      )}
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
  orderButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  cartContainer: {
    marginBottom: 20,
  },
  orderContainer: {
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c3d00',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  dishContainer: {
    marginBottom: 10,
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 10,
  },
  toppingText: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TableDetails;
