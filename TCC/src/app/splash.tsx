import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';

const telas = [
  {
    imagem: require('../../assets/Img/ABERTURA 1.png'),
    titulo: 'BELLAVER',
    subtitulo: 'MODA • ELEGÂNCIA • ESTILO',
    mensagem: 'Descubra uma nova forma de expressar quem você é.',
  },
  {
    imagem: require('../../assets/Img/ABERTURA 2.png'),
    titulo: 'SEU ESTILO',
    subtitulo: 'ELEGÂNCIA EM CADA DETALHE',
    mensagem: 'Peças que valorizam sua personalidade e autenticidade.',
  },
  {
    imagem: require('../../assets/Img/ABERTURA 3.png'),
    titulo: 'NOVA COLEÇÃO',
    subtitulo: 'FEITA PARA VOCÊ',
    mensagem: 'Encontre combinações que traduzem sua essência.',
  },
  {
    imagem: require('../../assets/Img/ABERTURA 4.png'),
    titulo: 'BEM-VINDA',
    subtitulo: 'SEU PRÓXIMO LOOK COMEÇA AQUI',
    mensagem: 'Explore a Bellaver e encontre suas próximas peças favoritas.',
  },
];

export default function SplashScreen() {
  const [telaAtual, setTelaAtual] = useState(0);


  useEffect(() => {
    setTelaAtual(0);

    const intervalo = setInterval(() => {
      setTelaAtual((atual) => {
        if (atual >= telas.length - 1) {
          clearInterval(intervalo);
          router.replace('/login');
          return atual;
        }

        return atual + 1;
      });
    }, 4000);

    return () => clearInterval(intervalo);
  }, []);



  const tela = telas[telaAtual];

  return (
    <ImageBackground
      source={tela.imagem}
      style={styles.container}
      resizeMode="stretch"
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.sobreposicao}>
        <View style={styles.barrinhas}>
          {telas.map((item, index) => (
            <View key={item.titulo} style={styles.trilho}>
              <View
                style={[
                  styles.progresso,
                  index <= telaAtual && styles.progressoAtivo,
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sobreposicao: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 22,
    paddingTop: 0,
    paddingBottom: 30,
    justifyContent: 'flex-end',
  },

  barrinhas: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },

  imagemFundo: {
    transform: [{ translateY: 60 }],
  },

  trilho: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
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

  numero: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'right',
    marginTop: 18,
  },

  conteudo: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  linha: {
    width: 45,
    height: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 25,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: 'bold',
    letterSpacing: 6,
    textAlign: 'center',
  },

  subtitulo: {
    color: '#FFFFFF',
    fontSize: 9,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 14,
  },

  divisor: {
    width: 35,
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 22,
  },

  mensagem: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 290,
  },

  linhaInferior: {
    width: 45,
    height: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 25,
  },

  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rodapeTexto: {
    color: '#FFFFFF',
    fontSize: 9,
    letterSpacing: 2,
  },
});
