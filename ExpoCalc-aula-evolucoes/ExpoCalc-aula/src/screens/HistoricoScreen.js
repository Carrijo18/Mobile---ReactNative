import { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { salvar, limpar } from '../storage/historico';

export default function HistoricoScreen({ route, navigation }) {
  // Evolução 1: a lista recebida por parâmetro vira estado, para a tela poder mudar
  const [lista, setLista] = useState(route.params.historico);

  // Evolução 1: apaga do celular (AsyncStorage) e da tela (estado)
  async function aoLimpar() {
    await limpar();
    setLista([]);
  }

  // Evolução 2: remove só a conta escolhida.
  // filter devolve uma lista NOVA, então o React percebe a mudança e redesenha.
  async function excluir(id) {
    const nova = lista.filter((item) => item.id !== id);
    setLista(nova);
    await salvar(nova);
  }

  // Evolução 3: volta para a Home que já existe levando o resultado.
  // "chave" muda a cada toque, para a Home reagir mesmo se o valor for igual.
  function reutilizar(item) {
    navigation.popTo('Home', { valor: item.resultado, chave: Date.now() });
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.lista}
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity style={styles.conta} onPress={() => reutilizar(item)}>
              <Text style={styles.linha}>
                {item.conta} = {item.resultado}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => excluir(item.id)}>
              <Text style={styles.textoBotao}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.linha}>Nenhuma conta ainda</Text>}
      />

      <TouchableOpacity style={[styles.botao, styles.botaoLimpar]} onPress={aoLimpar}>
        <Text style={styles.textoBotao}>Limpar histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a0303' },
  lista: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
  conta: { flex: 1 },
  linha: { fontSize: 24, padding: 12, color: 'white' },
  botao: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  botaoLimpar: { margin: 16, alignItems: 'center', paddingVertical: 12 },
  textoBotao: { color: '#4a0303', fontWeight: 'bold' },
});
