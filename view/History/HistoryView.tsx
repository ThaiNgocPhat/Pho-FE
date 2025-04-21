import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import socket from '../../utils/socket'

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

type HistoryViewProps = {
  isActive: boolean;
};


const HistoryView: React.FC<HistoryViewProps> = ({ isActive }) => {
  const [orderList, setOrderList] = useState<OrderType[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<any[]>([]);

  const mapOrderItems = (items: any[]): OrderType["items"] => {
  return items.map((item: any) => {
    const dishName =
      item.dishId?.name ||  // Ưu tiên lấy từ dishId nếu có populate
      item.dish || 
      item.name || 
      'Không rõ món';
  
    const toppings =
      typeof item.toppings === 'string'
        ? item.toppings.split(',').map((t: string) => ({ name: t.trim() }))
        : Array.isArray(item.toppings)
          ? item.toppings.map((t: any) => ({
              name: typeof t === 'string' ? t : t.name,
            }))
          : [];
  
    return {
      name: dishName,
      quantity: item.quantity,
      note: item.note || '',
      toppings,
    };
  });
};

  
  const fetchOrderHistory = async (isActive: boolean) => {
    if (!isActive) {
      console.log('Không có dữ liệu vì isActive là false.');
      return;
    }
  
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDER);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        const dineInOrders: { [key: string]: OrderType[] } = {};
        const takeAwayOrders: OrderType[] = [];
  
        data.forEach((order: any) => {
          const orderItems = order.items.map((item: any) => ({
            name: item.dish || item.name || 'Không rõ món',
            quantity: item.quantity,
            note: item.note || '',
            toppings: typeof item.toppings === 'string'
              ? item.toppings.split(',').map((t: string) => ({ name: t.trim() }))
              : item.toppings.map((t: string) => ({ name: t })),
          }));
  
          const formattedOrder: OrderType = {
            _id: order._id,
            orderNumber: order._id.slice(-3),
            orderType: order.orderType || (order.type === 'table' ? 'Tại bàn' : 'Mang về'),
            tableId: order.tableId,
            groupId: order.groupId,
            groupName: order.groupName,
            items: orderItems,
          };
  
          if (formattedOrder.orderType === 'Tại bàn' && formattedOrder.groupId !== undefined) {
            const key = `${formattedOrder.tableId}-${formattedOrder.groupId}`;
            if (!dineInOrders[key]) dineInOrders[key] = [];
            dineInOrders[key].push(formattedOrder);
          } else {
            takeAwayOrders.push(formattedOrder);
          }
        });
  
        const dineInGrouped = Object.entries(dineInOrders).map(([key, orders]) => {
          const first = orders[0];
          return {
            groupId: first.groupId,
            groupName: first.groupName,
            tableId: first.tableId,
            orders,
          };
        });
  
        setOrderList(takeAwayOrders);
        setGroupedOrders(dineInGrouped);
      } else {
        setOrderList([]);
        setGroupedOrders([]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
      setOrderList([]);
      setGroupedOrders([]);
    }
  };
  


  useEffect(() => {
    if (isActive) {
      fetchOrderHistory(isActive);
    }
  
    const handleOrderHistoryUpdated = (data: { type: 'takeaway' | 'table'; order: any }) => {
      console.log('📦 Lịch sử đơn hàng đã được cập nhật:', data);
      
      const mappedOrder: OrderType = {
        _id: data.order._id,
        orderNumber: data.order.orderNumber ?? '',
        orderType: data.order.type === 'table' ? 'Tại bàn' : 'Mang về',
        items: mapOrderItems(data.order.items ?? []),  // Đảm bảo đã gọi mapOrderItems ở đây
        tableId: data.order.tableId,
        groupId: data.order.groupId,
        groupName: data.order.groupName,
      };
    
      if (data.type === 'takeaway') {
        setOrderList((prevOrders) => {
          const exists = prevOrders.some((order) => order._id === mappedOrder._id);
          if (exists) return prevOrders;
          return [mappedOrder, ...prevOrders];  // Add new order to the top
        });
      } else if (data.type === 'table') {
        setGroupedOrders((prevGroups) => {
          const updatedGroup = {
            ...mappedOrder,
            orders: [mappedOrder],
          };
          return [updatedGroup, ...prevGroups];  // Add new group to the top
        });
      }
    };
    
  
    // Lắng nghe sự kiện cập nhật lịch sử đơn hàng
    socket.on('orderHistoryUpdated', handleOrderHistoryUpdated);
  
    // Lắng nghe sự kiện yêu cầu cập nhật lịch sử đơn hàng
    socket.on('fetchOrderHistory', () => {
      fetchOrderHistory(isActive);  // Cập nhật lại lịch sử đơn hàng khi có yêu cầu
    });
  
    return () => {
      socket.off('orderHistoryUpdated', handleOrderHistoryUpdated);
      socket.off('fetchOrderHistory');
    };
  }, [isActive]);
  
  

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_ORDER}/${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Không thể xoá đơn hàng');
      }
      console.log('✅ Đã hoàn thành đơn hàng');
      fetchOrderHistory(isActive);  // Cập nhật lại danh sách đơn hàng sau khi xoá
    } catch (error) {
      console.error('❌ Lỗi khi xoá đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể hoàn thành đơn hàng');
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

          {/* Kiểm tra toppings và render */}
          <Text style={styles.toppingText}>
              {Array.isArray(item.toppings) && item.toppings.length > 0
              ? item.toppings.map((topping, idx) => topping.name).join(', ') 
              : (typeof item.toppings === 'string' ? item.toppings : 'Không có topping')}
          </Text>

          {/* Hiển thị ghi chú nếu có */}
          {item.note && (
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
        {groupedOrders.map((group) => (
          <View key={`${group.tableId}-${group.groupId}`} style={styles.orderContainer}>
            <Text style={styles.orderNumber}>
              Bàn {group.tableId} - {group.groupName}
            </Text>
            <Text style={styles.orderType}>Loại: Tại bàn</Text>

            <View style={styles.separator} />
            
            {group.orders.map((order: OrderType) =>
              order.items.map((item, index) => (
                <View key={`${order._id}-${index}`} style={styles.dishContainer}>
                  <Text style={styles.dishName}>
                    {item.name} (x{item.quantity})
                  </Text>
                  <Text style={styles.toppingText}>
                    {item.toppings.length > 0 ? item.toppings.map(t => t.name).join(', ') : 'Không có topping'}
                  </Text>
                  {item.note && <Text style={styles.noteText}>Ghi chú: {item.note}</Text>}
                </View>
              ))
            )}

            <TouchableOpacity
              style={styles.completeButton}
              onPress={async () => {
                // Xoá tất cả đơn thuộc nhóm
                try {
                  for (let order of group.orders) {
                    await handleCompleteOrder(order._id);
                  }
                  console.log('✅ Đã hoàn thành nhóm');
                } catch (error) {
                  console.error('❌ Lỗi khi xoá nhóm:', error);
                }
              }}
            >
              <Text style={styles.buttonText}>Hoàn thành nhóm</Text>
            </TouchableOpacity>
          </View>
        ))}
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
