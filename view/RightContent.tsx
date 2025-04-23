import CartView from '@/view/CartView/CartView';
import HistoryView from '@/view/History/HistoryView';
import { OrderMenu } from '@/components/OrderMenu';
import TableDetails from '@/components/TableDetails';

import TableList from '@/view/Table/TableList';
import { TakeAwayView } from '@/view/TakeAway/TakeAwayView';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_ENDPOINTS } from '@/config/api';

type RightContentProps = {
  showTable: boolean;
  showTakeAway: boolean;
  showCart: boolean
  showHistory: boolean
  selectedTable: number | null;
  setSelectedTable: (id: number | null) => void;
  onBack: () => void;
  groupId: number;
  fetchData: () => void;
};

export const RightContent: React.FC<RightContentProps> = ({ showTable, showTakeAway, showCart, showHistory }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [tables, setTables] = useState<{ id: number }[]>([])
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');


  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TABLE);
        const data = await response.json();
        const mappedData = data.map((table: any) => ({
          id: table.tableId,
        }));
        setTables(mappedData);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn:', error);
      }
    };

    fetchTables();
  }, []);

  const fetchData = async () => {
    if (selectedTable !== null) {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_ORDER_TABLE}?tableId=${selectedTable}`);
        const data = await response.json();
        console.log('Reload table data:', data);
      } catch (error) {
        console.error('Lỗi reload table data:', error);
      }
    }
  };
  

  const handleOrderPress = (groupId: number, groupName: string) => {
    setSelectedGroupId(groupId); 
    setSelectedGroupName(groupName); 
    setShowOrderMenu(true);     
  };
  return (
    <View style={styles.rightPanel}>
      {showOrderMenu ? (
        <OrderMenu 
        selectedTable={selectedTable as number}
        groupId={selectedGroupId as number}
        groupName={selectedGroupName} 
        tableId={selectedTable as number}
        onBack={() => setShowOrderMenu(false)}
        fetchData={fetchData}
      /> 
      ) : selectedTable !== null ? (
        <TableDetails
          tableId={selectedTable}
          onBack={() => setSelectedTable(null)}
          onOrderPress={handleOrderPress}
          isActive
        />
      ) : showTable ? (
        <TableList tables={tables} onSelectTable={setSelectedTable} />
      ) : showTakeAway ? (
        <TakeAwayView />
      ) : showCart ? (
        <CartView />
      ) : showHistory ? (
        <HistoryView isActive={true}/>
      ) : (
        <Text style={styles.placeholder}>Chọn một tùy chọn</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 18,
    color: "#333",
  },
});