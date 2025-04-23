// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://pho-app-daf00422d35a.herokuapp.com');


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
