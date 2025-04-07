import CartView from '@/view/CartView/CartView';
import HistoryView from '@/view/History/HistoryView';
import { HotpotView } from '@/view/HotPot/HotPotView';
import { OrderMenu } from '@/components/OrderMenu';
import TableDetails from '@/components/TableDetails';

import TableList from '@/view/Table/TableList';
import { TakeAwayView } from '@/view/TakeAway/TakeAwayView';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HotPotHistory from '@/view/HopotHistory/HotPotHistory';
import { API_ENDPOINTS } from '@/config/api';

type RightContentProps = {
  showTable: boolean;
  showTakeAway: boolean;
  showHotPot: boolean;
  showCart: boolean
  showHistory: boolean
  showHistoryHotPot: boolean
  selectedTable: number | null;
  setSelectedTable: (id: number | null) => void;
};

export const RightContent: React.FC<RightContentProps> = ({ showTable, showTakeAway, showHotPot, showCart, showHistory, showHistoryHotPot }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const [tables, setTables] = useState<{ id: number }[]>([]);

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

  const handleOrderPress = (groupId: number) => {
    setShowOrderMenu(true);
  };
  return (
    <View style={styles.rightPanel}>
      {showOrderMenu ? (
        <OrderMenu onBack={() => setShowOrderMenu(false)} selectedTable={selectedTable!}/>
      ) : selectedTable !== null ? (
        <TableDetails
          tableId={selectedTable}
          onBack={() => setSelectedTable(null)}
          onOrderPress={handleOrderPress}
        />
      ) : showTable ? (
        <TableList tables={tables} onSelectTable={setSelectedTable} />
      ) : showTakeAway ? (
        <TakeAwayView />
      ) : showHotPot ? (
        <HotpotView />
      ) : showCart ? (
        <CartView />
      ) : showHistory ? (
        <HistoryView />
      ) : showHistoryHotPot ? (
        <HotPotHistory/>
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


