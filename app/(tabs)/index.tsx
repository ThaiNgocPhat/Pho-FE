import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';
import { LeftMenu } from '@/view/LeftMenu';
import { RightContent } from '@/view/RightContent';
import { useWindowDimensions } from 'react-native';
import HistoryView from '@/view/History/HistoryView';

const App = () => {
  const [showTable, setShowTable] = useState(false);
  const [showTakeAway, setShowTakeAway] = useState(false);
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 768; 

  if (isTablet) {
    // On tablet (iPad), only show HistoryView
    return (
      <SafeAreaProvider>
        <View style={styles.header}>
          <Text style={styles.greeting}>Phở hai Triều</Text>
        </View>
        <HistoryView isActive={true} />
      </SafeAreaProvider>
    );
  }

  // On mobile, show the full menu
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
            setShowCart={setShowCart}
            setShowHistory={setShowHistory}
          />
        </View>
        <View style={styles.rightContent}>
          <RightContent
            showTable={showTable} 
            selectedTable={selectedTable} 
            setSelectedTable={setSelectedTable} 
            showTakeAway={showTakeAway}
            showCart={showCart}
            showHistory={showHistory}
            groupId={0}
            onBack={() => {}}
            fetchData={() => {}}
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
    overflow: 'hidden',
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
    zIndex: 10,
    elevation: 10, 
    position: 'relative',
  },
  rightContent: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  }
});

export default App;
