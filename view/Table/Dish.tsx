// Dish.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type DishType = {
  name: string;
};

export const Dish: React.FC = () => {
  const dishList: DishType[] = [
    { name: 'Phở' },
    { name: 'Bún bò' },
    { name: 'Hủ tiếu' },
    { name: 'Mì gói' },
    { name: 'Cẩm thường'},
    { name: 'Cẩm đặc biệt'}
  ];

  const [selectedDish, setSelectedDish] = useState<string | null>(null);

  const handleSelectDish = (name: string) => {
    setSelectedDish(selectedDish === name ? null : name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍜 Món ăn</Text>
      <View style={styles.dishContainer}>
        {dishList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dishItem}
            onPress={() => handleSelectDish(item.name)}
          >
            <View style={styles.dishContent}>
              <Ionicons
                name={selectedDish === item.name ? 'checkbox' : 'checkbox-outline'} 
                size={24}
                color={selectedDish === item.name ? '#4CAF50' : 'black'} 
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
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#ffebcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dishContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  checkbox: {
    marginRight: 10,
  },
  dishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c3d00',
  },
});
