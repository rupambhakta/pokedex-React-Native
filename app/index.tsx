import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

// "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: String;
  };
}
export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=50"
      );
      const data = await response.json();

      // Fetch detailed info for each Pokemon in parallel
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemons: any) => {
          const res = await fetch(pokemons.url);
          const details = await res.json();
          return {
            name: pokemons.name,
            image: details.sprites.front_default, // main sprite
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemons);
      console.log(detailedPokemons);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text style={style.name}>{pokemon.name}</Text>
          <Text>{pokemon.types[0].type.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: pokemon.image }}
              style={{ width: 150, height: 150 }}
            />
            <Image
              source={{ uri: pokemon.imageBack }}
              style={{ width: 150, height: 150 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
