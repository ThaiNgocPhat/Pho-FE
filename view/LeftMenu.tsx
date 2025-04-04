import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export const LeftMenu = ({ setShowTable, setShowTakeAway, setShowHotPot, setShowCart, setShowHistory }: any) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelectBan = () => {
    setSelectedOption('table');
    setShowTable(true); 
  };

  const handTakeAway = () => {
    setSelectedOption('takeaway');
    setShowTable(false);
    setShowTakeAway(true);
  };

  const handHotPot = () => {
    setSelectedOption('hotpot');
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(true);
  };

  const handCartView = () => {
    setSelectedOption('cart');
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(false);
    setShowCart(true);
  };

  const handHistory = () => {
    setSelectedOption('history');
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(false);
    setShowCart(false);
    setShowHistory(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.orderOption,
          selectedOption === 'table' && styles.selectedOption,
        ]}
        onPress={handleSelectBan}
      >
        <MaterialIcons 
          name="table-restaurant" 
          size={30} 
          color={selectedOption === 'table' ? "#fff" : "white"}
        />
        <Text style={styles.orderOptionText}>Bàn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.orderOption,
          selectedOption === 'takeaway' && styles.selectedOption,
        ]}
        onPress={handTakeAway}
      >
        <MaterialIcons 
          name="shopping-cart" 
          size={30} 
          color={selectedOption === 'takeaway' ? "#fff" : "white"}
        />
        <Text style={styles.orderOptionText}>Mua về</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.orderOption,
          selectedOption === 'hotpot' && styles.selectedOption,
        ]}
        onPress={handHotPot}
      >
        <MaterialCommunityIcons 
          name="pot-steam" 
          size={30} 
          color={selectedOption === 'hotpot' ? "#fff" : "white"}
        />
        <Text style={styles.orderOptionText}>Đặt lẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.orderOption,
          selectedOption === 'cart' && styles.selectedOption,
        ]}
        onPress={handCartView}
      >
        <MaterialCommunityIcons 
          name="basket" 
          size={30} 
          color={selectedOption === 'cart' ? "#fff" : "white"}
        />
        <Text style={styles.orderOptionText}>Giỏ hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.orderOption,
          selectedOption === 'history' && styles.selectedOption,
        ]}
        onPress={handHistory}
      >
        <MaterialCommunityIcons 
          name="history" 
          size={30} 
          color={selectedOption === 'history' ? "#fff" : "white"} 
        />
        <Text style={styles.orderOptionText}>Lịch sử</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    backgroundColor: "white",
    marginTop: 25,
    padding: 10,
  },
  orderOption: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",  
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  orderOptionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  selectedOption: {
    backgroundColor: '#FF9800', 
  },
});
