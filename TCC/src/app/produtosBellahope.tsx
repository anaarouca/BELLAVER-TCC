import { useState } from 'react';
import {
	Image,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFavoritos } from '../hooks/useFavoritos';

const produtos = [
	{
		id: 'bellahope-bolsa-saint-laurent',
		nome: 'Bolsa Saint Laurent Élégance',
		preco: 'R$ 4.990,00',
		imagem: require('../../assets/Img/bellahopeImg/BolsaSaintLaurent.png'),
	},
	{
		id: 'bellahope-sandalia-gisele-grand',
		nome: 'Sandália Gisele Grand Icon',
		preco: 'R$ 1.197,00',
		imagem: require('../../assets/Img/bellahopeImg/SandáliaGiseleGrand.png'),
	},
	{
		id: 'bellahope-casaco-saint-tropez',
		nome: 'Casaco Saint Tropez Heritage',
		preco: 'R$ 897,00',
		imagem: require('../../assets/Img/bellahopeImg/CasacoSaintTropez.png'),
	},
	{
		id: 'bellahope-bota-alfaiataria-noir',
		nome: 'Bota Alfaiataria Noir',
		preco: 'R$ 320,00',
		imagem: require('../../assets/Img/bellahopeImg/BotaAlfaitariaNoir.png'),
	},
	{
		id: 'bellahope-blazer-grand-lapel',
		nome: 'Blazer Alfaiataria Grand Lapel',
		preco: 'R$ 897,00',
		imagem: require('../../assets/Img/bellahopeImg/BlazerAlfaitariaGrandLapel.png'),
	},
	{
		id: 'bellahope-relogio-fifth-avenue',
		nome: 'Relógio Fifth Avenue Classic',
		preco: 'R$ 597,00',
		imagem: require('../../assets/Img/bellahopeImg/RelógioFifthAvenue.png'),
	},
];

export default function ProdutosBellahopeScreen() {
	const { favoritos, alternarFavorito } = useFavoritos();
	const [larguraTela, setLarguraTela] = useState(0);
	const larguraCard = larguraTela > 0 ? (larguraTela - 60) / 2 : undefined;

	return (
		<View style={styles.container} onLayout={(event) => setLarguraTela(event.nativeEvent.layout.width)}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

			<View style={styles.cabecalho}>
				<TouchableOpacity
					style={styles.espacoLateral}
					accessibilityRole="button"
					accessibilityLabel="Voltar para Bellahope"
					onPress={() => router.replace('/homeBellahope')}
				/>
				<TouchableOpacity
					style={styles.marca}
					accessibilityRole="button"
					accessibilityLabel="Voltar para Bellahope"
					onPress={() => router.replace('/homeBellahope')}
				>
					<Text style={styles.logo}>BELLAHOPE</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.botaoMenu}
					accessibilityRole="button"
					accessibilityLabel="Abrir menu"
					onPress={() => router.push('/menu')}
				>
					<Ionicons name="menu-outline" size={25} color="#111111" />
				</TouchableOpacity>
			</View>

			<View style={styles.divisorTopo} />
			<Text style={styles.subtitulo}>MODA CIRCULAR</Text>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.conteudo}
			>
				<View style={styles.grade}>
					{produtos.map((produto) => {
						const estaFavoritado = favoritos.includes(produto.id);

						return (
							<View
								key={produto.id}
								style={[styles.cardProduto, larguraCard ? { width: larguraCard } : null]}
							>
								<View style={styles.areaImagem}>
									<Image
										source={produto.imagem}
										style={styles.imagemProduto}
										resizeMode="contain"
										accessibilityLabel={produto.nome}
									/>
								</View>
								<View style={styles.linhaNome}>
									<Text style={styles.nomeProduto} numberOfLines={2}>
										{produto.nome}
									</Text>
									<TouchableOpacity
										style={styles.botaoFavorito}
										activeOpacity={0.65}
										accessibilityRole="button"
										accessibilityLabel={`${estaFavoritado ? 'Remover dos' : 'Adicionar aos'} favoritos: ${produto.nome}`}
										onPress={() => alternarFavorito(produto.id)}
									>
										<Ionicons
											name={estaFavoritado ? 'heart' : 'heart-outline'}
											size={17}
											color="#111111"
										/>
									</TouchableOpacity>
								</View>
								<Text style={styles.precoProduto}>{produto.preco}</Text>
							</View>
						);
					})}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	cabecalho: {
		height: 88,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
	},
	espacoLateral: {
		width: 32,
		height: 32,
	},
	marca: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		color: '#111111',
		fontSize: 22,
		fontWeight: '300',
		letterSpacing: 5,
	},
	botaoMenu: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	divisorTopo: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#AAAAAA',
		marginHorizontal: 12,
	},
	subtitulo: {
		marginTop: 21,
		marginBottom: 24,
		color: '#999999',
		fontSize: 9,
		fontWeight: '400',
		textAlign: 'center',
	},
	conteudo: {
		paddingHorizontal: 20,
		paddingBottom: 28,
	},
	grade: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		rowGap: 18,
	},
	cardProduto: {
		width: '47%',
	},
	areaImagem: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#FFFFFF',
	},
	imagemProduto: {
		width: '100%',
		height: '100%',
	},
	linhaNome: {
		minHeight: 34,
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginTop: 5,
	},
	nomeProduto: {
		flex: 1,
		color: '#111111',
		fontSize: 10,
		lineHeight: 13,
		paddingRight: 2,
	},
	botaoFavorito: {
		width: 22,
		height: 22,
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	precoProduto: {
		marginTop: 1,
		color: '#111111',
		fontSize: 10,
		lineHeight: 13,
	},
});
