import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import fetchOrderHistory from '../view/History/HistoryView'


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

type TableDataType = {
  groups: {
    _id: string
    groupId: string;
    groupName: string;
    orders: {
      dishId: string; 
      name: string;
      toppings: { name: string }[];
      quantity: number;
      price: number;
    }[];
  }[];
};


type TableDetailsProps = {
  tableId: number;
  onBack: () => void;
  onOrderPress: (groupId: number, groupName: string) => void;
};

const TableDetails: React.FC<TableDetailsProps> = ({ tableId, onBack, onOrderPress }) => {
  const [tableData, setTableData] = useState<TableDataType>({ groups: [] });
  const [dishMap, setDishMap] = useState<Record<string, string>>({});
  const [selectedGroupIdForPayment, setSelectedGroupIdForPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ groupId: string; dishId: string; quantity?: number } | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number>(1);


  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.DISH);
        const data: DishType[] = await res.json();
        const map = Object.fromEntries(data.map((dish) => [dish._id, dish.name]));
        setDishMap(map);
      } catch (err) {
        console.error('❌ Lỗi khi lấy danh sách món ăn:', err);
      }
    };
  
    fetchDishes();
  }, []);
  

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_ORDER_TABLE}?tableId=${tableId}`);
      const text = await response.text();
      console.log('📥 Response text:', text);
      // const data = await response.json();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('❌ Không thể parse JSON:', jsonError);
        return;
      }
      const groups = (data?.groups || []).map((group: any) => ({
        ...group,
        groupName: group.groupName || `Nhóm ${group.groupId}`,
        _id: group._id,
        orders: group.orders.map((order: any) => ({
          ...order,
          toppings: Array.isArray(order.toppings)
            ? order.toppings.map((t: any) => (typeof t === 'string' ? { name: t } : t))
            : [],
        })),
      }));
      setTableData({ groups });
    } catch (error) {
      console.error('❌ Lỗi khi fetch dữ liệu bàn:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableId]);

  const createNewGroup = async () => {
    try {
      const groupsBefore = tableData?.groups ?? [];
  
      const nextGroupId = groupsBefore.length > 0
        ? Math.max(...groupsBefore.map((g) => parseInt(g.groupId, 10))) + 1
        : 1;
  
      const defaultGroupName = `Nhóm ${nextGroupId}`;
  
      const existingGroup = groupsBefore.find((g) => g.groupName === defaultGroupName);
      if (existingGroup) {
        console.log('⚠️ Nhóm đã tồn tại, không tạo mới');
        return;
      }
  
      console.log('📤 Gửi request tạo nhóm:', { groupName: defaultGroupName, tableId });
  
      const response = await fetch(`${API_ENDPOINTS.CREATE_GROUP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, groupName: defaultGroupName }),
      });
  
      const result = await response.json();
      console.log('📥 Kết quả response:', response.status, result);
  
      if (!response.ok) throw new Error(result?.message || 'Tạo nhóm mới thất bại');
  
      // ✅ Gọi lại fetchData và CẬP NHẬT lại `tableData`
      const refetch = await fetch(`${API_ENDPOINTS.GET_ORDER_TABLE}?tableId=${tableId}`);
      const refetchData = await refetch.json();
  
      const groups = (refetchData?.groups || []).map((group: any) => ({
        ...group,
        groupName: group.groupName || `Nhóm ${group.groupId}`,
        orders: group.orders.map((order: any) => ({
          ...order,
          toppings: Array.isArray(order.toppings)
            ? order.toppings.map((t: any) => (typeof t === 'string' ? { name: t } : t))
            : [],
        })),
      }));
      
      setTableData({ groups });      
    } catch (error) {
      console.error('❌ Lỗi khi tạo nhóm:', error);
    }
  };
  
  
  
  const getTotalAmount = (orders: OrderItemType[]) => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleOrderPress = (groupId: string) => {
    const parsedGroupId = parseInt(groupId, 10);
    const group = tableData?.groups?.find(group => parseInt(group.groupId, 10) === parsedGroupId);
    if (group) {
      onOrderPress(parsedGroupId, group.groupName);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }
  const handleConfirmPayment = async () => {
    if (!selectedGroupIdForPayment) return;
    try {
      await handleDeleteGroup(selectedGroupIdForPayment);
      setSelectedGroupIdForPayment(null);
    } catch (error) {
      console.error('❌ Lỗi khi thanh toán (xoá nhóm):', error);
    }
  };
  
  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_GROUP}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, groupId: parseInt(groupId, 10) }),
      });
  
      const result = await response.json();
      console.log('🗑 Nhóm đã xoá:', result);
  
      fetchData(); // Reload lại dữ liệu sau khi xoá
    } catch (error) {
      console.error('❌ Lỗi khi xoá nhóm:', error);
    }
  };
  
  const handleDeleteDish = async (
    tableId: number,
    groupId: number,
    dishId: string
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_DISH}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableId, groupId, dishId }),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
  
      console.log('✅ Đã xoá món khỏi nhóm');
      fetchData(); // reload dữ liệu
    } catch (err) {
      console.error('❌ Lỗi khi xoá món:', err);
      Alert.alert('Lỗi', 'Không thể xoá món');
    }
  };
  const handleUpdateQuantity = async (
    tableId: number,
    groupId: number,
    dishId: string,
    quantity: number
  ) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.UPDATE_DISH_QUANTITY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, groupId, dishId, quantity }),
      });      
  
      if (!res.ok) {
        throw new Error(await res.text());
      }
      console.log('✅ Đã cập nhật số lượng món');
      fetchOrderHistory(tableId);
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật số lượng:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng món ăn');
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={onBack} style={[styles.button, { marginRight: 10 }]}>
          <Text style={styles.buttonText}>⬅ Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={createNewGroup} style={[styles.button, styles.orderButton]}>
          <Text style={styles.buttonText}>🍜 Tạo nhóm mới</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>Bàn số {tableId}</Text>

      {tableData?.groups?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.groupListContainer}>
          {tableData.groups.map((group) => {
            const totalAmount = getTotalAmount(group.orders);
            return (
              <View key={group.groupId} style={styles.groupItem}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName} numberOfLines={1} ellipsizeMode="tail">
                    {group.groupName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGroupId(group.groupId);
                      setShowDeleteModal(true);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteIcon}>❌</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.orderDetailsContainer}>
                  {group.orders.length === 0 ? (
                    <Text style={styles.emptyText}>Chưa có món ăn nào.</Text>
                  ) : (
                    group.orders.map((order, index) => (
                      <View key={index} style={styles.dishContainer}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.dishName}>
                            {dishMap[order.dishId] || 'Món không xác định'}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              Alert.alert('Xác nhận xoá', 'Bạn có chắc chắn muốn xoá món này?', [
                                { text: 'Huỷ', style: 'cancel' },
                                {
                                  text: 'Xoá',
                                  style: 'destructive',
                                  onPress: () =>
                                    handleDeleteDish(tableId, Number(group.groupId), order.dishId),
                                },
                              ])
                            }>
                            <Text style={styles.deleteIcon}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.toppingText}>
                          Toppings: {order.toppings.map((t) => t.name).join(', ')}
                        </Text>
                        <Text style={styles.quantityText}>
                          Số lượng:{' '}
                          {editingItem?.groupId === group.groupId && editingItem?.dishId === order.dishId ? (
                            <View style={styles.editQuantityRow}>
                              <TouchableOpacity onPress={() => setEditingQuantity(Math.max(1, editingQuantity - 1))}>
                                <Text style={styles.editButton}>➖</Text>
                              </TouchableOpacity>
                              <Text style={styles.editingQuantity}>{editingQuantity}</Text>
                              <TouchableOpacity onPress={() => setEditingQuantity(editingQuantity + 1)}>
                                <Text style={styles.editButton}>➕</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <>
                              {order.quantity}
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingItem({ groupId: group.groupId, dishId: order.dishId });
                                  setEditingQuantity(order.quantity);
                                }}
                              >
                                <Text style={styles.editIcon}>✏️</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </Text>
                        <View style={styles.separator} />
                      </View>
                    ))                    
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  {editingItem?.groupId === group.groupId ? (
                    <>
                      <TouchableOpacity
                        onPress={async () => {
                          await handleUpdateQuantity(
                            Number(tableId),
                            Number(group.groupId),
                            editingItem.dishId,
                            editingQuantity
                          );
                          setEditingItem(null);
                          fetchData(); 
                        }}
                        style={styles.saveButton}
                      >
                        <Text style={styles.callOrderText}>💾 Lưu</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          if (editingQuantity === editingItem?.quantity) {
                            setEditingItem(null);
                          } else {
                            setEditingQuantity(editingItem?.quantity || 1);
                            setEditingItem(null);
                          }
                        }}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.cancelButtonText}>🚫 Huỷ</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => handleOrderPress(group.groupId)}
                        style={styles.callOrderButton}
                      >
                        <Text style={styles.callOrderText}>🍽 Gọi món</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSelectedGroupIdForPayment(group.groupId)}
                        style={styles.payButton}
                      >
                        <Text style={styles.callOrderText}>💸 Thanh toán</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>Không có dữ liệu cho bàn này.</Text>
      )}
      <Modal
        isVisible={!!selectedGroupIdForPayment}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setSelectedGroupIdForPayment(null)}
        useNativeDriver
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận thanh toán</Text>
            <Text style={styles.modalMessage}>Bạn có chắc chắn muốn thanh toán nhóm này không?</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={handleConfirmPayment} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>✅ Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedGroupIdForPayment(null)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>✖ Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal isVisible={showDeleteModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Xác nhận xoá nhóm</Text>
          <Text style={styles.modalMessage}>Bạn có chắc chắn muốn xoá nhóm này không?</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(false)}
              style={[styles.modalButton, styles.cancelButtonStyle]}
            >
              <Text style={styles.cancelText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedGroupId) {
                  handleDeleteGroup(selectedGroupId);
                }
                setShowDeleteModal(false);
              }}
              style={[styles.modalButton, styles.deleteButtonStyle]}
            >
              <Text style={styles.deleteText}>Xoá</Text>
            </TouchableOpacity>
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
    width: '90%',
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  callOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10, // nếu RN >= 0.71
  },
  
  callOrderButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  payButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  deleteIcon: {
    fontSize: 18,
    color: 'red',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  
  cancelButtonStyle: {
    backgroundColor: '#E0E0E0',
  },
  
  deleteButtonStyle: {
    backgroundColor: '#FF4D4D',
  },
  
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },  
  editIcon: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },  
  editQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  
  editButton: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: '#007AFF',
  },
  
  editingQuantity: {
    fontSize: 16,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  
});

export default TableDetails;
