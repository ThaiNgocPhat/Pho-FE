import { Platform } from 'react-native';

const REAL_PC_IP = 'https://pho-app-0c2beeee0551.herokuapp.com';  // Heroku URL

const baseUrlOrder =
  Platform.OS === 'ios' || Platform.OS === 'android'
    ? REAL_PC_IP
    : 'http://10.0.2.2:7777'; // (nếu vẫn muốn test local trên Android Emulator)

const baseUrl = baseUrlOrder;

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
