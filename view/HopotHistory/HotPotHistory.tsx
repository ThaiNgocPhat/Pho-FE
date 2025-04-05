import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '@/config/api';

interface Hotpot {
  price: string;
  note?: string;
  _id: string;
  name: string;
  text: string;
}

const HotPotHistory = () => {
  const [hotpotHistory, setHotpotHistory] = useState<Hotpot[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHotpot, setEditingHotpot] = useState<Hotpot | null>(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedNote, setEditedNote] = useState('');

  useEffect(() => {
    fetchHotpotHistory();
  }, []);
  
  const fetchHotpotHistory = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LIST_HOT_POT);
      if (!response.ok) throw new Error('Không thể lấy dữ liệu');
      const data = await response.json();
  
      setHotpotHistory(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleEdit = (hotpot: Hotpot) => {
    setEditingHotpot(hotpot);
    setEditedPrice(hotpot.price);
    setEditedNote(hotpot.note || '');
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingHotpot) return;
  
    const validPrice = editedPrice.trim();
    if (validPrice === '' || isNaN(Number(validPrice))) {
      Alert.alert('Lỗi', 'Giá tiền không hợp lệ');
      return;
    }
  
    try {
      const response = await fetch(`${API_ENDPOINTS.UPDATE_HOT_POT}/${editingHotpot._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: validPrice, note: editedNote }),
      });
      if (!response.ok) throw new Error('Cập nhật thất bại');
      const updatedHotpot = await response.json();
      setHotpotHistory((prev) =>
        prev.map((hotpot) => 
          hotpot._id === updatedHotpot._id ? { ...hotpot, price: validPrice, note: editedNote } : hotpot
        )
      );
  
      setModalVisible(false);
      setEditingHotpot(null);
      Alert.alert('Thành công', 'Cập nhật món lẩu thành công');
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể cập nhật món lẩu');
    }
  };
  

  const handleDelete = async (id: string) => {
    Alert.alert('Xóa món lẩu', 'Bạn có chắc chắn muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            const response = await fetch(`${API_ENDPOINTS.DELETE_HOT_POT}/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) throw new Error('Không thể xóa món lẩu');

            setHotpotHistory((prev) => prev.filter((hotpot) => hotpot._id !== id));
            Alert.alert('Xóa thành công', 'Món lẩu đã được xóa');
          } catch (error) {
            console.error('Error deleting hotpot:', error);
            Alert.alert('Lỗi', 'Không thể xóa món lẩu');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử Món Lẩu</Text>
      {hotpotHistory.length === 0 ? (
        <Text>Không có món lẩu nào.</Text>
      ) : (
        <FlatList
          data={hotpotHistory}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <Text>Giá: {item.price} VNĐ</Text>
                  <Text>Ghi chú: {item.note || 'Không có ghi chú'}</Text>
                </View>
                <View style={styles.actions}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color="blue"
                    onPress={() => handleEdit(item)}
                    style={styles.icon}
                  />
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={24}
                    color="red"
                    onPress={() => handleDelete(item._id)}
                    style={styles.icon}
                  />
                </View>
              </View>
              <View style={styles.separator} />
            </View>
          )}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa món lẩu</Text>

            <TextInput
              placeholder="Giá tiền"
              style={styles.input}
              keyboardType="numeric"
              value={editedPrice}
              onChangeText={(text) => {
                if (!isNaN(Number(text)) || text === '') {
                  setEditedPrice(text);
                }
              }}
            />

            <TextInput
              placeholder="Ghi chú"
              style={styles.input}
              value={editedNote}
              onChangeText={setEditedNote}
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Cập nhật</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default HotPotHistory;
