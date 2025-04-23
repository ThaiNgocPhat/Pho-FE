import { AddToCartButton } from '@/components/AddToCartButton';
import { Dish } from '@/components/Dish';
import { Topping } from '@/components/Topping';
import { API_ENDPOINTS } from '@/config/api';
import { DISH_TOPPING_RULES } from '@/config/constants';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Button } from 'react-native';

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
  const [dishList, setDishList] = useState<{ _id: string; name: string }[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<{ _id: string; toppings: string[]; note: string }[]>([]);


  const handleAddDish = (dishId: string, toppings: string[], note: string) => {
    setSelectedDishes((prev) => [
      ...prev,
      { _id: dishId, toppings, note },
    ]);
  };
  

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DISH); // hoặc endpoint bạn dùng
        const result = await response.json();
        setDishList(result); // giả sử result là mảng món ăn
      } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
      }
    };
  
    fetchDishes();
  }, []);
  


  const handleAddToCart = async () => {
    if (selectedDishes.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một món!');
      return;
    }
  
    try {
      const body = selectedDishes.map(({ _id, toppings, note }) => {
        const selectedDish = dishList.find((d) => d._id === _id);
        return {
          groupId,
          dishId: _id,
          toppings: toppings,
          quantity: 1,
          note: note || '',
          tableId,
          name: selectedDish?.name || 'Không rõ tên món',
        };
      });
  
      console.log('📤 Gửi nhiều món vào nhóm:', body);
  
      const response = await fetch(API_ENDPOINTS.ORDER_TABLE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result?.message || 'Thêm món thất bại');
      }
  
      Alert.alert('✅ Thành công', 'Đã thêm các món vào nhóm');
  
      setSelectedDishes([]);
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
