import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HotpotView: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleOrderHotpot = () => {
    Alert.alert('Xác nhận', `Bạn đã đặt lẩu với số tiền ${amount} VNĐ\nGhi chú: ${note}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <MaterialCommunityIcons name="pot-steam" size={30} color="black" /> Đặt Lẩu
        </Text>

        <TextInput
          label="Nhập số tiền"
          mode="outlined"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <TextInput
          label="Ghi chú"
          mode="outlined"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          style={styles.textarea}
        />

        <Button
          mode="contained"
          onPress={handleOrderHotpot}
          style={styles.orderButton}
        >
          Đặt Lẩu
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white'
  },
  textarea: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  orderButton: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
