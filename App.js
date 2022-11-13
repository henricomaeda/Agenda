import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import {StackActions} from "@react-navigation/native";
import Information from "./components/Information";
import {Icon} from "react-native-elements";
import Backup from "./components/Backup";
import Form from "./components/Form";
import Main from "./components/Main";
import "./Globals";
import {
	View,
	Alert,
	TouchableOpacity,
} from "react-native";

const Stack=createStackNavigator();
const App=() => {
	const today = (longFormat = true) => {
		const date = new Date();
		if (longFormat) {
			const months = [
				"janeiro",
				"fevereiro",
				"março",
				"abril",
				"maio",
				"junho",
				"julho",
				"augusto",
				"setembro",
				"outubro",
				"novembro",
				"dezembro",
			];
			
			var day = date.getDate();
			var month = months[date.getMonth()];
			var year = date.getFullYear();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			
			if (hours < 10) hours = "0" + hours;
			if (minutes < 10) minutes = "0" + minutes;
			
			var today = day + " de " + month + " de " + year + " (" + hours + ":" + minutes + ")";
			return today;
		}
		else {
			const weeks = [
				"Domingo",
				"Segunda-feira",
				"Terça-feira",
				"Quarta-feira",
				"Quinta-feira",
				"Sexta-feira",
				"Sábado",
			];

			var weekDay = weeks[date.getDay()];
			return weekDay;
		}
	}
	
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Main"
				screenOptions={({navigation, route}) => ({
					headerStyle: {backgroundColor: headerBackgroundColor},
					headerTintColor: headerTintColor,
					headerTitleStyle: {fontWeight: "bold"},
					headerLeft: () => route.name == "Main" ? (
						<TouchableOpacity
							style={{marginLeft: 20}}
							onPress={() => navigation.navigate("Backup")}>
							<Icon name="backup" color="white" />
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{marginLeft: 20}}
							onPress={() => {
								navigation.popToTop();
								navigation.dispatch(StackActions.replace("Main"));
							}}>
							<Icon name="arrow-back" color="white" />
						</TouchableOpacity>
					),
					headerRight: () => route.name == "Main" ? (
						<View style={{flexDirection: "row"}}>
							<TouchableOpacity
								style={{marginRight: 20}}
								onPress={() => navigation.navigate("Information")}>
								<Icon name="info-outline" color="white" />
							</TouchableOpacity>
							<TouchableOpacity
								style={{marginRight: 20}}
								onPress={() => navigation.dispatch(StackActions.replace("Main"))}>
								<Icon name="refresh" color="white" />
							</TouchableOpacity>
							<TouchableOpacity
								style={{marginRight: 20}}
								onPress={() => {
									global.id = -1;
									navigation.navigate("Form");
								}}>
								<Icon name="playlist-add" color="white" />
							</TouchableOpacity>
						</View>
					) : route.name == "Form" && (
						<TouchableOpacity
							style={{marginRight: 20}}
							onPress={() => Alert.alert(today(false), today())}>
							<Icon name="date-range" color="white" />
						</TouchableOpacity>
					)
				})}>
				<Stack.Screen
					name="Main"
					component={Main}
					options={{title: "Agenda ©"}}
				/>
				<Stack.Screen
					name="Backup"
					component={Backup}
					options={{
						title: "Área de dados e criptografia",
						headerRight: null,
					}}
				/>
				<Stack.Screen
					name="Form"
					component={Form}
					options={{title: "Adicionar ou atualizar"}}
				/>
				<Stack.Screen
					name="Information"
					component={Information}
					options={{
						title: "Mais informações",
						headerRight: null,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;