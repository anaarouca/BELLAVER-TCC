
import { useCallback, useEffect, useState, useRef } from 'react';

import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Text,
  Pressable,
  Animated,
} from 'react-native';

import { router } from 'expo-router';

const telas = [
  require('../../assets/Img/ABERTURA 5.png'),
  require('../../assets/Img/ABERTURA 6.png'),
  require('../../assets/Img/ABERTURA 7.png'),
  require('../../assets/Img/ABERTURA 8.png'),
];

export default function SplashScreen() {
  const [telaAtual, setTelaAtual] = useState(0);

  const [opacidade] = useState(() => new Animated.Value(1));
  const transicionando = useRef(false);

  const trocarTela = useCallback(() => {
    if (transicionando.current) {
      return;
    }

    transicionando.current = true;

    Animated.timing(opacidade, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      if (telaAtual < telas.length - 1) {
        setTelaAtual(telaAtual + 1);

        Animated.timing(opacidade, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }).start(() => {
          transicionando.current = false;
        });
      } else {
        router.replace('/homeBellahope');
      }
    });
  }, [opacidade, telaAtual]);

  function pular() {
    if (transicionando.current) {
      return;
    }

    transicionando.current = true;

    Animated.timing(opacidade, {
      toValue: 0,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/homeBellahope');
    });
  }

  useEffect(() => {
    const intervalo = setTimeout(() => {
      trocarTela();
    }, 2500);

    return () => clearTimeout(intervalo);
  }, [telaAtual, trocarTela]);

  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        hidden={true}
      />

      <Animated.View
        style={[
          styles.imagemContainer,
          { opacity: opacidade },
        ]}
      >
        <Pressable
          style={styles.imagemToque}
          onPress={trocarTela}
        >
          <ImageBackground
            source={telas[telaAtual]}
            style={styles.imagem}
            resizeMode="stretch"
          />
        </Pressable>
      </Animated.View>

      {/* BARRINHAS DE PROGRESSO E BOTÃO PULAR */}

      <View style={styles.rodape}>

        <View style={styles.barrinhas}>
          {telas.map((item, index) => (
            <View key={index} style={styles.trilho}>
              <View
                style={[
                  styles.progresso,
                  index <= telaAtual && styles.progressoAtivo,
                ]}
              />
            </View>
          ))}
        </View>

        <Pressable
          onPress={pular}
          style={styles.botaoPular}
        >
          <Text style={styles.pular}>PULAR</Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  imagemContainer: {
    flex: 1,
  },

  imagemToque: {
    flex: 1,
  },

  imagem: {
    flex: 1,
  },

  rodape: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  barrinhas: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    marginRight: 15,
  },

  trilho: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progresso: {
    height: '100%',
    width: '0%',
    backgroundColor: '#FFFFFF',
  },

  progressoAtivo: {
    width: '100%',
  },

  botaoPular: {
    paddingVertical: 8,
  },

  pular: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },

});
