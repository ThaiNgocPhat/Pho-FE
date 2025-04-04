import { AddToCartButton } from '@/components/AddToCartButton';
import { Dish } from '@/components/Dish';
import { Topping } from '@/components/Topping';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

type TakeAwayViewProps = {};

export const TakeAwayView: React.FC<TakeAwayViewProps> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleAddToCart = () => {
    Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Dish />
        <Topping />
        <View style={styles.addToCartContainer}>
          <AddToCartButton onPress={handleAddToCart} />
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
