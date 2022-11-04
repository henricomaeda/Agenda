import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import {StackActions} from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import {Icon} from "react-native-elements";
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
			
			if (hours < 10) hours = '0' + hours;
			if (minutes < 10) minutes = '0' + minutes;
			
			var today = day + " de " + month + " de " + year + " (" + hours + ':' + minutes + ")";
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
					headerLeft: () => (
						<TouchableOpacity
							style={{marginLeft: 12}}
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
					) : route.name == "Form" && global.id == -1 ? (
						<TouchableOpacity
							style={{marginRight: 20}}
							onPress={() => Alert.alert(today(false), today())}>
							<Icon name="date-range" color="white" />
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={{marginRight: 20}}
							onPress={() => {
								Alert.alert(
									"Você deseja mesmo remover?",
									"Os dados do evento serão removidos.",
									[
										{text: "Cancelar"},
										{
											// Removendo os dados do evento.
											text: "Remover",
											onPress: async () => {
												const response = await SecureStore.getItemAsync("events");
												if (response) temporaryEvents = JSON.parse(response);
												
												let eventName = "Calendar ©";
												temporaryEvents.map((item) => {
													if (item.id == global.id) {
														eventName = item.name;
													}
												});
												
												temporaryEvents=temporaryEvents.filter((itens) => itens.id != global.id).map(
													({
														id,
														name,
														place,
														initialDate,
														finalDate,
														category,
														description,
														allDay,
														annually,
													}) => ({
														id,
														name,
														place,
														initialDate,
														finalDate,
														category,
														description,
														allDay,
														annually,
													})
												)
												
												if (temporaryEvents.length > 0) SecureStore.setItemAsync("events", JSON.stringify(temporaryEvents));
												else SecureStore.setItemAsync("events", "");
												
												Alert.alert(eventName, "Os dados do evento foram removidos!");
												navigation.dispatch(StackActions.replace("Main"));
											},
										},
									]
								);
							}}>
							<Icon name="delete" color="white" />
						</TouchableOpacity>
					)
				})}>
				<Stack.Screen
					name="Main"
					component={Main}
					options={{
						title: "Calendar ©",
						headerLeft: null,
					}}
				/>
				<Stack.Screen
					name="Form"
					component={Form}
					options={{title: "Adicionar ou atualizar"}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;