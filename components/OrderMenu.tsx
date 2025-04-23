import { AddToCartButton } from '@/components/AddToCartButton';
import { Dish } from '@/components/Dish';
import { Topping } from '@/components/Topping';
import { API_ENDPOINTS } from '@/config/api';
import { DISH_TOPPING_RULES } from '@/config/constants';
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import socket from '@/utils/socket';

type OrderMenuProps = {
  selectedTable: number;
  groupId: number;
  groupName: string; 
  tableId: number;
  onBack: () => void;
  fetchData: () => Promise<void>;
};

export const OrderMenu: React.FC<OrderMenuProps> = ({
  onBack,
  selectedTable,
  groupId,
  groupName, 
  tableId,  
  fetchData
}) => {
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');

  // Trong OrderMenu
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
  
    try {
      const body = {
        groupId,
        dishId: selectedDishId,
        toppings: selectedToppings,
        quantity: 1,
        note: note || '',
        tableId,
        name: groupName || 'Nhóm X',
      };
  
      const response = await fetch(API_ENDPOINTS.ORDER_TABLE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result?.message || 'Thêm món thất bại');
      }
  
      Alert.alert('✅ Thành công', 'Đã thêm món vào nhóm');

      socket.emit('orderHistoryUpdated', {
        type: 'table',
        order: {
          _id: result._id,
          orderType: 'Tại bàn',
          tableId,
          groupId,
          groupName,
          items: result.items, 
        }
      });      
  
      setSelectedDishId(null);
      setSelectedToppings([]);
      setNote('');
  
      if (fetchData) {
        await fetchData();
      }
  
      onBack();
    } catch (error) {
      console.error('❌ Lỗi khi thêm món:', error);
      Alert.alert('Lỗi', 'Không thể thêm món. Vui lòng thử lại!');
    }
  };
  

  
  return (
    <View style={styles.container}>
      <Button title="⬅ Quay lại" onPress={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Dish
          selectedDishId={selectedDishId}
          onSelectDish={setSelectedDishId}
          setSelectedToppings={setSelectedToppings}
        />
        <Topping
          selectedToppings={selectedToppings}
          onToggleTopping={(name) =>
            setSelectedToppings((prev) =>
              prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
            )
          }
        />
        <View style={styles.addToCartContainer}>
          <AddToCartButton
            onPress={handleAddToCart}
            note={note}
            onChangeNote={setNote}
          />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  addToCartContainer: {
    marginTop: 16,
  },
});