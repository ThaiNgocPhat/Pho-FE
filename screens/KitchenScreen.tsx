import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import socket from '../utils/socket';
import { API_ENDPOINTS } from '@/config/api'; // Đảm bảo bạn đã import đúng đường dẫn

type OrderItem = {
  dishId: string;
  name: string;
  quantity: number;
  toppings: string[];
  note?: string;
};

type Order = {
  type: string;
  items: OrderItem[];
  createdAt?: string;
};

const KitchenScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Gọi API để lấy đơn hàng cũ
  const fetchOrders = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_ORDER);
      const data = await res.json();
      setOrders(data); // giả sử data là mảng Order[]
    } catch (err) {
      console.error('Lỗi khi fetch đơn hàng:', err);
    }
  };

  useEffect(() => {
    fetchOrders(); // gọi khi màn hình mount

    const handleOrderReceived = (orderData: Order) => {
      console.log('Đơn hàng mới:', orderData);
      setOrders((prev) => [...prev, orderData]);
    };

    socket.on('orderReceived', handleOrderReceived);

    return () => {
      socket.off('orderReceived', handleOrderReceived);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đơn hàng trong bếp</Text>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderBlock}>
          <Text style={styles.orderHeader}>Đơn #{index + 1} - {order.type}</Text>
          {order.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.itemBlock}>
              <Text style={styles.dishName}>Món: {item.name}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Toppings: {item.toppings.length > 0 ? item.toppings.join(', ') : 'Không có'}</Text>
              {item.note && <Text>Ghi chú: {item.note}</Text>}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  orderBlock: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  orderHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemBlock: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 6,
    borderRadius: 6,
  },
  dishName: {
    fontWeight: 'bold',
  },
});

export default KitchenScreen;
