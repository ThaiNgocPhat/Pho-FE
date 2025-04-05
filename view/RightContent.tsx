import CartView from '@/view/CartView/CartView';
import HistoryView from '@/view/History/HistoryView';
import { HotpotView } from '@/view/HotPot/HotPotView';
import { OrderMenu } from '@/components/OrderMenu';
import TableDetails from '@/components/TableDetails';

import TableList from '@/components/TableList';
import { TakeAwayView } from '@/view/TakeAway/TakeAwayView';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HotPotHistory from '@/view/HopotHistory/HotPotHistory';

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
  const tables = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));

  return (
    <View style={styles.rightPanel}>
      {showOrderMenu ? (
        <OrderMenu isTakeaway={false} onBack={() => setShowOrderMenu(false)}/>
      ) : selectedTable !== null ? (
        <TableDetails
          tableId={selectedTable}
          onBack={() => setSelectedTable(null)}
          onOrderPress={() => setShowOrderMenu(true)}
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


