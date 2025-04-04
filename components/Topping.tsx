import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_ENDPOINTS } from '@/config/api';

type ToppingType = {
  name: string;
};

export const Topping: React.FC = () => {
  const [toppingList, setToppingList] = useState<ToppingType[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gọi API để lấy danh sách topping
    fetch(API_ENDPOINTS.TOPPING)
      .then(response => response.json())
      .then(data => {
        setToppingList(data); // Lưu dữ liệu topping vào state
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể tải topping. Vui lòng thử lại!');
        setLoading(false);
      });
  }, []);

  const handleSelectTopping = (name: string) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter((topping) => topping !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải topping...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
                color={selectedToppings.includes(item.name) ? '#FF9800' : 'black'}
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
