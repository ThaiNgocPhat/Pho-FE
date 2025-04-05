import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

type AddToCartButtonProps = {
  onPress: (note: string) => void;
  note: string;
  onChangeNote: (note: string) => void;
};

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onPress, note, onChangeNote }) => {

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        placeholder="Ghi chú cho món ăn..."
        value={note}
        onChangeText={onChangeNote}
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.button} onPress={() => onPress(note)}>
        <Text style={styles.buttonText}>Thêm vào</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10, width: '100%' },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
