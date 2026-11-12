
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const steps = [
  {
    icon: "hanger",
    title: "VOCÊ ENTREGA",
    description:
      "Você seleciona uma peça que não usa mais e conta sua história em movimento.",
  },
  {
    icon: "⟳",
    title: "A PEÇA GANHA UM NOVO DESTINO",
    description:
      "A Bellahope avalia, seleciona e disponibiliza a peça para uma nova pessoa.",
  },
  {
    icon: "♡",
    title: "VOCÊ ESCOLHE O IMPACTO",
    description:
      "O valor arrecadado será direcionado para a causa escolhida por você.",
  },
];

const causes = [
  {
    title: "INFÂNCIA",
    description: "Crianças e projetos de apoio à infância",
  },
  {
    title: "LONGEVIDADE",
    description: "Lares e instituições para idosos",
  },
  {
    title: "PROTEÇÃO ANIMAL",
    description: "Abrigos e projetos de proteção animal",
  },
  {
    title: "OUTRAS CAUSAS",
    description: "Projetos sociais selecionados pela Bellahope",
  },
];

const navigation = [
  { label: "INÍCIO" },
  { label: "LOJA" },
  { label: "DOAR" },
  { label: "FAVORITOS" },
  { label: "PERFIL" },
];

export default function HomeBellahope() {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <Pressable
              style={styles.botaoVoltar}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/home");
                }
              }}
            >
              <Feather name="arrow-left" size={22} color="#111111" />
            </Pressable>

            <Text style={styles.brandName}>BELLAHOPE</Text>
          </View>

          <View
            style={[
              styles.hero,
              width > 600 && styles.heroDesktop,
            ]}
          >
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>
                MODA QUE{"\n"}TRANSFORMA{"\n"}HISTÓRIAS.
              </Text>

              <View style={styles.shortRule} />

              <Text style={styles.heroDescription}>
                A Bellahope é o programa de moda circular da Bellaver,
                que dá um novo destino às peças que já fizeram parte
                de uma história.
              </Text>

              <Pressable
                style={styles.heroButton}
                onPress={() => router.push("/doar")}
              >
                <Text style={styles.heroButtonText}>FAÇA PARTE</Text>
                <Feather name="arrow-right" size={15} color="#111111" />
              </Pressable>
            </View>

            <View style={styles.heroImageFrame}>
              <Image
                source={require("./modaQueTransforma.png")}
                style={[
                  styles.heroImage,
                  { filter: "grayscale(100%)" } as any,
                ]}
                resizeMode="cover"
                accessibilityLabel="Moda que transforma"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>NOSSA PROPOSTA</Text>
            <Text style={styles.sectionTitle}>COMO FUNCIONA?</Text>

            <View style={styles.steps}>
              {steps.map((step, index) => (
                <View
                  key={step.title}
                  style={[
                    styles.step,
                    index < steps.length - 1 && styles.stepWithDivider,
                  ]}
                >
                  <View style={styles.stepIcon}>
                    {step.icon === "hanger" ? (
                      <MaterialCommunityIcons
                        name="hanger"
                        size={25}
                        color="#111111"
                      />
                    ) : (
                      <Text style={styles.stepGlyph}>{step.icon}</Text>
                    )}
                  </View>

                  <Text style={styles.stepNumber}>
                    0{index + 1}
                  </Text>

                  <Text style={styles.stepTitle}>{step.title}</Text>

                  <Text style={styles.stepDescription}>
                    {step.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.impactSection}>
            <Text style={styles.sectionEyebrow}>ESCOLHA SUA CAUSA</Text>
            <Text style={styles.sectionTitle}>
              PARA ONDE VAI O SEU IMPACTO?
            </Text>

            <Text style={styles.impactSubtitle}>
              Você escolhe onde sua moda transforma.
            </Text>

            <View style={styles.causes}>
              {causes.map((cause, index) => (
                <View key={cause.title} style={styles.cause}>
                  <Text style={styles.causeNumber}>
                    0{index + 1}
                  </Text>

                  <View style={styles.causeText}>
                    <Text style={styles.causeTitle}>
                      {cause.title}
                    </Text>

                    <Text style={styles.causeDescription}>
                      {cause.description}
                    </Text>
                  </View>

                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color="#777777"
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Text style={styles.actionTitle}>
              SUA ESCOLHA FAZ A DIFERENÇA.
            </Text>

            <Text style={styles.actionDescription}>
              Faça parte de uma moda com propósito.
            </Text>

            <Pressable
              style={styles.actionButton}
              onPress={() => router.push("/doar")}
            >
              <Text style={styles.actionText}>QUERO DOAR</Text>
              <Feather name="arrow-right" size={16} color="#ffffff" />
            </Pressable>

            <Pressable
              style={styles.actionButtonSecondary}
              onPress={() => router.push("/produtosBellahope")}
            >
              <Text style={styles.actionTextSecondary}>
                QUERO COMPRAR
              </Text>
              <Feather name="arrow-right" size={16} color="#111111" />
            </Pressable>
          </View>

          <Text style={styles.footer}>BELLAHOPE © 2026</Text>
        </ScrollView>

        <View style={styles.bottomNavigation}>
          {navigation.map((item, index) => (
            <Pressable
              key={item.label}
              style={styles.navItem}
              onPress={
                index === 0
                  ? () => router.push("/home")
                  : index === 1
                    ? () => router.push("/produtosBellahope")
                    : index === 2
                      ? () => router.push("/doar")
                      : index === 3
                        ? () => router.push("/favoritos")
                        : () => router.push("/perfil")
              }
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              {index === 0 ? (
                <SimpleLineIcons
                  name="home"
                  size={18}
                  color="#111111"
                />
              ) : index === 1 ? (
                <MaterialCommunityIcons
                  name="shopping-outline"
                  size={19}
                  color="#777777"
                />
              ) : index === 2 ? (
                <Feather
                  name="heart"
                  size={19}
                  color="#777777"
                />
              ) : index === 3 ? (
                <FontAwesome5
                  name="bookmark"
                  size={16}
                  color="#777777"
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#777777"
                />
              )}

              <Text
                style={[
                  styles.navLabel,
                  index === 0 && styles.activeNavLabel,
                ]}
              >
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
    paddingHorizontal: 15,
    paddingBottom: 25,
  },
  brand: {
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#cccccc",
    position: "relative",
  },
  botaoVoltar: {
    position: "absolute",
    left: 0,
    top: 25,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: "#222222",
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: 5,
  },
  brandSubtitle: {
    color: "#888888",
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 4,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 27,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dddddd",
    gap: 12,
  },
  heroDesktop: {
    paddingHorizontal: 30,
    paddingVertical: 35,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 3,
  },
  heroEyebrow: {
    color: "#888888",
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    color: "#111111",
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  shortRule: {
    width: 35,
    height: 1,
    backgroundColor: "#111111",
    marginTop: 14,
    marginBottom: 14,
  },
  heroDescription: {
    color: "#444444",
    fontSize: 11,
    lineHeight: 17,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 18,
  },
  heroButtonText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  heroImageFrame: {
    width: "43%",
    aspectRatio: 0.72,
    overflow: "hidden",
    backgroundColor: "#eeeeee",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  section: {
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dddddd",
  },
  sectionEyebrow: {
    color: "#888888",
    fontSize: 9,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 7,
  },
  sectionTitle: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  steps: {
    flexDirection: "row",
    marginTop: 25,
  },
  step: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 7,
  },
  stepWithDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#dddddd",
  },
  stepIcon: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  stepGlyph: {
    color: "#111111",
    fontSize: 27,
    lineHeight: 32,
  },
  stepNumber: {
    color: "#999999",
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 8,
  },
  stepTitle: {
    minHeight: 29,
    marginTop: 5,
    color: "#111111",
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  stepDescription: {
    marginTop: 5,
    color: "#555555",
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center",
  },
  impactSection: {
    paddingTop: 25,
  },
  impactSubtitle: {
    marginTop: 7,
    color: "#555555",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
  causes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 17,
  },
  cause: {
    width: "48.5%",
    minHeight: 91,
    borderWidth: 1,
    borderColor: "#dddddd",
    padding: 10,
    marginBottom: 9,
    justifyContent: "space-between",
  },
  causeNumber: {
    color: "#999999",
    fontSize: 9,
    letterSpacing: 1,
  },
  causeText: {
    marginTop: 10,
  },
  causeTitle: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  causeDescription: {
    color: "#666666",
    fontSize: 9,
    lineHeight: 13,
    marginTop: 5,
  },
  actions: {
    marginTop: 19,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  actionTitle: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 1,
    textAlign: "center",
  },
  actionDescription: {
    color: "#777777",
    fontSize: 10,
    marginTop: 6,
    marginBottom: 16,
    textAlign: "center",
  },
  actionButton: {
    width: "100%",
    height: 46,
    marginBottom: 9,
    paddingHorizontal: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#050505",
  },
  actionText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  actionButtonSecondary: {
    width: "100%",
    height: 46,
    paddingHorizontal: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#111111",
  },
  actionTextSecondary: {
    color: "#111111",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  footer: {
    color: "#999999",
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 5,
  },
  bottomNavigation: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#dddddd",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navLabel: {
    color: "#777777",
    fontSize: 8,
    letterSpacing: 0.3,
  },
  activeNavLabel: {
    color: "#111111",
    fontWeight: "700",
  },
});
