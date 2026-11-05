
import React from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

export default function Categoria() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => router.push('/menu')}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu"
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>

          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.subtitle}>EST. 1972</Text>
        </View>

        {/* Título da seção */}
        <TouchableOpacity style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>CATEGORIA</Text>
          <Text style={styles.searchIcon}>⌕</Text>
        </TouchableOpacity>

        {/* Categorias */}
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryCard}>
            <Image
              source={require('../../assets/Img/Feminino.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>FEMININO</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Image
              source={require('../../assets/Img/Masculino.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>MASCULINO</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Image
              source={require('../../assets/Img/Calçados.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>CALÇADOS</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Image
              source={require('../../assets/Img/Acessórios.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardLabelContainer}>
              <Text style={styles.cardLabel}>ACESSÓRIOS</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bellahope */}
        <TouchableOpacity style={styles.bellahopeCard}>
          <Image
            source={require('../../assets/Img/BellahopeCapa.png')}
            style={styles.bellahopeImage}
            resizeMode="cover"
          />

          <View style={styles.bellahopeLabelContainer}>
            <Text style={styles.bellahopeLabel}>B E L L A H O P E</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 91,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  logo: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 5,
    color: '#222222',
    marginTop: 7,
  },

  subtitle: {
    fontSize: 11,
    color: '#222222',
    marginTop: 5,
  },

  menu: {
    position: 'absolute',
    right: 10,
    top: 25,
    width: 14,
    gap: 5,
  },

  menuLine: {
    height: 1,
    width: 14,
    backgroundColor: '#333333',
  },

  categoryHeader: {
    height: 36,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  categoryTitle: {
    fontSize: 10,
    color: '#999999',
    letterSpacing: 0.5,
  },

  searchIcon: {
    position: 'absolute',
    right: 10,
    fontSize: 22,
    color: '#222222',
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginTop: 14,
    rowGap: 26,
  },

  categoryCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },

  image: {
    width: '100%',
    height: 153,
    filter: 'grayscale(100%)',
  },

  cardLabelContainer: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  cardLabel: {
    fontSize: 10,
    color: '#111111',
  },

  bellahopeCard: {
    marginHorizontal: 32,
    marginTop: 26,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },

  bellahopeImage: {
    width: '100%',
    height: 126,
    filter: 'grayscale(100%)',
  },

  bellahopeLabelContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bellahopeLabel: {
    textAlign: 'center',
    fontSize: 11,
    color: '#222222',
  },

  bottomSpace: {
    height: 20,
  },
});
