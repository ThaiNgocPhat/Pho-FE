import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:7777');

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('new_order', (data) => {
      console.log('New order received:', data);
      setOrders((prevOrders) => [...prevOrders, data]);
    });
    return () => {
      socket.off('new_order');
    };
  }, []);

  // Gửi order tới WebSocket server
  const placeOrder = (orderData) => {
    socket.emit('order_placed', orderData);
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order, index) => (
        <div key={index}>
          <p>Order ID: {order.id}</p>
          <p>Table: {order.table}</p>
          <p>Dish: {order.dish}</p>
          <p>Topping: {order.toppings}</p>
          <p>Quantity: {order.quantity}</p>
        </div>
      ))}
      <button onClick={() => placeOrder({ id: '123', dish: 'Pho' })}>Place Order</button>
    </div>
  );
};

export default OrderScreen;
