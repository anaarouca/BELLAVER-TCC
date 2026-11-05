
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   ImageSourcePropType,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';

// type Produto = {
//   id: string;
//   nome: string;
//   marca: string;
//   preco: string;
//   precoAntigo: string;
//   imagem: ImageSourcePropType;
// };

// const produtosIniciais: Produto[] = [
//   {
//     id: '1',
//     nome: 'Conjunto Alfaiataria Off-White',
//     marca: 'Bellaver',
//     preco: 'R$ 697,00',
//     precoAntigo: 'R$ 899,00',
//     imagem: require('../../assets/Img/ConjuntoAlfaiatariaOff.png'),
//   },
//   {
//     id: '2',
//     nome: 'Colete Alfaiataria Risca de Giz Hudson',
//     marca: 'Bellaver',
//     preco: 'R$ 297,00',
//     precoAntigo: 'R$ 389,00',
//     imagem: require('../../assets/Img/ColeteAlfaiatariaRisca.png'),
//   },
//   {
//     id: '3',
//     nome: 'Tailleur Cinza & Rose Quartz | Ana Paula Renault',
//     marca: 'Bellaver',
//     preco: 'R$ 597,00',
//     precoAntigo: 'R$ 789,00',
//     imagem: require('../../assets/Img/TailleurCinza&Rose.png'),
//   },
//   {
//     id: '4',
//     nome: 'Set Denim Grand Icon Azul Gisele Edition',
//     marca: 'Bellaver',
//     preco: 'R$ 1.197,00',
//     precoAntigo: 'R$ 1.498,00',
//     imagem: require('../../assets/Img/SetDenimGrand.png'),
//   },
// ];

// export default function FavoritosScreen() {
//   const [produtos, setProdutos] =
//     useState<Produto[]>(produtosIniciais);

//   const [itensSacola, setItensSacola] = useState(2);
//   const [editando, setEditando] = useState(false);

//   function removerFavorito(id: string) {
//     setProdutos((lista) =>
//       lista.filter((produto) => produto.id !== id)
//     );
//   }

//   function adicionarSacola(produto: Produto) {
//     setItensSacola((quantidade) => quantidade + 1);

//     Alert.alert(
//       'Produto adicionado',
//       `${produto.nome} foi adicionado à sua sacola.`
//     );
//   }

//   return (
//     <SafeAreaView style={styles.tela}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#FFFFFF"
//       />

//       <View style={styles.aplicativo}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.conteudo}
//         >
//           {/* CABEÇALHO */}

//           <View style={styles.cabecalho}>
//             <TouchableOpacity
//               style={styles.menu}
//               onPress={() =>
//                 Alert.alert('Bellaver', 'Menu do aplicativo')
//               }
//             >
//               <Ionicons
//                 name="menu-outline"
//                 size={25}
//                 color="#111111"
//               />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.logo}
//               onPress={() => router.replace('/home')}
//             >
//               <Text style={styles.nomeLogo}>BELLAVER</Text>
//               <Text style={styles.anoLogo}>EST. 1972</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.divisoria} />

//           {/* ABAS */}

//           <View style={styles.abas}>
//             <TouchableOpacity
//               style={styles.aba}
//               onPress={() => router.push('/sacola')}
//             >
//               <Text style={styles.textoAba}>
//                 SACOLA ({itensSacola})
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.aba, styles.abaAtiva]}
//               activeOpacity={0.8}
//             >
//               <Text
//                 style={[styles.textoAba, styles.textoAbaAtivo]}
//               >
//                 FAVORITOS (2)
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* TÍTULO */}

//           <View style={styles.cabecalhoFavoritos}>
//             <View style={styles.titulos}>
//               <Text style={styles.titulo}>
//                 Meus Favoritos
//               </Text>

//               <Text style={styles.subtitulo}>
//                 Você salvou {produtos.length} itens
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={styles.botaoEditar}
//               onPress={() => setEditando(!editando)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.textoEditar}>
//                 {editando ? 'Concluir' : 'Editar'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* PRODUTOS FAVORITOS */}

//           <View style={styles.grade}>
//             {produtos.map((produto) => (
//               <View
//                 key={produto.id}
//                 style={styles.cardProduto}
//               >
//                 <View style={styles.containerImagem}>
//                   <Image
//                     source={produto.imagem}
//                     style={styles.imagemProduto}
//                     resizeMode="cover"
//                   />
//                 </View>

//                 <View style={styles.linhaNome}>
//                   <Text
//                     style={styles.nomeProduto}
//                     numberOfLines={2}
//                   >
//                     {produto.nome}
//                   </Text>

//                   <TouchableOpacity
//                     style={styles.botaoCoracao}
//                     onPress={() => {
//                       if (editando) {
//                         removerFavorito(produto.id);
//                       } else {
//                         Alert.alert(
//                           'Favoritos',
//                           'Toque em Editar para remover produtos.'
//                         );
//                       }
//                     }}
//                   >
//                     <Ionicons
//                       name="heart"
//                       size={15}
//                       color="#000000"
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 <Text style={styles.precoAntigo}>
//                   {produto.precoAntigo}
//                 </Text>

//                 <Text style={styles.preco}>
//                   {produto.preco}
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.botaoSacola}
//                   onPress={() => adicionarSacola(produto)}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.textoBotaoSacola}>
//                     Adicionar ao carrinho
//                   </Text>
//                 </TouchableOpacity>

