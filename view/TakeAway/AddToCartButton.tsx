import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

type AddToCartButtonProps = {
  onPress: (note: string) => void; 
};

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onPress }) => {
  const [note, setNote] = useState<string>(''); 

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        placeholder="Ghi chú cho món ăn..."
        value={note}
        onChangeText={setNote}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => onPress(note)}>
        <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  textArea: {
    height: 100,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
