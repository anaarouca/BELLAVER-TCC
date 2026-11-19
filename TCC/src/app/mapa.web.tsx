import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ongs = [
  {
    nome: 'UNICEF',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    busca: 'UNICEF, São Paulo, SP',
  },
  {
    nome: 'Instituto Amor em Mechas',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    busca: 'Instituto Amor em Mechas, São Paulo, SP',
  },
  {
    nome: 'ONG Ampara Animal',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    busca: 'ONG Ampara Animal, São Paulo, SP',
  },
];

export default function MapaWebScreen() {
  const [busca, setBusca] = useState('');
  const [localBusca, setLocalBusca] = useState('São Paulo, SP');
  const ongsFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return termo
      ? ongs.filter(
          (ong) =>
            ong.nome.toLowerCase().includes(termo) ||
            ong.endereco.toLowerCase().includes(termo)
        )
      : ongs;
  }, [busca]);

  const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    localBusca
  )}&output=embed`;

  function verNoMapa(termo: string) {
    setLocalBusca(termo);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
              <Feather name="arrow-left" size={22} color="#111111" />
            </Pressable>
            <Text style={styles.brandName}>BELLAHOPE</Text>
          </View>

          <Text style={styles.titulo}>ENCONTRE ONGs PERTO DE VOCÊ</Text>

          <View style={styles.busca}>
            <Ionicons name="search-outline" size={20} color="#111111" />
            <TextInput
              style={styles.input}
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={() => setLocalBusca(busca || 'São Paulo, SP')}
              placeholder="Digite o seu endereço..."
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.mapa}>
            {React.createElement('iframe', {
              title: 'Mapa real das ONGs próximas',
              src: mapaUrl,
              style: styles.iframe,
              loading: 'lazy',
              allowFullScreen: true,
              referrerPolicy: 'no-referrer-when-downgrade',
            })}
          </View>

          <View style={styles.lista}>
            {ongsFiltradas.length > 0 ? (
              ongsFiltradas.map((ong) => (
                <View key={ong.nome} style={styles.ong}>
                  <View style={styles.ongTexto}>
                    <Text style={styles.ongNome}>{ong.nome}</Text>
                    <Text style={styles.ongEndereco}>{ong.endereco}</Text>
                  </View>
                  <Pressable
                    style={styles.botaoMapa}
                    onPress={() => verNoMapa(ong.busca)}
                  >
                    <Text style={styles.textoBotaoMapa}>VER NO MAPA</Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.vazio}>Nenhuma ONG encontrada.</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomNavigation}>
          <Pressable style={styles.navItem} onPress={() => router.replace('/homeBellahope')}>
            <Ionicons name="home-outline" size={19} color="#111111" />
            <Text style={styles.navLabel}>INÍCIO</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/produtosBellahope')}>
            <Ionicons name="bag-outline" size={19} color="#777777" />
            <Text style={styles.navLabel}>LOJA</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/doar')}>
            <Ionicons name="heart-outline" size={20} color="#777777" />
            <Text style={styles.navLabel}>DOAR</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/favoritos')}>
            <Ionicons name="bookmark-outline" size={19} color="#777777" />
            <Text style={styles.navLabel}>FAVORITOS</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/telaperfil')}>
            <Ionicons name="person-outline" size={19} color="#777777" />
            <Text style={styles.navLabel}>PERFIL</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 17, paddingBottom: 24 },
  brand: { height: 85, alignItems: 'center', justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#BDBDBD', position: 'relative' },
  botaoVoltar: { position: 'absolute', left: 0, top: 25, width: 35, height: 35, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#222222', fontSize: 20, fontWeight: '300', letterSpacing: 5 },
  titulo: { color: '#111111', fontSize: 18, fontWeight: '500', marginTop: 28, marginBottom: 10 },
  busca: { height: 51, borderWidth: 1, borderColor: '#AAAAAA', borderRadius: 5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, marginLeft: 12, color: '#111111', fontSize: 14 },
  mapa: { height: 344, marginTop: 19, overflow: 'hidden', backgroundColor: '#E8E8E8' },
  iframe: { width: '100%', height: '100%', border: 0 },
  lista: { marginTop: 20, borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 3 },
  ong: { minHeight: 89, paddingHorizontal: 13, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDDDDD' },
  ongTexto: { flex: 1, paddingRight: 8 },
  ongNome: { color: '#111111', fontSize: 16, fontWeight: '700' },
  ongEndereco: { color: '#777777', fontSize: 11, lineHeight: 14, marginTop: 4 },
  botaoMapa: { backgroundColor: '#050505', paddingHorizontal: 10, paddingVertical: 10 },
  textoBotaoMapa: { color: '#FFFFFF', fontSize: 11 },
  vazio: { padding: 22, color: '#777777', textAlign: 'center' },
  bottomNavigation: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DDDDDD', backgroundColor: '#FFFFFF' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navLabel: { color: '#777777', fontSize: 8, letterSpacing: 0.3 },
});
