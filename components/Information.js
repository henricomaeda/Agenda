import "../Globals";
import {
	Text,
	View,
	Image,
	Linking,
	Dimensions,
	StyleSheet,
	ScrollView,
} from "react-native";

const Information = () => {
	return (
		<ScrollView contentContainerStyle={{flexGrow: 1}}>
			<View style={{flex: 1, margin: 30, alignItems: "center", justifyContent: "center"}}>
				<View style={styles.component}>
					<Image
						style={styles.image}
						source={require("../assets/Freepik.png")}
					/>
				</View>
				<View style={styles.created}>
					<Text style={styles.by}>
						Todos os ícones criados por
					</Text>
					<Text
						style={styles.author}
						onPress={() => {Linking.openURL("https://www.flaticon.com/authors/freepik")}}>
						Freepik - Flaticon
					</Text>
				</View>
				<View style={styles.created}>
					<Text style={styles.by}>
						Aplicativo desenvolvido por
					</Text>
					<Text
						style={styles.author}
						onPress={() => {Linking.openURL("https://www.linkedin.com/in/henricomaeda")}}>
						Henrico Maeda
					</Text>
				</View>
			</View>
		</ScrollView>
	);
};

export default Information;
const styles = StyleSheet.create({
	component: {
		backgroundColor: "white",
		borderColor: "darkgrey",
		borderRadius: 200,
		borderWidth: 2,
	},
	
	image: {
		height: Dimensions.get("window").width - 220,
		width: Dimensions.get("window").width - 220,
		borderRadius: 200,
		margin: 20,
	},
	
	created: {
		alignItems: "center",
		margin: 20,
	},
	
	by: {fontSize: 16},
	author: {
		fontWeight: "bold",
		fontSize: 20,
		margin: 2,
	},
});