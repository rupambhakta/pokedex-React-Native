import { Link } from "expo-router";
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
    } catch (error) {
      console.log(error);
    }
  }

  const colorByType: { [key: string]: string } = {
    normal: "lightgray",
    grass: "green",
    fire: "orange",
    water: "blue",
    bug: "lightgreen",
    flying: "lightblue",
    poison: "purple",
    electric: "yellow",
    ground: "brown",
    fairy: "pink",
    fighting: "red",
    psychic: "magenta",
    rock: "darkgray",
    ghost: "indigo",
    ice: "cyan",
    dragon: "darkblue",
    dark: "black",
    steel: "silver",
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 8,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{ pathname: "/details" , params: { name: pokemon.name } }}
          style={{
            padding: 20,
            borderRadius: 20,
            opacity: 0.5,
            backgroundColor:
              colorByType[pokemon.types[0].type.name] || "lightgray",
          }}
        >
          <View>
            <Text style={style.name}>{pokemon.name}</Text>
            <Text style={style.type}>{pokemon.types[0].type.name}</Text>
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
        </Link>
      ))}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
