import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
    Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

export default function AdminScreen() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');
    const [telefone, setTelefone] = useState('');

    const [foto, setFoto] = useState<string | null>(null);

    async function selecionarFoto() {
        const permissao =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            Alert.alert(
                'Permissão necessária',
                'Permita o acesso à galeria para escolher sua foto.'
            );
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    }

    function salvar() {
        if (
            !nome.trim() ||
            !sobrenome.trim() ||
            !rua.trim() ||
            !bairro.trim() ||
            !cidade.trim() ||
            !estado.trim() ||
            !cep.trim() ||
            !telefone.trim()
        ) {
            Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
            return;
        }

        Alert.alert(
            'Dados preenchidos',
            'As informações foram validadas. O salvamento permanente será configurado quando conectarmos o banco de dados.'
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.pagina}
            keyboardShouldPersistTaps="handled"
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.cabecalho}>
                <View style={styles.menuLinha}>
                    <View style={styles.menuEspaco} />

                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>BELLAVER</Text>
                        <Text style={styles.estabelecimento}>EST. 1972</Text>
                    </View>







                </View>

                <View style={styles.linhaCabecalho} />

                <Text style={styles.subtitulo}>PAINEL DO ADMINISTRADOR</Text>

                <TouchableOpacity
                    style={styles.foto}
                    onPress={selecionarFoto}
                    activeOpacity={0.7}
                >
                    {foto ? (
                        <Image source={{ uri: foto }} style={styles.imagemFoto} />
                    ) : (
                        <Text style={styles.fotoTexto}>Foto +</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Nome.."
                    placeholderTextColor="#888888"
                    value={nome}
                    onChangeText={setNome}
                />

                <Text style={styles.label}>Sobrenome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Sobrenome.."
                    placeholderTextColor="#888888"
                    value={sobrenome}
                    onChangeText={setSobrenome}
                />

                <Text style={styles.label}>Rua</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Sua Rua.."
                    placeholderTextColor="#888888"
                    value={rua}
                    onChangeText={setRua}
                />

                <Text style={styles.label}>Bairro</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Bairro.."
                    placeholderTextColor="#888888"
                    value={bairro}
                    onChangeText={setBairro}
                />

                <Text style={styles.label}>Cidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Sua Cidade.."
                    placeholderTextColor="#888888"
                    value={cidade}
                    onChangeText={setCidade}
                />

                <Text style={styles.label}>Estado</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Estado.."
                    placeholderTextColor="#888888"
                    value={estado}
                    onChangeText={setEstado}
                />

                <Text style={styles.label}>CEP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu CEP.."
                    placeholderTextColor="#888888"
                    value={cep}
                    onChangeText={setCep}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Telefone Celular</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Celular.."
                    placeholderTextColor="#888888"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity style={styles.botao} onPress={salvar}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.rodape}>Bellaver® - 2026</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    pagina: {
        flexGrow: 1,
        paddingHorizontal: 27,
        paddingTop: 30,
        paddingBottom: 25,
    },

    cabecalho: {
        marginBottom: 35,
    },

    menuLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    menuEspaco: {
        width: 25,
    },

    logoContainer: {
        alignItems: 'center',
        flex: 1,
    },

    logo: {
        color: '#000000',
        fontSize: 29,
        fontWeight: '300',
        letterSpacing: 7,
    },

    estabelecimento: {
        color: '#000000',
        fontSize: 12,
        marginTop: 7,
    },

    menuBotao: {
        width: 25,
        alignItems: 'center',
    },

    menuTexto: {
        fontSize: 23,
        color: '#000000',
    },

    linhaCabecalho: {
        height: 1,
        backgroundColor: '#BBBBBB',
        marginTop: 20,
    },

    subtitulo: {
        color: '#999999',
        fontSize: 9,
        textAlign: 'center',
        marginTop: 17,
    },

    foto: {
        width: 95,
        height: 95,
        borderRadius: 48,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 37,
    },

    imagemFoto: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
    },

    fotoTexto: {
        color: '#000000',
        fontSize: 15,
    },

    card: {
        borderWidth: 1,
        borderColor: '#111111',
        borderRadius: 3,
        paddingHorizontal: 17,
        paddingTop: 12,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 3,
    },

    label: {
        color: '#111111',
        fontSize: 14,
        marginBottom: 4,
    },

    input: {
        height: 42,
        backgroundColor: '#EEEEEE',
        borderWidth: 1,
        borderColor: '#111111',
        borderRadius: 3,
        paddingHorizontal: 9,
        paddingVertical: 0,
        fontSize: 11,
        color: '#000000',
        marginBottom: 12,
    },

    botao: {
        backgroundColor: '#000000',
        width: 109,
        height: 37,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        marginTop: 20,
    },

    textoBotao: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },

    rodape: {
        color: '#777777',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 60,
    },
});