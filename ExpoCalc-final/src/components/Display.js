import { View, Text, StyleSheet } from 'react-native';

export default function Display({ expressao, resultado, memoria }) {
  return (
    <View style={styles.painel}>
      <Text style={styles.memoria}>{memoria !== 0 ? 'M' : ' '}</Text>
      <Text style={styles.expressao}>{expressao || '0'}</Text>
      <Text style={styles.resultado}>{resultado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  painel: {
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: 'black',
    padding: 8,
    marginBottom: 6,
  },
  memoria: { fontSize: 14, fontWeight: 'bold', color: '#4a0303' },
  expressao: { fontSize: 30, fontWeight: 'bold' },
  resultado: { fontSize: 20, color: '#444444', minHeight: 24 },
});
