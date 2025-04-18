import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
type OrderType = {
  _id: string;
  orderNumber: string;
  orderType: string;
  tableId?: number;
  groupId?: number;
  groupName?: string;
  items: {
    name: string;
    quantity: number;
    note: string;
    toppings: { name: string }[];
  }[];
};


const HistoryView: React.FC = () => {
  const [orderList, setOrderList] = useState<OrderType[]>([]);

   const fetchOrderHistory = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDER);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((order: any, index: number) => {
          const orderItems = order.items.map((item: any) => ({
            name: item.dish || item.name,
            quantity: item.quantity,
            note: item.note || '',
            toppings: typeof item.toppings === 'string'
              ? item.toppings.split(',').map((t: string) => ({ name: t.trim() }))
              : item.toppings.map((t: string) => ({ name: t })),
          }));
  
          return {
            _id: order._id,
            orderNumber: String(index + 1).padStart(3, '0'),
            orderType: order.orderType || (order.type === 'table' ? 'Tại bàn' : 'Mang về'),
            tableId: order.tableId,
            groupId: order.groupId,
            groupName: order.groupName,
            items: orderItems,
          };          
        });
  
        setOrderList(formatted);
      } else {
        setOrderList([]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
      setOrderList([]);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);
  

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await fetch(`${API_ENDPOINTS.DELETE_ORDER}/${orderId}`, { method: 'DELETE' });
      fetchOrderHistory();
    } catch (error) {
      console.error('Lỗi xoá đơn hàng:', error);
    }
  };

  const renderOrder = (order: OrderType) => (
    <View style={styles.orderContainer} key={order._id}>
      <Text style={styles.orderNumber}>Mã đơn hàng: {String(order._id).slice(-3)}</Text>
      <Text style={styles.orderType}>Loại: {order.orderType}</Text>
      
      {/* Hiển thị thông tin bàn, nhóm nếu là loại 'table' */}
      {order.orderType === 'Tại bàn' && (
        <View style={styles.tableInfo}>
          <Text style={styles.tableInfoText}>Bàn: {order.tableId}</Text>
          <Text style={styles.tableInfoText}>Nhóm: {order.groupId}</Text>
        </View>
      )}
      
      <View style={styles.separator} />
  
      {order.items.map((item, index) => (
        <View key={index} style={styles.dishContainer}>
          <View style={styles.dishRow}>
            <Text style={styles.dishName}>
              {item.name} (x{item.quantity})
            </Text>
          </View>
          <Text style={styles.toppingText}>
            {Array.isArray(item.toppings) && item.toppings.length > 0
              ? item.toppings.map((topping) => topping.name).join(', ')
              : 'Không có topping'}
          </Text>
          {item.note !== undefined && item.note !== null && item.note !== '' && (
            <Text style={styles.noteText}>Ghi chú: {item.note}</Text>
          )}
          <View style={styles.separator} />
        </View>
      ))}
  
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => handleCompleteOrder(order._id)}
      >
        <Text style={styles.buttonText}>Hoàn thành</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử Mua Hàng</Text>
      <ScrollView contentContainerStyle={styles.cartContainer} style={{ flex: 1 }}>
        {orderList.length > 0 ? (
          orderList.map((order) => renderOrder(order))
        ) : (
          <Text style={styles.noOrderText}>Không có lịch sử đơn hàng</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  orderContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderType: {
    fontSize: 14,
    color: 'orange',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dishContainer: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 6,
    borderRadius: 6,
    width: '100%',
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dishName: {
    fontWeight: 'bold',
  },
  toppingText: {
    fontSize: 12,
    color: 'gray',
  },
  noteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#444',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  noOrderText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  cartContainer: {
    paddingBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  tableInfoText: {
    fontSize: 14,
    color: '#333',
  },
});

export default HistoryView;
