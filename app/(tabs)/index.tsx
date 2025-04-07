import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';
import { LeftMenu } from '@/view/LeftMenu';
import { RightContent } from '@/view/RightContent';

const App = () => {
  const [showTable, setShowTable] = useState(false);
  const [showTakeAway, setShowTakeAway] = useState(false);
  const [showHotPot, setShowHotPot] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showHistoryHotPot, setShowHistoryHotPot] = useState(false)
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <Text style={styles.greeting}>Phở hai Triều</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.leftMenu}>
          <LeftMenu 
            setShowTable={setShowTable}
            setShowTakeAway={setShowTakeAway}  
            setShowHotPot={setShowHotPot}
            setShowCart={setShowCart}
            setShowHistory={setShowHistory}
            setShowHistoryHotPot={setShowHistoryHotPot}
          />
        </View>
        <View style={styles.rightContent}>
          <RightContent
            showTable={showTable} 
            selectedTable={selectedTable} 
            setSelectedTable={setSelectedTable} 
            showTakeAway={showTakeAway}
            showHotPot={showHotPot}
            showCart={showCart}
            showHistory={showHistory}
            showHistoryHotPot={showHistoryHotPot}

          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

// Tạo styles cho ứng dụng
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 20,
  },
  leftMenu: {
    width: 120,
    backgroundColor: "#fff",
  },
  rightContent: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  }
});

export default App;
