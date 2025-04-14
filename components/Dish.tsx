import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_ENDPOINTS } from '../config/api';

type DishType = {
  name: string;
  _id: string;
};

interface DishProps {
  selectedDishId: string | null;
  onSelectDish: (dishId: string) => void;
  setSelectedToppings: React.Dispatch<React.SetStateAction<string[]>>; // Add this prop
}

export const Dish: React.FC<DishProps> = ({ selectedDishId, onSelectDish, setSelectedToppings }) => {
  const [dishList, setDishList] = useState<DishType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_ENDPOINTS.DISH)
      .then(response => response.json())
      .then(data => {
        setDishList(data);
      })
      .catch(err => {
        setError('Không thể tải món ăn. Vui lòng thử lại!');
      });
  }, []);
  const handleSelectDish = (dishId: string, dishName: string) => {
    onSelectDish(dishId);
    if (['Cẩm Thường', 'Cẩm Đặc Biệt'].includes(dishName)) {
      setSelectedToppings([]);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍜 Món ăn</Text>
      <View style={styles.dishContainer}>
        {dishList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dishItem}
            onPress={() => handleSelectDish(item._id, item.name)} 
          >
            <View style={styles.dishContent}>
              <Ionicons
                name={selectedDishId === item._id ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={selectedDishId === item._id ? '#FF9800' : 'black'}
                style={styles.checkbox}
              />
              <Text style={styles.dishText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  dishContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dishItem: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff3e0',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffa726',
  },
  
  dishContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  
  checkbox: {
    marginRight: 10,
  },
  dishText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5c3d00',
    flexShrink: 1, 
  },
  
  loadingText: {
    fontSize: 18,
    color: '#007bff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});