import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

const steps = [
	{
		icon: "hanger",
		title: "VOCÊ\nENTREGA",
		description: "Você seleciona uma peça que não usa mais e conta sua história em movimento.",
	},
	{
		icon: "⟳",
		title: "A PEÇA GANHA\nUM NOVO DESTINO",
		description: "A Bellahope avalia, seleciona e disponibiliza a peça para uma nova pessoa.",
	},
	{
		icon: "♡",
		title: "VOCÊ ESCOLHE\nO IMPACTO",
		description: "O valor arrecadado será direcionado para a causa que você escolheu por você.",
	},
];

const causes = [
	{ title: "INFÂNCIA", description: "Crianças e projetos de apoio à infância" },
	{ title: "LONGEVIDADE", description: "Lares e instituições para idosos" },
	{ title: "PROTEÇÃO ANIMAL", description: "Abrigos e projetos de proteção animal" },
	{ title: "OUTRAS CAUSAS", description: "Projetos sociais selecionados pela Bellahope" },
];

const navigation = [
	{ icon: "⌂", label: "INÍCIO" },
	{ icon: "▢", label: "LOJA" },
	{ icon: "♡", label: "DOAR" },
	{ icon: "♧", label: "FAVORITOS" },
	{ icon: "♙", label: "PERFIL" },
];

