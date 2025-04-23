// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.11:7777');

// Lắng nghe sự kiện "orderReceived"
socket.on('orderReceived', (data) => {
  console.log('New Order Received:', data);
  // Cập nhật UI hoặc làm gì đó khi nhận được đơn hàng mới
});

// Gửi một order đến server
export const sendOrder = (orderData) => {
  socket.emit('sendOrder', orderData);
};

export default socket;
