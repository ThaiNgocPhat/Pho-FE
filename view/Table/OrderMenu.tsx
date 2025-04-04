// OrderMenu.tsx
import { AddToCartButton } from '@/view/Table/AddToCartButton';
import { Dish } from '@/view/Table/Dish';
import { Topping } from '@/view/Table/Topping';
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';

type OrderMenuProps = {
  isTakeaway: boolean;
};

export const OrderMenu: React.FC<OrderMenuProps> = ({ isTakeaway }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleAddToCart = (note: string) => {
    Alert.alert('Thông báo', `Thêm vào giỏ hàng thành công với ghi chú: ${note}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{isTakeaway ? 'Mang về' : 'Gọi món'}</Text>
        <Dish />
        <Topping />
        <AddToCartButton onPress={handleAddToCart} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
});