//                 {editando && (
//                   <TouchableOpacity
//                     style={styles.botaoRemover}
//                     onPress={() => removerFavorito(produto.id)}
//                   >
//                     <Text style={styles.textoRemover}>
//                       Remover dos favoritos
//                     </Text>
//                   </TouchableOpacity>
//                 )}

//                 {!editando && (
//                   <TouchableOpacity
//                     style={styles.botaoRemover}
//                     onPress={() => removerFavorito(produto.id)}
//                   >
//                     <Text style={styles.textoRemover}>
//                       Remover dos favoritos
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ))}
//           </View>

//           {/* FAIXA INFERIOR */}

//           <View style={styles.banner}>
//             <Ionicons
//               name="heart-outline"
//               size={34}
//               color="#000000"
//             />

//             <View style={styles.textosBanner}>
//               <Text style={styles.tituloBanner}>
//                 Ainda não encontrou tudo?
//               </Text>

//               <Text style={styles.subtituloBanner}>
//                 Tem muita coisa nova te esperando.
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={styles.botaoExplorar}
//               onPress={() => router.push('/explore')}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.textoExplorar}>
//                 Explorar produtos
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.espacoFinal} />
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   tela: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },

//   aplicativo: {
//     flex: 1,
//     width: '100%',
//     maxWidth: 480,
//     alignSelf: 'center',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#222222',
//   },

//   conteudo: {
//     paddingHorizontal: 15,
//     paddingBottom: 20,
//   },

//   cabecalho: {
//     height: 113,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   logo: {
//     alignItems: 'center',
//     marginTop: 7,
//   },

//   nomeLogo: {
//     fontSize: 29,
//     fontWeight: '300',
//     letterSpacing: 6,
//     color: '#080808',
//   },

//   anoLogo: {
//     fontSize: 11,
//     marginTop: 6,
//     color: '#111111',
//   },

//   menu: {
//     position: 'absolute',
//     right: 2,
//     top: 27,
//     width: 28,
//     height: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   divisoria: {
//     height: 1,
//     backgroundColor: '#AAAAAA',
//     marginBottom: 30,
//   },

//   abas: {
//     height: 32,
//     flexDirection: 'row',
//     marginHorizontal: 3,
//     borderWidth: 1,
//     borderColor: '#EEEEEE',
//   },

//   aba: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },

//   abaAtiva: {
//     borderBottomColor: '#777777',
//   },

//   textoAba: {
//     fontSize: 9,
//     color: '#E4E4E4',
//     fontWeight: '500',
//   },

//   textoAbaAtivo: {
//     color: '#111111',
//     fontWeight: '700',
//   },

//   cabecalhoFavoritos: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 25,
//     marginBottom: 28,
//   },

//   titulos: {
//     flex: 1,
//   },

//   titulo: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#080808',
//   },

//   subtitulo: {
//     fontSize: 10,
//     color: '#111111',
//     marginTop: 3,
//   },

//   botaoEditar: {
//     width: 71,
//     height: 23,
//     backgroundColor: '#000000',
//     borderRadius: 2,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 8,
//   },

//   textoEditar: {
//     fontSize: 11,
//     color: '#FFFFFF',
//   },

//   grade: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 21,
//   },

//   cardProduto: {
//     width: '44%',
//     marginBottom: 34,
//   },

//   containerImagem: {
//     width: '100%',
//     height: 138,
//     backgroundColor: '#F1F1F1',
//   },

//   imagemProduto: {
//     width: '100%',
//     height: '100%',
//   },

//   linhaNome: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     marginTop: 5,
//     minHeight: 29,
//   },

//   nomeProduto: {
//     flex: 1,
//     fontSize: 10,
//     lineHeight: 12,
//     color: '#111111',
//   },

//   botaoCoracao: {
//     marginLeft: 3,
//     paddingLeft: 2,
//     paddingTop: 1,
//   },

//   precoAntigo: {
//     fontSize: 7,
//     color: '#AAAAAA',
//     textDecorationLine: 'line-through',
//     marginTop: 0,
//   },

//   preco: {
//     fontSize: 9,
//     color: '#111111',
//     marginTop: 1,
//   },

//   botaoSacola: {
//     height: 19,
//     backgroundColor: '#000000',
//     borderRadius: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 5,
//     marginHorizontal: 3,
//   },

//   textoBotaoSacola: {
//     fontSize: 9,
//     color: '#FFFFFF',
//   },

//   botaoRemover: {
//     alignSelf: 'center',
//     paddingTop: 5,
//     paddingBottom: 1,
//   },

//   textoRemover: {
//     fontSize: 8,
//     color: '#222222',
//     textDecorationLine: 'underline',
//   },

//   banner: {
//     minHeight: 47,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F2F2F2',
//     borderRadius: 3,
//     paddingHorizontal: 13,
//     paddingVertical: 7,
//     marginHorizontal: 10,
//     marginTop: 3,
//   },

//   textosBanner: {
//     flex: 1,
//     marginLeft: 10,
//   },

//   tituloBanner: {
//     fontSize: 11,
//     color: '#555555',
//   },

//   subtituloBanner: {
//     fontSize: 9,
//     color: '#111111',
//     marginTop: 2,
//   },

//   botaoExplorar: {
//     backgroundColor: '#DEDEDE',
//     borderRadius: 3,
//     paddingHorizontal: 8,
//     paddingVertical: 7,
//     marginLeft: 5,
//   },

//   textoExplorar: {
//     fontSize: 8,
//     color: '#111111',
//     fontWeight: '600',
//   },

//   espacoFinal: {
//     height: 20,
//   },
// });
