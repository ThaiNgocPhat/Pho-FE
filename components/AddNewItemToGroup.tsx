import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';

type ToppingType = {
  name: string;
};

type DishType = {
  name: string;
  price: number;
  toppings: ToppingType[];
  quantity: number;
};

type GroupType = {
  groupId: number;
  groupName: string;
  orders: DishType[];
};

type TableType = {
  tableId: number;
  groups: GroupType[];
};

const tableOrders: TableType[] = [
  {
    tableId: 5,
    groups: [
      {
        groupId: 1,
        groupName: 'Nhóm 1',
        orders: [
          { name: "Phở", price: 35000, toppings: [{ name: "Tái" }, { name: "Nạm" }, { name: "Viên" }], quantity: 1 },
          { name: "Bún Bò", price: 40000, toppings: [{ name: "Chả" }, { name: "Giò" }], quantity: 1 }
        ]
      }
    ]
  }
];

const AddNewItemToGroup: React.FC<{ groupId: number, tableId: number, onBack: () => void }> = ({ groupId, tableId, onBack }) => {
  const table = tableOrders.find(t => t.tableId === tableId);
  const group = table?.groups.find(g => g.groupId === groupId);
  const [newItem, setNewItem] = useState<DishType | null>(null);

  const handleAddItem = (newItem: DishType) => {
    group?.orders.push(newItem); // Thêm món vào nhóm
    setNewItem(newItem); // Cập nhật món đã thêm
    Alert.alert('Món ăn đã được thêm vào nhóm');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn món mới cho {group?.groupName}</Text>
      {/* Danh sách các món ăn để chọn */}
      <Button title="Thêm Phở" onPress={() => handleAddItem({ name: "Phở", price: 35000, toppings: [], quantity: 1 })} />
      <Button title="Thêm Bún Bò" onPress={() => handleAddItem({ name: "Bún Bò", price: 40000, toppings: [], quantity: 1 })} />
      <Button title="Quay lại" onPress={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AddNewItemToGroup;
