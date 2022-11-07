import {StackActions} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {useState, useEffect} from "react";
import "../Globals";
import {
	Text,
	View,
	Alert,
	Image,
	Clipboard,
	TextInput,
	Dimensions,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import {Base64} from "js-base64";

const Backup = ({navigation}) => {
	const [backup, setBackup] = useState(null);
	const [restore, setRestore] = useState(null);
	
	const getClipboard = async (acquire) => {
		if (acquire) setRestore(await Clipboard.getString());
		else Clipboard.setString(backup);
	}
	
	const encrypt = (text) => {
		const encrypted = Base64.encode(text);
		return encrypted;
	}
	
	const decrypt = (text) => {
		const decrypted = Base64.decode(text);
		return decrypted;
	}
	
	const restoreData = () => {
		const title = "Restauração";
		if (restore == null || restore.trim().length <= 0) Alert.alert(title, "Necessário o código dos dados.");
		else if (restore == "Nenhum dado encontrado.") Alert.alert(title, "Nenhum dado encontrado.");
		else if (restore == backup) Alert.alert(title, "Dados presentes no aplicativo.");
		else {
			try {
				let data = [];
				const response = decrypt(restore);
				if (response && response.trim().length >= 20) {
					data = JSON.parse(response);
					Alert.alert(
						"Você deseja mesmo restaurar?",
						"Todos os dados serão restaurados.",
						[
							{text: "Cancelar"},
							{
								text: "Restaurar",
								onPress: () => {
									SecureStore.setItemAsync("events", JSON.stringify(data));
									Alert.alert(title, "Dados restaurados com sucesso!");
									
									navigation.popToTop();
									navigation.dispatch(StackActions.replace("Main"));
								},
							},
						]
					);
				}
				else Alert.alert(title, "Dados não encontrados.");
			}
			catch(exception) {
				Alert.alert(title, "Dados corrompidos.");
				console.log("ERRO: " + exception);
			}
		}
	}
	
	useEffect(() => {
		const getBackup = async () => {
			const data = await SecureStore.getItemAsync("events");
			let response = "Nenhum dado encontrado."
			if (data) response = encrypt(data);
			setBackup(response);
		}

		getBackup();
	}, []);
	
	return (
		<ScrollView contentContainerStyle={{flexGrow: 1}}>
			<View style={{flex: 1, margin: 20, alignItems: "center", justifyContent: "center"}}>
				<Image
					style={styles.logo}
					source={require("../assets/Logo.png")}
				/>
				<View style={styles.component}>
					<Text style={{fontSize: Dimensions.get("window").width / 28}}> Dados criptografados. </Text>
					<View style={{flexDirection: "row", justifyContent: "center"}}>
						<TextInput
							style={styles.input}
							multiline={true}
							editable={false}
							value={backup}
						/>
						<TouchableOpacity style={styles.copyAndPasteComponent} onPress={() => getClipboard(false)}>
							<Image
								style={styles.copyAndPasteImage}
								source={require("../assets/Copy.png")}
							/>
							<Text style={styles.copyAndPasteText}> COPIAR </Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.component}>
					<Text style={{fontSize: Dimensions.get("window").width / 28}}> Restaurar com dados criptografados. </Text>
					<View style={{flexDirection: "row", justifyContent: "center"}}>
						<TextInput
							style={styles.input}
							multiline={true}
							editable={false}
							value={restore}
						/>
						<TouchableOpacity style={styles.copyAndPasteComponent} onPress={() => getClipboard(true)}>
							<Image
								style={styles.copyAndPasteImage}
								source={require("../assets/Paste.png")}
							/>
							<Text style={styles.copyAndPasteText}> COLAR </Text>
						</TouchableOpacity>
					</View>
				</View>
				<TouchableOpacity
					style={[
						styles.restoreButton,
						{
							marginBottom: 10,
							borderRadius: 26,
							backgroundColor: "#4e4b68",
							width: Dimensions.get("window").width / 1.2,
						},
					]}
					onPress={() => restoreData()}>
					<View style={styles.restoreComponent}>
						<Image
							style={styles.restoreImage}
							source={require("../assets/Restore.png")}
						/>
						<Text style={styles.restoreText}> Restaurar com criptografia </Text>
					</View>
				</TouchableOpacity>
				<View style={{flexDirection: "row"}}>
					<TouchableOpacity
						style={[
							styles.restoreButton,
							{marginRight: 10},
            ]}
						onPress={() => Alert.alert("Restauração com arquivo", "Indisponível no momento.")}>
						<View style={styles.restoreComponent}>
							<Image
								style={styles.restoreImage}
								source={require("../assets/Restore.png")}
							/>
							<Text style={styles.restoreText}> Restaurar </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.restoreButton,
							{width: Dimensions.get("window").width / 2.5},
						]}
						onPress={() => Alert.alert("Backup com arquivo", "Indisponível no momento.")}>
						<View style={styles.restoreComponent}>
							<Image
								style={styles.restoreImage}
								source={require("../assets/Backup.png")}
							/>
							<Text style={styles.restoreText}> Backup </Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
};

export default Backup;
const styles = StyleSheet.create({
	logo: {
		height: Dimensions.get("window").width / 2.6,
		width: Dimensions.get("window").width / 2.6,
		marginBottom: 20,
	},
	
	component: {marginBottom: Dimensions.get("window").width / 40},
	input: {
		width: Dimensions.get("window").width / 1.6,
		height: Dimensions.get("window").width / 4,
		borderColor: global.headerBackgroundColor,
		textAlignVertical: "top",
		backgroundColor: "white",
		borderRadius: 6,
		marginRight: 10,
		borderWidth: 2,
		color: "gray",
		padding: 8,
	},
	
	copyAndPasteComponent: {
		height: Dimensions.get("window").width / 3.8,
		width: Dimensions.get("window").width / 5.9,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	
	copyAndPasteImage: {
		height: Dimensions.get("window").width / 6,
		width: Dimensions.get("window").width / 6,
	},
	
	copyAndPasteText: {fontSize: Dimensions.get("window").width / 22.6},
	restoreComponent: {flexDirection: "row", alignSelf: "center"},
	restoreButton: {
		backgroundColor: global.headerBackgroundColor,
		width: Dimensions.get("window").width / 2.4,
		borderRadius: 26,
		padding: 10,
	},
	
	restoreImage: {
		height: Dimensions.get("window").width / 12.6,
		width: Dimensions.get("window").width / 12.6,
	},
	
	restoreText: {
		fontSize: Dimensions.get("window").width / 24.6,
		alignSelf: "center",
		paddingLeft: 10,
		color: "white",
	},
});