# Explicações das evoluções: ExpoCalc

Vinicius carrijo e Moisés Kennedy · Fatec ADS · Desenvolvimento de dispositivos móveis

Arquivos que alterei: `src/storage/historico.js`, `src/screens/HistoricoScreen.js` e `src/screens/HomeScreen.js`. O resto do projeto ficou como estava.

---

## Evolução 1: Limpar histórico

**`src/storage/historico.js`**
- `export async function limpar()` chama `AsyncStorage.removeItem(CHAVE)`, que apaga do celular a lista salva com a chave `'historico'`. É `async` porque mexer no armazenamento leva tempo, e o `await` espera terminar.

**`src/screens/HistoricoScreen.js`**
- `const [lista, setLista] = useState(route.params.historico)`: antes a tela só lia a lista que veio por parâmetro, que não muda. Ao guardar a lista num **estado**, a tela passa a poder mudar e é redesenhada quando eu chamo `setLista`.
- `aoLimpar`: `await limpar()` apaga do celular e `setLista([])` apaga da tela. Com a lista vazia, o `ListEmptyComponent` mostra "Nenhuma conta ainda".
- O botão "Limpar histórico" chama `aoLimpar` no `onPress`.

**`src/screens/HomeScreen.js`**
- Troquei o `useEffect` que carregava o histórico só uma vez por um que usa `navigation.addListener('focus', recarregar)`. O `recarregar` lê o `AsyncStorage` de novo, e o `return` do listener cancela a escuta quando a tela é desmontada.

**Por que a Home precisa recarregar o histórico, e não só a tela de histórico?**
A Home guarda a sua própria cópia do histórico no estado (`historico`). Quando limpo na outra tela, o celular fica vazio, mas essa cópia continua com as contas antigas. Se eu fizesse uma conta nova, a Home somaria a nova às antigas (`[item, ...historico]`) e salvaria tudo, e as contas apagadas voltariam. Recarregando toda vez que a Home ganha foco, ela sempre trabalha com o que está realmente salvo.

---

## Evolução 2: Excluir uma conta específica

**`src/screens/HistoricoScreen.js`**
- No `renderItem`, a conta e o botão "Excluir" ficam numa `View` com `flexDirection: 'row'`: a conta do lado esquerdo (com `flex: 1`) e o botão do lado direito.
- `excluir(id)`: `lista.filter((item) => item.id !== id)` monta uma lista com todas as contas, menos a do `id` tocado. Cada item já tem um `id` único, criado com `Date.now()`.
- `setLista(nova)` atualiza a tela e `await salvar(nova)` grava no celular, então a conta excluída não volta ao reabrir o app.

**Por que `filter`, que cria uma lista nova, em vez de remover o item da lista que já está no estado?**
O React decide se redesenha comparando o estado antigo com o novo. Se eu mexo na mesma lista (`splice`, por exemplo), a referência continua a mesma, e o React pode achar que nada mudou e não atualizar a tela. O `filter` devolve um array novo, e o React percebe a diferença. Isso é a **imutabilidade do estado**: nunca altero o estado direto, sempre crio um valor novo e passo para o `setLista`.

---

## Evolução 3: Reutilizar uma conta do histórico

**`src/screens/HistoricoScreen.js`**
- Recebo `navigation` junto com `route` e envolvo o texto da conta com `TouchableOpacity`, que deixa a linha tocável.
- `navigation.popTo('Home', { valor: item.resultado, chave: Date.now() })`: volta para a Home que já existe e leva o resultado como parâmetro. Com `navigate`, o React Navigation 7 empilharia uma segunda Home.

**`src/screens/HomeScreen.js`**
- Recebo `route` junto com `navigation`.
- Um `useEffect` lê `route.params?.valor` e, se houver valor, faz `setExpressao(valor)`, `setResultado('')` e `setCalculado(false)`. O display mostra o resultado e eu posso continuar a conta, por exemplo digitando `X2` e `=`.

**Desafio extra: tocar na mesma conta duas vezes, mudando o display entre os toques**
Se o `useEffect` observasse só o `valor`, o segundo toque levaria o mesmo valor, a lista de dependências não mudaria e o efeito **não rodaria**, então o display não voltaria. Por isso mando também a `chave` com `Date.now()`, que é diferente a cada toque, e o `useEffect` observa `route.params?.chave`.

---

## Como testei

1. `2+3=`, abro o histórico e toco na linha: o display mostra 5, e `X2=` continua a partir dele.
2. Excluo uma conta, fecho e reabro o app: ela não volta.
3. Limpo o histórico: aparece "Nenhuma conta ainda". Volto, faço uma conta nova e abro o histórico: só a conta nova aparece.
