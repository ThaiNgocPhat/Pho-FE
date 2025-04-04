import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export const LeftMenu = ({ setShowTable, setShowTakeAway, setShowHotPot, setShowCart, setShowHistory }: any) => {
  const handleSelectBan = () => {
    setShowTable(true); 
  };

  const handTakeAway = () => {
    setShowTable(false);
    setShowTakeAway(true)
  }

  const handHotPot = () => {
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(true);
  }

  const handCartView = () => {
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(false);
    setShowCart(true);
  }

  const handHistory = () => {
    setShowTable(false);
    setShowTakeAway(false);
    setShowHotPot(false);
    setShowCart(false);
    setShowHistory(true);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.orderOption} onPress={handleSelectBan}>
        <MaterialIcons name="table-restaurant" size={30} color="white" />
        <Text style={styles.orderOptionText}>Bàn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderOption} onPress={handTakeAway}>
        <MaterialIcons name="shopping-cart" size={30} color="white" />
        <Text style={styles.orderOptionText}>Mua về</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderOption} onPress={handHotPot}>
        <MaterialCommunityIcons name="pot-steam" size={30} color="white" />
        <Text style={styles.orderOptionText}>Đặt lẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderOption} onPress={handCartView}>
        <MaterialCommunityIcons name="basket" size={30} color="white" />
        <Text style={styles.orderOptionText}>Giỏ hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.orderOption} onPress={handHistory}>
        <MaterialCommunityIcons name="history" size={30} color="white" />
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
    padding: 10
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
  }
});
