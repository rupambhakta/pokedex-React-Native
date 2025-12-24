import { Text } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function Index() {
  const params = useLocalSearchParams();
  console.log(params);

  return (
    <>
      <Stack.Screen
        options={{
          title: Array.isArray(params.name) ? params.name[0] : params.name,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          gap: 20,
          padding: 20,
        }}
      >
        <Text>{params.name}</Text>
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({});
