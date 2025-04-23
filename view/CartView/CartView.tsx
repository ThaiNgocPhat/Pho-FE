import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { API_ENDPOINTS } from '@/config/api'; 
import socket from '../../utils/socket'

type ToppingType = {
  name: string;
};

type DishType = {
  dishId: string;
  name: string;
  price: number;
  toppings: ToppingType[];
  quantity: number;
  note: string
};

const CartView: React.FC = () => {
  const [cartItems, setCartItems] = useState<DishType[]>([]);
  const [isCartEmpty, setIsCartEmpty] = useState(false); 
  const [cartCleared, setCartCleared] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

  const fetchCart = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_CART);
      const data = await response.json();
      console.log("Dữ liệu giỏ hàng:", data);

      if (Array.isArray(data.items) && data.items.length > 0) {
        const formatted = await Promise.all(
          data.items.map(async (item: { dishId: string, toppings: string[], quantity: number, note: string }) => {
            const dishResponse = await fetch(`${API_ENDPOINTS.GET_DISH_BY_ID}/${item.dishId}`);
            const dishData = await dishResponse.json();

            return {
              dishId: item.dishId,
              name: dishData.name,
              price: dishData.price,
              toppings: item.toppings.map((t: string) => ({ name: t })),
              quantity: item.quantity,
              note: item.note || ''
            };
          })
        );
        setCartItems(formatted);
        setIsCartEmpty(false);
      } else {
        setCartItems([]);
        setIsCartEmpty(true); 
      }
    } catch (error) {
      console.error('Lỗi khi fetch giỏ hàng:', error);
    }
  };  

  useEffect(() => {
    fetchCart(); 
  }, []);

  useEffect(() => {
    if (!isProcessing && cartCleared) {
      fetchCart();
      setCartCleared(false); // reset để không lặp lại
    }
  }, [cartCleared, isProcessing]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch(`${API_ENDPOINTS.ORDER}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity,
            toppings: item.toppings.map(t => t.name),
            note: item.note || '',
          })),
        }),
      });

      if (response.ok) {
        Alert.alert('Thông báo', 'Đặt hàng thành công!');

        const deleteResponse = await fetch(API_ENDPOINTS.CLEAR_CART, { method: 'DELETE' });

        if (deleteResponse.ok) {
          console.log("Giỏ hàng đã được xóa thành công.");
        } else {
          console.error("Không thể xóa giỏ hàng.");
        }
        socket.emit('fetchOrderHistory');
        setCartItems([]); 
        setCartCleared(true);

        const data = await response.json();
        socket.emit('orderHistoryUpdated', {
          type: 'takeaway',
          order: data,
        });

        socket.emit('fetchOrderHistory');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi thanh toán:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const handleIncreaseQuantity = (index: number) => {
    const newItems = [...cartItems];
    newItems[index].quantity += 1;
    setCartItems(newItems);
  };

  const handleDecreaseQuantity = (index: number) => {
    const newItems = [...cartItems];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
      setCartItems(newItems);
    } else {
      newItems.splice(index, 1);
      setCartItems(newItems);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      {isCartEmpty ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Giỏ hàng của bạn hiện tại không có món nào.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.cartContainer} style={{ flexGrow: 1 }}>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View style={styles.cartItemLeft}>
                <Text style={styles.dishName}>{item.name}</Text>
                <View style={styles.toppingContainer}>
                  {item.toppings.map((topping, toppingIndex) => (
                    <Text key={toppingIndex} style={styles.toppingText}>
                      {topping.name}
                    </Text>
                  ))}
                </View>
                {item.note && (
                  <Text style={{ color: 'red' }}>{item.note}</Text>
                )}
              </View>

              <View style={styles.cartItemRightContainer}>
                <View style={styles.cartItemRight}>
                  <Text style={styles.priceText}>
                    {formatPrice(item.price * item.quantity)} VNĐ
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleDecreaseQuantity(index)}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncreaseQuantity(index)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.separator} />
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.totalContainer}>
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cartContainer: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },  
  cartItemLeft: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  toppingContainer: {
    marginTop: 5,
  },
  toppingText: {
    fontSize: 14,
    color: '#555',
  },
  cartItemRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },  
  cartItemRight: {
    marginRight: 10,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default CartView;