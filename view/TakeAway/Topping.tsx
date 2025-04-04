import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type ToppingType = {
  name: string;
};

export const Topping: React.FC = () => {
  const toppingList: ToppingType[] = [
    { name: 'Tái' },
    { name: 'Nạm' },
    { name: 'Gân viên' },
    { name: 'Xương' },
    { name: 'Đuôi' },
    { name: 'Lòng' },
    { name: 'Tim' },
    { name: 'Phèo' },
    { name: 'Thăng long' },
    { name: 'Lá mía' },
  ];

  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const handleSelectTopping = (name: string) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter((topping) => topping !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥢 Topping</Text>
      <View style={styles.toppingContainer}>
        {toppingList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.toppingItem}
            onPress={() => handleSelectTopping(item.name)}
          >
            <View style={styles.toppingContent}>
              <Ionicons
                name={selectedToppings.includes(item.name) ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={selectedToppings.includes(item.name) ? '#4CAF50' : 'black'}
                style={styles.checkbox}
              />
              <Text style={styles.toppingText}>{item.name}</Text>
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
  toppingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toppingItem: {
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
  toppingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  checkbox: {
    marginRight: 10,
  },
  toppingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c3d00',
  },
});
