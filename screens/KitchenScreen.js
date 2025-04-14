import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import socket from '../utils/socket';

const KitchenScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('orderReceived', (orderData) => {
      console.log('Đơn hàng mới:', orderData);
      setOrders((prev) => [...prev, orderData]);
    });

    return () => {
      socket.off('orderReceived');
    };
  }, []);

  return (
    <View>
      {orders.map((order, index) => (
        <Text key={index}>
          Món: {order.dishId}, Ghi chú: {order.note}, Topping: {order.toppings.join(', ')}
        </Text>
      ))}
    </View>
  );
};

export default KitchenScreen;
