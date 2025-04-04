import CartView from '@/view/CartView/CartView';
import HistoryView from '@/view/History/HistoryView';
import { HotpotView } from '@/view/HotPot/HotPotView';
import TableDetails from '@/view/Table/TableDetails';
import TableList from '@/view/Table/TableList';
import { TakeAwayView } from '@/view/TakeAway/TakeAwayView';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type RightContentProps = {
  showTable: boolean;
  showTakeAway: boolean;
  showHotPot: boolean;
  showCart: boolean
  showHistory: boolean
  selectedTable: number | null;
  setSelectedTable: (id: number | null) => void;
};

export const RightContent: React.FC<RightContentProps> = ({ showTable, showTakeAway, showHotPot, showCart, showHistory }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const tables = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));

  return (
    <View style={styles.rightPanel}>
      {selectedTable !== null ? (
        <TableDetails tableId={selectedTable} onBack={() => setSelectedTable(null)} />
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


