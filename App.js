import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [texto, setTexto] = useState('');
  const [traducciones, setTraducciones] = useState({});
  const idiomas = ['de', 'it', 'en', 'pt', 'fr', 'he'];

  const traducirTexto = async () => {
    const promesas = idiomas.map(async (idioma) => {
      const respuesta = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: texto,
          langpair: `es|${idioma}`,
        },
      });
      return { [idioma]: respuesta.data.responseData.translatedText };
    });

    const resultados = await Promise.all(promesas);
    const traduccionesCombinadas = resultados.reduce((acumulador, actual) => ({ ...acumulador, ...actual }), {});
    setTraducciones(traduccionesCombinadas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Traductor de Español a 6 Idiomas</Text>
      <TextInput
        style={styles.input}
        value={texto}
        onChangeText={setTexto}
        placeholder="Escribe tu frase larga aquí"
        multiline
      />
      <Button title="Traducir" onPress={traducirTexto} />
      <Text style={styles.subtitle}>Traducciones:</Text>
      <FlatList
        data={Object.entries(traducciones)}
        keyExtractor={([idioma]) => idioma}
        renderItem={({ item: [idioma, textoTraducido] }) => (
          <Text>
            {idioma === 'de' && 'Alemán'}
            {idioma === 'it' && 'Italiano'}
            {idioma === 'en' && 'Inglés'}
            {idioma === 'pt' && 'Portugués'}
            {idioma === 'fr' && 'Francés'}
            {idioma === 'he' && 'Hebreo'}: {textoTraducido}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
    color: '#333',
    fontSize: 18,
  },
});

export default App;
