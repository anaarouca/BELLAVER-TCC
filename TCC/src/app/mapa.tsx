import React, { useMemo, useRef, useState } from 'react';
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
import MapView, { Callout, Marker, type Region } from 'react-native-maps';

const ongs = [
  {
    nome: 'UNICEF',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    coordenadas: { latitude: -23.6351, longitude: -46.6954 },
  },
  {
    nome: 'Instituto Amor em Mechas',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    coordenadas: { latitude: -23.6278, longitude: -46.6912 },
  },
  {
    nome: 'ONG Ampara Animal',
    endereco: 'Av. Professor Vicente Rao, 115 - Brooklin, São Paulo - SP, 04602-000',
    coordenadas: { latitude: -23.6165, longitude: -46.6788 },
  },
];

export default function MapaScreen() {
  const [busca, setBusca] = useState('');
  const mapaRef = useRef<MapView>(null);
  const ongsFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return ongs;
    }

    return ongs.filter(
      (ong) =>
        ong.nome.toLowerCase().includes(termo) ||
        ong.endereco.toLowerCase().includes(termo)
    );
  }, [busca]);

  function focarNaOng(ong: (typeof ongs)[number]) {
    const regiao: Region = {
      ...ong.coordenadas,
      latitudeDelta: 0.035,
      longitudeDelta: 0.035,
    };
    mapaRef.current?.animateToRegion(regiao, 500);
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
            <Pressable
              style={styles.botaoVoltar}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar para Bellahope"
            >
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
              placeholder="Digite o seu endereço..."
              placeholderTextColor="#999999"
              accessibilityLabel="Buscar ONG por endereço"
            />
          </View>

          <MapView
            ref={mapaRef}
            style={styles.mapa}
            initialRegion={{
              latitude: -23.628,
              longitude: -46.691,
              latitudeDelta: 0.06,
              longitudeDelta: 0.06,
            }}
            showsCompass
            showsScale
            showsBuildings
            showsTraffic={false}
            accessibilityLabel="Mapa das ONGs próximas"
          >
            {ongsFiltradas.map((ong) => (
              <Marker
                key={ong.nome}
                coordinate={ong.coordenadas}
                title={ong.nome}
                description={ong.endereco}
                pinColor="#111111"
              >
                <Callout>
                  <Text style={styles.calloutTitulo}>{ong.nome}</Text>
                  <Text style={styles.calloutTexto}>{ong.endereco}</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>

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
                    onPress={() => focarNaOng(ong)}
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
  brand: {
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDBDBD',
    position: 'relative',
  },
  botaoVoltar: {
    position: 'absolute',
    left: 0,
    top: 25,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: { color: '#222222', fontSize: 20, fontWeight: '300', letterSpacing: 5 },
  titulo: { color: '#111111', fontSize: 18, fontWeight: '500', marginTop: 28, marginBottom: 10 },
  busca: {
    height: 51,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: { flex: 1, marginLeft: 12, color: '#111111', fontSize: 14 },
  mapa: {
    height: 344,
    marginTop: 19,
    overflow: 'hidden',
    backgroundColor: '#242424',
    position: 'relative',
  },
  estrada: { position: 'absolute', backgroundColor: '#777777', opacity: 0.75 },
  estradaDiagonal: { width: '145%', height: 16, top: '48%', left: '-20%', transform: [{ rotate: '-22deg' }] },
  estradaHorizontal: { width: '110%', height: 9, top: '30%', left: '-5%', transform: [{ rotate: '8deg' }] },
  estradaVertical: { width: 10, height: '120%', top: '-10%', left: '57%', transform: [{ rotate: '18deg' }] },
  estradaCurva: { width: '100%', height: 8, top: '72%', left: '4%', transform: [{ rotate: '-7deg' }] },
  nomeMapa: { position: 'absolute', color: '#D5D5D5', fontSize: 9, letterSpacing: 0.4 },
  marcador: { position: 'absolute', transform: [{ translateX: -12 }, { translateY: -24 }] },
  controlesMapa: { position: 'absolute', right: 8, bottom: 10, backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden' },
  controle: { width: 39, height: 39, textAlign: 'center', textAlignVertical: 'center', color: '#111111', fontSize: 25, borderBottomWidth: 1, borderBottomColor: '#DDDDDD' },
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
