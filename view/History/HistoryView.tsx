import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
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

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};

const HistoryView: React.FC = () => {
  const [orderList, setOrderList] = useState<DishType[][]>([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);
  
  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDER);
      const data = await response.json();
  
      const formatted = await Promise.all(
        data.map(async (order: { items: any[] }) => {
          const orderItems = await Promise.all(
            order.items.map(async (item) => {
              const dishRes = await fetch(`${API_ENDPOINTS.GET_DISH_BY_ID}/${item.dishId}`);
              const dish = await dishRes.json();
  
              return {
                dishId: item.dishId,
                name: dish.name,
                price: dish.price,
                toppings: item.toppings.map((t: string) => ({ name: t })),
                quantity: item.quantity,
              };
            })
          );
  
          return orderItems;
        })
      );
  
      setOrderList(formatted);
    } catch (error) {
      console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
    }
  };

  const generateRandomOrderNumber = () => {
    return Math.floor(Math.random() * 900) + 100; 
  };

  const getTotalAmount = (order: DishType[]) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + ' VNĐ';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử Mua Hàng</Text>
      <ScrollView contentContainerStyle={styles.cartContainer} style={{ flex: 1 }}>
        {orderList.map((order, index) => renderOrder(order))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1', 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cartContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    width: '100%',
  },
  orderContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#e0e0e0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, 
    width: '100%', 
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 12,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ddd', 
    marginVertical: 6,
  },
  dishContainer: {
    marginBottom: 2, // Giảm khoảng cách giữa các món ăn
    width: '100%',
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dishName: {
    fontSize: 17,
    fontWeight: '500',
    flex: 2,
    color: '#222',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  toppingText: {
    fontSize: 14,
    color: '#555', 
    paddingLeft: 4,
  },
  totalContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
    width: '100%', 
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});



export default HistoryView;