export default function HomeBellahope() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.screen}>
				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.brand}>
						<Text style={styles.brandName}>BELLAHOPE</Text>
					</View>

					<View style={styles.hero}>
						<View style={styles.heroCopy}>
							<Text style={styles.heroTitle}>MODA QUE{`\n`}TRANSFORMA{`\n`}HISTÓRIAS.</Text>
							<View style={styles.shortRule} />
							<Text style={styles.heroDescription}>
								A Bellahope é o programa de moda circular da Bellaver, que dá um novo destino às peças que já fizeram parte de uma história.
							</Text>
						</View>
						<Image
							source={require("./modaQueTransforma.png")}
							style={styles.heroImage}
							resizeMode="cover"
							accessibilityLabel="Moda que transforma"
						/>
					</View>

					<View style={styles.section}>
						<Text style={styles.sectionTitle}>COMO FUNCIONA?</Text>
						<View style={styles.steps}>
							{steps.map((step) => (
								<View key={step.title} style={styles.step}>
									<View style={styles.stepIcon}>
										{step.icon === "hanger" ? (
											<MaterialCommunityIcons name="hanger" size={22} color="#111111" />
										) : (
											<Text style={styles.stepGlyph}>{step.icon}</Text>
										)}
									</View>
									<Text style={styles.stepTitle}>{step.title}</Text>
									<Text style={styles.stepDescription}>{step.description}</Text>
								</View>
							))}
						</View>
					</View>

					<View style={styles.impactSection}>
						<Text style={styles.sectionTitle}>PARA ONDE VAI O SEU IMPACTO?</Text>
						<Text style={styles.impactSubtitle}>Você escolhe onde sua moda transforma.</Text>
						<View style={styles.causes}>
							{causes.map((cause) => (
								<View key={cause.title} style={styles.cause}>
									<Text style={styles.causeTitle}>{cause.title}</Text>
									<Text style={styles.causeDescription}>{cause.description}</Text>
								</View>
							))}
						</View>
					</View>

					<View style={styles.actions}>
						<Pressable style={styles.actionButton} accessibilityRole="button">
							<Text style={styles.actionText}>QUERO DOAR</Text>
						</Pressable>
						<Pressable style={styles.actionButton} accessibilityRole="button">
							<Text style={styles.actionText}>QUERO COMPRAR</Text>
						</Pressable>
					</View>
				</ScrollView>

				<View style={styles.bottomNavigation}>
					{navigation.map((item, index) => (
						<Pressable
							key={item.label}
							style={styles.navItem}
							accessibilityRole="button"
							accessibilityLabel={item.label}
						>
							{index === 0 ? (
								<SimpleLineIcons
									name="home"
									size={16}
									color="#111111"
									style={styles.navIconComponent}
								/>
							) : index === 1 ? (
								<MaterialCommunityIcons
									name="shopping-outline"
									size={16}
									color="#555555"
									style={styles.navIconComponent}
								/>
							) : index === 2 ? (
								<Feather
									name="heart"
									size={16}
									color="#555555"
									style={styles.navIconComponent}
								/>
							) : index === 3 ? (
								<FontAwesome5
									name="bookmark"
									size={14}
									color="#555555"
									style={styles.navIconComponent}
								/>
							) : index === 4 ? (
								<Ionicons
									name="person-outline"
									size={17}
									color="#555555"
									style={styles.navIconComponent}
								/>
							) : (
								<Text style={styles.navIcon}>{item.icon}</Text>
							)}
							<Text style={[styles.navLabel, index === 0 && styles.activeNavLabel]}>
								{item.label}
							</Text>
						</Pressable>
					))}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	screen: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	content: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	brand: {
		height: 65,
		justifyContent: "center",
		alignItems: "center",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#d8d8d8",
	},
	brandName: {
		color: "#242424",
		fontSize: 16,
		fontWeight: "300",
		letterSpacing: 4,
	},
	hero: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingTop: 16,
		paddingBottom: 19,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#e4e4e4",
	},
	heroCopy: {
		flex: 1,
		paddingRight: 13,
	},
	heroTitle: {
		color: "#111111",
		fontSize: 13,
		lineHeight: 15,
		fontWeight: "400",
	},
	shortRule: {
		width: 26,
		height: 1,
		backgroundColor: "#777777",
		marginTop: 11,
		marginBottom: 12,
	},
	heroDescription: {
		color: "#333333",
		fontSize: 9,
		lineHeight: 12,
	},
	heroImage: {
		width: "40%",
		aspectRatio: 0.72,
	},
	section: {
		paddingTop: 14,
		paddingBottom: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#e4e4e4",
	},
	sectionTitle: {
		color: "#222222",
		fontSize: 12,
		fontWeight: "400",
		textAlign: "center",
	},
	steps: {
		flexDirection: "row",
		marginTop: 17,
	},
	step: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 5,
		borderRightWidth: StyleSheet.hairlineWidth,
		borderRightColor: "#e4e4e4",
	},
	stepIcon: {
		alignItems: "center",
		justifyContent: "center",
		height: 27,
	},
	stepGlyph: {
		color: "#111111",
		fontSize: 23,
		lineHeight: 27,
	},
	stepTitle: {
		minHeight: 23,
		marginTop: 4,
		color: "#111111",
		fontSize: 7,
		lineHeight: 9,
		fontWeight: "700",
		textAlign: "center",
	},
	stepDescription: {
		marginTop: 3,
		color: "#444444",
		fontSize: 7,
		lineHeight: 9,
		textAlign: "center",
	},
	impactSection: {
		paddingTop: 15,
	},
	impactSubtitle: {
		marginTop: 5,
		color: "#333333",
		fontSize: 9,
		textAlign: "center",
	},
	causes: {
		marginTop: 9,
	},
	cause: {
		paddingVertical: 7,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#e4e4e4",
	},
	causeTitle: {
		color: "#111111",
		fontSize: 9,
		lineHeight: 12,
		fontWeight: "700",
	},
	causeDescription: {
		marginTop: 3,
		color: "#333333",
		fontSize: 9,
		lineHeight: 12,
	},
	actions: {
		paddingHorizontal: 14,
		paddingTop: 18,
	},
	actionButton: {
		height: 34,
		marginBottom: 7,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 2,
		backgroundColor: "#050505",
	},
	actionText: {
		color: "#ffffff",
		fontSize: 8,
		fontWeight: "700",
	},
	bottomNavigation: {
		height: 48,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		backgroundColor: "#ffffff",
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: "#eeeeee",
	},
	navItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	navIcon: {
		height: 20,
		color: "#555555",
		fontSize: 16,
		lineHeight: 19,
	},
	navIconComponent: {
		height: 20,
	},
	activeNavIcon: {
		color: "#111111",
	},
	navLabel: {
		color: "#555555",
		fontSize: 6,
		letterSpacing: 0.2,
	},
	activeNavLabel: {
		color: "#111111",
	},
});
