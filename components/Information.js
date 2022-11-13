import "../Globals";
import {
	Text,
	View,
	Alert,
	Image,
	Linking,
	ScrollView,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

const Information = () => {
	return (
		<ScrollView contentContainerStyle={{flexGrow: 1}}>
			<View style={{flex: 1, margin: 30, alignItems: "center", justifyContent: "center"}}>
				<TouchableOpacity
					onPress={() => Alert.alert(
						"Flaticon",
						"Ícones disponíveis na plataforma.",
						[
							{text: "Voltar"},
							{
								text: "Visitar",
								onPress: () => Linking.openURL("https://www.flaticon.com"),
							},
						]
					)}>
					<Image
						style={styles.logo}
						source={require("../assets/flaticon/Logo.png")}
					/>
				</TouchableOpacity>
				<View style={styles.created}>
					<Text style={styles.by}>
						Agenda desenvolvida por {' '}
						<Text
							style={styles.author}
							onPress={() => Linking.openURL("https://www.linkedin.com/in/henricomaeda")}>
							Henrico Maeda
						</Text>.
					</Text>
				</View>
				<View style={styles.created}>
					<TouchableOpacity
						style={styles.highlight}
						onPress={() => Alert.alert(
							"Atribuição",
							"Os ícones desse aplicativo são grátis e foram desenvolvidos por esses autores.",
							[{text: "Entendi"}]
						)}>
						<View
							style={{
								backgroundColor: "#e1fcf0",
								borderColor: "transparent",
								borderRadius: 200,
								borderWidth: 1.2,
								flex: 0,
							}}>
							<Image
								style={[
									styles.image,
									{
										margin: 3.6,
										marginRight: 2.6,
										borderWidth: 1.2,
										borderColor: "transparent",
										backgroundColor: "transparent",
										width: Dimensions.get("window").width / 12,
										height: Dimensions.get("window").width / 12,
									}
								]}
								source={require("../assets/icons/Copyright.png")}
							/>
						</View>
						<View style={{flex: 1, alignItems: "center"}}>
							<Text
								style={[
									styles.by,
									{
										color: "white",
										fontSize: Dimensions.get("window").width / 29.2,
									}
								]}>
								Todos os Ícones desenvolvidos por:
							</Text>
						</View>
					</TouchableOpacity>
					<View>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/authors/ilham-fitrotul-hayat")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/Ilham-Fitrotul-Hayat.png")}
							/>
							<Text style={styles.author}>
								Ilham Fitrotul Hayat
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/br/autores/smashingstocks")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/smashingstocks.png")}
							/>
							<Text style={styles.author}>
								smashingstocks
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/authors/iyahicon")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/IYAHICON.png")}
							/>
							<Text style={styles.author}>
								IYAHICON
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/authors/maxicons")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/max.icons.jpg")}
							/>
							<Text style={styles.author}>
								max.icons
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/authors/th-studio")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/th-studio.png")}
							/>
							<Text style={styles.author}>
								th studio
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/authors/freepik")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/Freepik.jpg")}
							/>
							<Text style={styles.author}>
								Freepik
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/br/autores/lutfix")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/lutfix.png")}
							/>
							<Text style={styles.author}>
								lutfix
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => Linking.openURL("https://www.flaticon.com/br/autores/srip")}
							style={styles.button}>
							<Image
								style={styles.image}
								source={require("../assets/flaticon/authors/srip.jpg")}
							/>
							<Text style={styles.author}>
								srip
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default Information;
const styles = StyleSheet.create({
	highlight: {
		width: Dimensions.get("window").width / 1.36,
		backgroundColor: "#4ad295",
		borderColor: "#c4f5df",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 120,
		marginBottom: 10,
		borderWidth: 2.6,
		marginTop: 20,
		padding: 6.2,
	},
	
	logo: {
		height: Dimensions.get("window").width / 6.2,
		width: Dimensions.get("window").width / 1.2,
		marginBottom: 20,
	},
	
	button: {
		alignContent: "center",
		flexDirection: "row",
		marginTop: 12.6,
	},
	
	image: {
		height: Dimensions.get("window").width / 8.2,
		width: Dimensions.get("window").width / 8.2,
		borderColor: "grey",
		borderRadius: 200,
		marginRight: 10,
		borderWidth: 1.2,
	},
	
	created: {alignItems: "center"},
	by: {fontSize: Dimensions.get("window").width / 28.2},
	author: {
		fontSize: Dimensions.get("window").width / 22.6,
		alignSelf: "center",
		fontWeight: "bold",
		margin: 2,
	},
});