import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

type ToppingType = {
  name: string;
};

type DishType = {
  name: string;
  price: number;
  toppings: ToppingType[];
  quantity: number;
};

const sampleData: DishType[] = [
  {
    name: 'Phở',
    price: 35000,
    toppings: [{ name: 'Tái' }, { name: 'Nạm' }, { name: 'Gân viên' }],
    quantity: 1,
  },
  {
    name: 'Bún bò',
    price: 40000,
    toppings: [{ name: 'Đuôi' }, { name: 'Lòng' }],
    quantity: 2,
  },
  {
    name: 'Mì gói',
    price: 20000,
    toppings: [{ name: 'Chả' }],
    quantity: 1,
  },
];

const CartView: React.FC = () => {
  const [cartItems, setCartItems] = useState(sampleData);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
      // Nếu số lượng về 0, xóa món khỏi giỏ hàng
      newItems.splice(index, 1);
      setCartItems(newItems);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <ScrollView contentContainerStyle={styles.cartContainer}>
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

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Tổng tiền: {formatPrice(totalAmount)} VNĐ
        </Text>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
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
});

export default CartView;
