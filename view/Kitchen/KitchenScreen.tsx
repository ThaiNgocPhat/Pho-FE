import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
interface OrderItem {
  dishId: string;
  toppings: string[];
  quantity: number;
  note?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  createdAt?: string;
}

const KitchenViewScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_ORDER); // hoặc GET_CART nếu bạn muốn xem giỏ hàng
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Lỗi khi lấy đơn hàng:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchOrders, 3000); // auto reload mỗi 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Món đã đặt</Text>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderItem}>
          <Text>Mã đơn: {order._id}</Text>
          {order.items.map((item, idx) => (
            <Text key={idx}>
              {item.dishId} x{item.quantity} ({item.toppings.join(', ')})
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  orderItem: { marginBottom: 10, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
});

export default KitchenViewScreen;
