import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { auth } from '../firebaseConfig';

type DadosEndereco = {
  nomeEndereco?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
};

const CHAVE_PERFIL = 'dadosPessoais';

export default function EnderecosScreen() {
  const [endereco, setEndereco] = useState<DadosEndereco | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarEndereco() {
        try {
          const uid = auth.currentUser?.uid;
          const chave = uid ? `${CHAVE_PERFIL}:${uid}` : CHAVE_PERFIL;
          const dados = await AsyncStorage.getItem(chave);
          const perfil: DadosEndereco = dados ? JSON.parse(dados) : {};

          if (ativo) {
            setEndereco(perfil.rua ? perfil : null);
          }
        } catch (erro) {
          console.error('Erro ao carregar endereços:', erro);
          if (ativo) {
            Alert.alert('Erro', 'Não foi possível carregar seus endereços.');
          }
        }
      }

      void carregarEndereco();
      return () => {
        ativo = false;
      };
    }, [])
  );

  function formatarLinhaFinal() {
    if (!endereco) {
      return '';
    }

    const cidadeEstado = [endereco.cidade, endereco.estado]
      .filter(Boolean)
      .join(' - ');
    return [cidadeEstado, endereco.cep].filter(Boolean).join(', ');
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conteudo}
        >
          <View style={styles.cabecalho}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/telaperfil');
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back-outline" size={21} color="#111111" />
            </TouchableOpacity>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.ano}>EST. 1972</Text>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => router.push('/menu')}
              accessibilityRole="button"
              accessibilityLabel="Abrir menu"
            >
              <Ionicons name="menu-outline" size={27} color="#111111" />
            </TouchableOpacity>
          </View>

          <Text style={styles.titulo}>Meus endereços</Text>

          {endereco ? (
            <View style={styles.cartao}>
              <View style={styles.linhaCartao}>
                <Text style={styles.nomeEndereco}>
                  {endereco.nomeEndereco || 'Casa'}
                </Text>
                <TouchableOpacity onPress={() => router.push('/dadospessoais')}>
                  <Text style={styles.editar}>Editar</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.enderecoTexto}>
                {endereco.rua} {endereco.numero}
              </Text>
              {endereco.complemento ? (
                <Text style={styles.enderecoTexto}>{endereco.complemento}</Text>
              ) : null}
              <Text style={styles.enderecoTexto}>{endereco.bairro}</Text>
              <Text style={styles.enderecoTexto}>{formatarLinhaFinal()}</Text>
            </View>
          ) : (
            <View style={styles.vazio}>
              <Text style={styles.vazioTexto}>Nenhum endereço cadastrado.</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cartaoAdicionar}
            onPress={() => router.push('/dadospessoais')}
            activeOpacity={0.75}
          >
            <Text style={styles.adicionarTexto}>Adicionar novo endereço</Text>
            <Ionicons name="add" size={29} color="#111111" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#FFFFFF' },
  conteudo: { flexGrow: 1, paddingHorizontal: 18, paddingBottom: 30 },
  cabecalho: { height: 141, borderBottomWidth: 1, borderBottomColor: '#BBBBBB', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  botaoVoltar: { position: 'absolute', left: 0, bottom: 14, padding: 5 },
  menu: { position: 'absolute', right: 0, top: 48, padding: 4 },
  logo: { fontSize: 29, fontWeight: '300', letterSpacing: 6, color: '#080808', marginTop: 5 },
  ano: { fontSize: 11, color: '#111111', marginTop: 5 },
  titulo: { fontSize: 18, fontWeight: '700', color: '#111111', marginTop: 55, marginBottom: 32, marginLeft: 4 },
  cartao: { borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 3, padding: 19, marginBottom: 34 },
  linhaCartao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  nomeEndereco: { fontSize: 16, fontWeight: '700', color: '#111111' },
  editar: { fontSize: 14, color: '#111111' },
  enderecoTexto: { fontSize: 15, lineHeight: 25, color: '#222222' },
  vazio: { paddingVertical: 18, alignItems: 'center' },
  vazioTexto: { color: '#777777', fontSize: 14 },
  cartaoAdicionar: { minHeight: 103, borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 3, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  adicionarTexto: { fontSize: 16, fontWeight: '700', color: '#111111' },
});
