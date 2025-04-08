import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

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

type TableDataType = {
  groups: {
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
  const [loading, setLoading] = useState(true);

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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
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
                <Text style={styles.groupName}>{group.groupName}</Text>
                <Text style={styles.totalAmount}>Tổng: {formatCurrency(totalAmount)}</Text>

                <View style={styles.orderDetailsContainer}>
                  {group.orders.length === 0 ? (
                    <Text style={styles.emptyText}>Chưa có món ăn nào.</Text>
                  ) : (
                    group.orders.map((order, index) => (
                      <View key={index} style={styles.dishContainer}>
                        <Text style={styles.dishName}>{dishMap[order.dishId] || 'Món không xác định'}</Text>
                        <Text style={styles.toppingText}>
                          Toppings: {order.toppings.map(t => t.name).join(', ')}
                        </Text>
                        <Text style={styles.quantityText}>Số lượng: {order.quantity}</Text>
                        <View style={styles.separator} />
                      </View>
                    ))
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleOrderPress(group.groupId)}
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
