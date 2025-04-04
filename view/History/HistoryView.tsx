import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
  // Người A
  {
    name: 'Phở',
    price: 35000,
    toppings: [{ name: 'Tái' }, { name: 'Nạm' }, { name: 'Viên' }],
    quantity: 1,
  },
  {
    name: 'Phở',
    price: 35000,
    toppings: [{ name: 'Tái' }, { name: 'Bò' }],
    quantity: 1,
  },
  {
    name: 'Mì Gói',
    price: 20000,
    toppings: [{ name: 'Tái' }, { name: 'Nạm' }],
    quantity: 1,
  },

  // Người B
  {
    name: 'Phở',
    price: 30000,
    toppings: [{ name: 'Cẩm Thường' }],
    quantity: 1,
  },
];

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};

const HistoryView: React.FC = () => {
  const generateRandomOrderNumber = () => {
    return Math.floor(Math.random() * 900) + 100; 
  };

  const getTotalAmount = (order: DishType[]) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderOrder = (order: DishType[]) => {
    const orderNumber = generateRandomOrderNumber();
    const totalAmount = getTotalAmount(order);

    return (
      <View style={styles.orderContainer} key={orderNumber}>
        <Text style={styles.orderNumber}>Đơn hàng #{orderNumber}</Text>
        <View style={styles.separator} />
        {order.map((item, index) => (
          <View key={index} style={styles.dishContainer}>
            <View style={styles.dishRow}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.priceText}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
            <Text style={styles.toppingText}>
              {item.toppings.map((topping) => topping.name).join(', ')}
            </Text>
            <View style={styles.separator} />
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng tiền: {formatCurrency(totalAmount)}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  // Nhóm đơn hàng theo từng khách
  const customerAOrders = sampleOrders.slice(0, 3);  // Người A
  const customerBOrders = sampleOrders.slice(3);  // Người B

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử Mua Hàng</Text>
      <ScrollView contentContainerStyle={styles.cartContainer}>
        {renderOrder(customerAOrders)}
        {renderOrder(customerBOrders)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
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
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
  },
  toppingText: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryView;
