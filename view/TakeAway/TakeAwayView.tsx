import { AddToCartButton } from '@/components/AddToCartButton';
import { Dish } from '@/components/Dish';
import { Topping } from '@/components/Topping';
import { API_ENDPOINTS } from '@/config/api';
import { DISH_TOPPING_RULES } from '@/config/constants';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

type TakeAwayViewProps = {};
export const TakeAwayView: React.FC<TakeAwayViewProps> = () => {
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  

  
  const handleAddToCart = async () => {
    if (!selectedDishId) {
      Alert.alert('Thông báo', 'Vui lòng chọn món ăn!');
      return;
    }
    const toppingRule = DISH_TOPPING_RULES[selectedDishId] || 'requiredTopping';
    if (toppingRule === 'requiredTopping' && selectedToppings.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn topping!');
      return;
    }

    const cartItem = {
      dishId: selectedDishId,
      toppings: selectedToppings,
      note: note || '',
      quantity: 1, 
    };
  
    try {
      const response = await fetch(API_ENDPOINTS.ADD_TO_CART, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });
  
      if (response.ok) {
        Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công');
        setSelectedDishId(null);
        setSelectedToppings([]);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Có lỗi khi thêm vào giỏ hàng';
        Alert.alert('Thông báo', errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Thông báo', 'Không thể kết nối đến server. Vui lòng thử lại!');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Dish 
          selectedDishId={selectedDishId}
          onSelectDish={setSelectedDishId}
          setSelectedToppings={setSelectedToppings}
        />
        <Topping 
          selectedToppings={selectedToppings}
          onToggleTopping={(name) => {
            setSelectedToppings((prev) =>
              prev.includes(name)
                ? prev.filter((t) => t !== name)
                : [...prev, name]
            );
          }}
        />
        <View style={styles.addToCartContainer}>
          <AddToCartButton onPress={handleAddToCart} note={note} onChangeNote={setNote}/>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  addToCartContainer: {
    marginTop: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
});
