import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type TableListProps = {
    tables: { id: number}[];
    onSelectTable: (id: number) => void;
};

const TableList: React.FC<TableListProps> = ({ tables, onSelectTable }) => {
    return (
        <FlatList
            data={tables}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.tableContainer}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[styles.tableItem, { backgroundColor: "#f0ad4e" }]}
                    onPress={() => onSelectTable(item.id)}
                >
                    <MaterialCommunityIcons name="table-furniture" size={50} color="white" />
                    <Text style={styles.tableText}>Bàn {item.id}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    tableItem: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    tableText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginTop: 5,
    },
});

export default TableList;
