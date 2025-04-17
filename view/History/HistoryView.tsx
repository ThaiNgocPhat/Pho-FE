// import { API_ENDPOINTS } from '@/config/api';
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

// type ToppingType = {
//   name: string;
// };

// type DishType = {
//   name: string;
//   toppings: ToppingType[];
//   quantity: number;
//   note?: string;
// };

// type OrderType = {
//   _id: string
//   orderNumber: string;
  
//   items: DishType[];
// };

// const screenWidth = Dimensions.get('window').width;

// const HistoryView: React.FC = () => {
//   const [orderList, setOrderList] = useState<OrderType[]>([]);

//   useEffect(() => {
//     fetchOrderHistory();
//   }, []);

//   const fetchOrderHistory = async () => {
//     try {
//       const response = await fetch(API_ENDPOINTS.GET_ORDER);
//       const data = await response.json();

//       if (Array.isArray(data) && data.length > 0) {
//         const formatted = data.map((order: any, index: number) => {
//           const orderItems = order.items.map((item: any) => ({
//             name: item.dish || item.name,
//             quantity: item.quantity,
//             note: item.note || '',
//             toppings: typeof item.toppings === 'string'
//               ? item.toppings.split(',').map((t: string) => ({ name: t.trim() }))
//               : [],
//           }));
//           return {
//             _id: order._id,
//             orderNumber: String(index + 1).padStart(3, '0'),
//             items: orderItems,
//           };
//         });

//         setOrderList(formatted);
//       } else {
//         console.error('Dữ liệu không hợp lệ hoặc không có dữ liệu');
//         setOrderList([]);
//       }
//     } catch (error) {
//       console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
//       setOrderList([]);
//     }
//   };

//   const renderOrder = (order: OrderType) => {
//     const handleCompleteOrder = async (orderId: string) => {
//       try {
//         await fetch(`${API_ENDPOINTS.DELETE_ORDER}/${orderId}`, { method: 'DELETE' });
//         // Cập nhật lại danh sách sau khi xoá
//         fetchOrderHistory();
//       } catch (error) {
//         console.error('Lỗi xoá đơn hàng:', error);
//       }
//     };
  
//     return (
//       <View style={styles.orderContainer} key={order._id}>
//         <Text style={styles.orderNumber}>Mã đơn hàng: {String(order._id).slice(-3)}</Text>
//         <View style={styles.separator} />
//         {order.items.map((item, index) => (
//           <View key={index} style={styles.dishContainer}>
//             <View style={styles.dishRow}>
//               <Text style={styles.dishName}>
//                 {item.name} (x{item.quantity})
//               </Text>
//             </View>
//             <Text style={styles.toppingText}>
//               {Array.isArray(item.toppings) && item.toppings.length > 0
//                 ? item.toppings.map((topping) => topping.name).join(', ')
//                 : 'Không có topping'}
//             </Text>
//             {item.note && <Text style={styles.noteText}>Ghi chú: {item.note}</Text>}
//             <View style={styles.separator} />
//           </View>
//         ))}
  
//         <TouchableOpacity
//           style={styles.completeButton}
//           onPress={() => handleCompleteOrder(order._id)}
//         >
//           <Text style={styles.buttonText}>Hoàn thành</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Lịch sử Mua Hàng</Text>
//       <ScrollView contentContainerStyle={styles.cartContainer} style={{ flex: 1 }}>
//         {orderList.length > 0 ? (
//           orderList.map((order) => renderOrder(order))
//         ) : (
//           <Text style={styles.noOrderText}>Không có lịch sử đơn hàng</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
//   orderContainer: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     width: '100%',
//   },
//   orderNumber: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
//   dishContainer: {
//     backgroundColor: '#fff',
//     padding: 12,
//     marginBottom: 8,
//     borderRadius: 6,
//     width: '100%',
//   },
//   dishRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dishName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   toppingText: {
//     fontSize: 13,
//     color: 'gray',
//     marginTop: 4,
//   },
//   noteText: {
//     fontSize: 13,
//     color: '#444',
//     marginTop: 4,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#ccc',
//     marginVertical: 8,
//   },
//   noOrderText: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: 'gray',
//     marginTop: 20,
//   },
//   cartContainer: {
//     paddingBottom: 16,
//     alignItems: 'center',
//   },
//   completeButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
  
// });

// export default HistoryView;

import { API_ENDPOINTS } from '@/config/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

type ToppingType = {
  name: string;
};

type DishType = {
  name: string;
  toppings: ToppingType[];
  quantity: number;
  note?: string;
};

type OrderType = {
  _id: string;
  orderNumber: string;
  orderType: string;  // Thêm trường orderType để xác định "Mang về" hay "Tại bàn"
  items: DishType[];
};

const screenWidth = Dimensions.get('window').width;

const HistoryView: React.FC = () => {
  const [orderList, setOrderList] = useState<OrderType[]>([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

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
              : [],
          }));
          return {
            _id: order._id,
            orderNumber: String(index + 1).padStart(3, '0'),
            orderType: order.orderType || 'Mang về',  // Gán mặc định nếu không có orderType
            items: orderItems,
          };
        });

        setOrderList(formatted);
      } else {
        console.error('Dữ liệu không hợp lệ hoặc không có dữ liệu');
        setOrderList([]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
      setOrderList([]);
    }
  };

  const renderOrder = (order: OrderType) => {
    const handleCompleteOrder = async (orderId: string) => {
      try {
        await fetch(`${API_ENDPOINTS.DELETE_ORDER}/${orderId}`, { method: 'DELETE' });
        // Cập nhật lại danh sách sau khi xoá
        fetchOrderHistory();
      } catch (error) {
        console.error('Lỗi xoá đơn hàng:', error);
      }
    };

    return (
      <View style={styles.orderContainer} key={order._id}>
        <Text style={styles.orderNumber}>Mã đơn hàng: {String(order._id).slice(-3)}</Text>
        <Text style={styles.orderType}>Loại: {order.orderType}</Text> {/* Thêm dòng này để hiển thị loại đơn hàng */}
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
            {item.note && <Text>Ghi chú: {item.note}</Text>}
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
  };

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
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  orderContainer: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 16 },
  orderNumber: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  orderType: { fontSize: 14, color: 'orange', marginBottom: 8, fontWeight: 'bold'}, // Style cho "Loại: Mang về"
  dishContainer: { backgroundColor: '#fff', padding: 8, marginBottom: 6, borderRadius: 6 },
  dishRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dishName: { fontWeight: 'bold' },
  priceText: { fontSize: 14, color: 'green' },
  toppingText: { fontSize: 12, color: 'gray' },
  separator: { height: 1, backgroundColor: '#ccc', marginVertical: 8 },
  noOrderText: { fontSize: 16, textAlign: 'center', color: 'gray' },
  cartContainer: {
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryView;
