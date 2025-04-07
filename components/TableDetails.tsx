import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { NavigationProp } from 'react-navigation';

// Các kiểu dữ liệu
type ToppingType = {
  name: string;
};

type OrderItemType = {
  name: string;
  price: number;
  quantity: number;
  toppings: { name: string }[];
};


type DishType = {
  _id: string;
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

// Kiểu dữ liệu trả về từ API
type TableDataType = {
  groups: { groupId: string; groupName: string; orders: { name: string; toppings: { name: string }[]; quantity: number; price: number }[] }[];
};

type TableDetailsProps = {
  tableId: number;
  onBack: () => void;
  onOrderPress: (groupId: number) => void;
};

const TableDetails: React.FC<TableDetailsProps> = ({ tableId, onBack, onOrderPress }) => {
  const [tableData, setTableData] = useState<TableDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  

  const openCreateGroupModal = () => {
    setGroupName('');
    setModalVisible(true);
  };
  
  const createNewGroup = async () => {
    if (!groupName.trim()) {
      console.error("Tên nhóm không được để trống.");
      return;
    }
  
    try {
      const response = await fetch(`${API_ENDPOINTS.CREATE_GROUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableId, groupName }), // Gửi tableId và groupName
      });
  
      if (!response.ok) throw new Error('Tạo nhóm mới thất bại');
  
      const newGroup = await response.json();
      console.log('✅ Nhóm mới:', newGroup);
  
      setModalVisible(false); // Đóng modal
  
      // Sau khi tạo nhóm, gọi lại API để lấy lại dữ liệu nhóm cho bàn
      const res = await fetch(`${API_ENDPOINTS.GET_GROUP}?tableId=${tableId}`);
      const freshData = await res.json();
      console.log('Dữ liệu bàn sau khi tạo nhóm mới:', freshData);
  
      // Cập nhật lại dữ liệu bàn (cần chắc chắn dữ liệu đúng)
      if (freshData && freshData.groups) {
        setTableData(freshData); // Cập nhật lại tableData
      } else {
        console.error('Dữ liệu bàn không hợp lệ', freshData);
      }
    } catch (error) {
      console.error('❌ Lỗi khi tạo nhóm:', error);
    }
  };
  


useEffect(() => {
  const fetchGroupData = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_GROUP}?tableId=${tableId}`);
      const data = await response.json();

      // Nếu dữ liệu trả về là mảng, chuyển thành đối tượng có trường `groups`
      const normalizedData = Array.isArray(data)
        ? { groups: data }
        : data;  // Giả sử backend đã trả về đúng dữ liệu

      setTableData(normalizedData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu nhóm:', error);
    } finally {
      setLoading(false); // Dừng loading khi dữ liệu đã sẵn sàng
    }
  };

  fetchGroupData();
}, [tableId]);

  
  const getTotalAmount = (orders: OrderItemType[]) => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0);
  };  

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Sửa hàm handleOrderPress
  const handleOrderPress = (groupId: string) => {
    const parsedGroupId = parseInt(groupId, 10);  // Chuyển đổi groupId thành number
    onOrderPress(parsedGroupId);  // Truyền groupId đã chuyển đổi vào hàm onOrderPress
  };

  const table = tableData;

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={onBack} style={[styles.button, { marginRight: 10 }]}>
          <Text style={styles.buttonText}>⬅ Quay lại</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={openCreateGroupModal} style={[styles.button, styles.orderButton]}>
          <Text style={styles.buttonText}>🍜 Tạo nhóm mới</Text>
        </TouchableOpacity>
      </View>
  
      <Text style={styles.tableTitle}>Bàn số {tableId}</Text>
  
      {table?.groups && table.groups.length > 0 ? (
      <ScrollView contentContainerStyle={styles.groupListContainer}>
        {table.groups.map((group) => {
          const totalAmount = getTotalAmount(group.orders);
          return (
            <View key={group.groupId} style={styles.groupItem}>
              <Text style={styles.groupName}>{group.groupName}</Text>
              <Text style={styles.totalAmount}>Tổng: {formatCurrency(totalAmount)}</Text>

              <View style={styles.orderDetailsContainer}>
                {/* Hiển thị các món đã gọi trong nhóm */}
                {group.orders.map((order, index) => (
                  <View key={index} style={styles.dishContainer}>
                    <Text style={styles.dishName}>{order.name}</Text>
                    <Text style={styles.toppingText}>
                      Toppings: {order.toppings.map(t => t.name).join(', ')}
                    </Text>
                    <Text style={styles.quantityText}>Số lượng: {order.quantity}</Text>
                    <View style={styles.separator} />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleOrderPress(group.groupId.toString())}
                style={styles.callOrderButton}>
                <Text style={styles.callOrderText}>🍽 Gọi món</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <Text style={styles.emptyText}>Không có dữ liệu cho bàn này.</Text>
    )}
  
      {/* 💬 Modal tạo nhóm mới */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nhập tên nhóm</Text>
            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
              placeholder="VD: Nhóm 1"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                <Text style={styles.buttonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createNewGroup} style={styles.button}>
                <Text style={styles.buttonText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
    width: 'auto',
  },
  orderButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
    width: '100%',
  },
  groupListContainer: {
    marginBottom: 20,
    width: '100%',
  },
  groupItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: '100%',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 5,
  },
  orderDetailsContainer: {
    marginTop: 10,
    width: '100%',
  },
  dishContainer: {
    marginBottom: 10,
    width: '100%',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
  },
  quantityText: {
    fontSize: 14,
    color: '#555',
  },
  toppingText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 10,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callOrderButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  
  callOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
});

export default TableDetails;
