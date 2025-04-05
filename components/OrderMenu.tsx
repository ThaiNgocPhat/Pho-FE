import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddToCartButton } from '@/components/AddToCartButton';
import { API_ENDPOINTS } from '@/config/api';

type OrderMenuProps = {
  isTakeaway: boolean;
  onBack: () => void;
};

type CartItem = {
  name: string;
  note: string;
  quantity: number;
  toppings: string[];
};

export const OrderMenu: React.FC<OrderMenuProps> = ({ isTakeaway, onBack }) => {
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [dishList, setDishList] = useState<{ name: string }[]>([]);
  const [toppingList, setToppingList] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DISH);
        const data = await response.json();
        setDishList(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
        Alert.alert('❗ Lỗi tải món ăn');
      }
    };

    const fetchToppings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TOPPING);
        const data = await response.json();
        setToppingList(data);
      } catch (error) {
        console.error('Error fetching toppings:', error);
        Alert.alert('❗ Lỗi tải topping');
      }
    };

    fetchDishes();
    fetchToppings();
  }, []);

  const toggleTopping = (name: string) => {
    setSelectedToppings(prev =>
      prev.includes(name)
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  };

  const handleAddToCart = (note: string) => {
    if (!selectedDish) {
      Alert.alert('❗ Vui lòng chọn món ăn!');
      return;
    }

    const newItem: CartItem = {
      name: selectedDish,
      note: note,  
      quantity: 1, 
      toppings: selectedToppings,
    };

    setSelectedItems(prev => [...prev, newItem]);
    setSelectedDish(null);
    setSelectedToppings([]);
    Alert.alert('✅ Thêm món thành công', `${newItem.name} đã vào giỏ hàng`);
  };

  const handleConfirmOrder = () => {
    console.log('Gửi đơn:', selectedItems);
    Alert.alert('🎉 Gọi món thành công!');
    setSelectedItems([]);
    onBack();
  };

  const handleIncreaseQuantity = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity += 1;
    setSelectedItems(updatedItems);
  };

  const handleDecreaseQuantity = (index: number) => {
    const updatedItems = [...selectedItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setSelectedItems(updatedItems);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="⬅ Quay lại" onPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🍲 Chọn món</Text>
        <View style={styles.grid}>
          {dishList.map((dish, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => setSelectedDish(dish.name)}
            >
              <View style={styles.row}>
                <Ionicons
                  name={selectedDish === dish.name ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color={selectedDish === dish.name ? '#FF9800' : '#444'}
                  style={styles.icon}
                />
                <Text style={styles.label}>{dish.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>🧂 Chọn topping</Text>
        <View style={styles.grid}>
          {toppingList.map((topping, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => toggleTopping(topping.name)}
            >
              <View style={styles.row}>
                <Ionicons
                  name={selectedToppings.includes(topping.name) ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color={selectedToppings.includes(topping.name) ? '#FF9800' : '#444'}
                  style={styles.icon}
                />
                <Text style={styles.label}>{topping.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <AddToCartButton onPress={handleAddToCart} />
        {selectedItems.length > 0 && (
          <View style={styles.selectedItemsContainer}>
            <Text style={styles.subTitle}>🧾 Món đã chọn:</Text>
            {selectedItems.map((item, index) => (
              <View key={index} style={styles.itemBox}>
                <Text style={styles.itemText}>🍽 {item.name}</Text>
                <Text style={styles.itemText}>
                  🥓 Topping: {item.toppings.join(', ') || 'Không có'}
                </Text>
                <Text style={styles.itemText}>
                  📝 Ghi chú: {item.note || 'Không có'}
                </Text>

                {/* Hiển thị và điều chỉnh số lượng */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleDecreaseQuantity(index)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncreaseQuantity(index)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <Button title="✅ Gửi đơn" onPress={handleConfirmOrder} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#fff6e6',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    overflow: 'hidden',
    flexShrink: 1,
    maxWidth: '48%',
    maxHeight: 150,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 10 },
  label: {
    fontWeight: '600',
    color: '#5a3e1b',
  },
  subTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  selectedItemsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
