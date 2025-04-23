import { Platform } from 'react-native';

// IP thật của máy tính trong mạng LAN (máy chạy backend)
const REAL_PC_IP = 'http://192.168.1.11:7777';

const baseUrlOrder =
  Platform.OS === 'ios'
    ? REAL_PC_IP  // iPhone và iPad thật
    : 'http://10.0.2.2:7777'; // Android giả lập

// Base URL mặc định cho các API khác
const baseUrl = baseUrlOrder; // tất cả dùng IP thật khi demo bằng thiết bị thật

export const API_ENDPOINTS = {
  CREATE_HOT_POT: `${baseUrl}/hotpot`,
  LIST_HOT_POT: `${baseUrl}/hotpot`,
  UPDATE_HOT_POT: `${baseUrl}/hotpot`,
  DELETE_HOT_POT: `${baseUrl}/hotpot`,
  ADD_TO_CART: `${baseUrl}/orders`,
  GET_CART: `${baseUrl}/cart`,
  DISH: `${baseUrl}/dish`,
  GET_DISH_BY_ID: `${baseUrl}/dish`,
  TOPPING: `${baseUrl}/topping`,
  GET_ORDER: `${baseUrlOrder}/orders`,
  DELETE_ORDER: `${baseUrlOrder}/orders`,
  ORDER_TABLE: `${baseUrl}/table-order`,
  DELETE_GROUP: `${baseUrl}/table-order`,
  GET_ORDER_TABLE: `${baseUrl}/table-order`,
  CREATE_GROUP: `${baseUrl}/table-order/create-group`,
  TABLE: `${baseUrl}/tables`,
  PAY_MENT: `${baseUrl}/orders/payment`,
  DELETE_DISH: `${baseUrl}/table-order/remove-dish`,
  UPDATE_DISH_QUANTITY: `${baseUrl}/table-order/update-quantity`,
  ORDER: `${baseUrl}/orders`,
  CLEAR_CART: `${baseUrl}/cart`,
};
