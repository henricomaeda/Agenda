import {StackActions} from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import {useState, useEffect} from 'react';
import {
	Text,
	View,
	Image,
	Alert,
	FlatList,
	StyleSheet,
	ScrollView,
	Dimensions,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";

const Main=({navigation}) => {
	// Definindo variáveis de objeto.
	const [today, setToday] = useState([]);
	const [tomorrow, setTomorrow] = useState([]);
	const [later, setLater] = useState([]);
	const [past, setPast] = useState([]);
	
	// Definindo variável de carregamento e meses.
	const [loading, setLoading] = useState(true);
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
	
	// Definindo construtor do componente.
	useEffect(() => {
		setLoading(true);
		global.id = -1;
		fetchData();
	}, []); // eslint-disable-line
	
	// Definindo função para retornar data.
	const getFormatedDate = (date, tomorrow = false) => {
		const tempDate = new Date(date);
		
		var day = tempDate.getDate();
		var month = tempDate.getMonth();
		var year = tempDate.getFullYear();
		
		if (tomorrow) day++;
		if (day < 10) day = '0' + day;
		if (month < 10) month = '0' + month;
		
		return new Date(year, month, day);
	}
	
	// Enviando dados para a requisição.
	const fetchData = async () => {
		// Criando objeto e ordenando.
		let data = [];
		sortData();
		
		// Convertendo cadeia de caracteres JSON em um objeto JavaScript.
		const response = await SecureStore.getItemAsync("events");
		if (response) data = JSON.parse(response);
		
		// Definindo função para adicionar dado.
		const addData = (data, item) => {
			// Adicionando um evento.
			data.push({
				id: item.id,
				name: item.name,
				place: item.place.trim().length == 0 ? "Não definido." : item.place,
				initialDate: item.initialDate,
				finalDate: item.finalDate,
				description: item.description.trim().length == 0 ? "Não definido." : item.description,
				category: item.category,
				allDay: item.allDay,
				annually: item.annually,
			});
		}
		
		// Adicionando, respectivamente, suas datas.
		data.map((item) => {
			var date = getFormatedDate(item.initialDate);
			var todayDate = getFormatedDate(new Date());
			var tomorrowDate = getFormatedDate(new Date(), true);
			
			// Verificando datas.
			if (date.getTime() == todayDate.getTime()) {
				date = new Date(item.finalDate);
				todayDate = new Date();
				
				if (date.getTime() < todayDate.getTime()) addData(past, item);
				else addData(today, item);
			}
			else if (date.getTime() == tomorrowDate.getTime()) addData(tomorrow, item);
			else if (date.getTime() > tomorrowDate.getTime()) addData(later, item);
			else if (date.getTime() < todayDate.getTime()) addData(past, item);
		});
		
		// Atualizando e carregando dados.
		setToday(JSON.parse(JSON.stringify(today.sort(
			(objA, objB) => Number(new Date(objA.finalDate)) - Number(new Date(objB.finalDate)),
		))));
		
		// Exibindo interface ao usuário.
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(600);
		setLoading(false);
	}
	
	// Ordenando dados por data.
	const sortData = async () => {
		// Definindo variável de objeto.
		let data = [];
		
		// Convertendo cadeia de caracteres JSON em um objeto JavaScript.
		const response = await SecureStore.getItemAsync("events");
		if (response) {
			data = JSON.parse(response);
			const verifyDate = (date, getNextYear = false) => {
				const tempDate = new Date(date);
				if (getNextYear) {
					var day = tempDate.getDate();
					var month = tempDate.getMonth() + 1;
					var year = new Date().getFullYear() + 1;
					var hours = tempDate.getHours();
					var minutes = tempDate.getMinutes();
					
					if (day < 10) day = '0' + day;
					if (month < 10) month = '0' + month;
					if (hours < 10) hours = '0' + hours;
					if (minutes < 10) minutes = '0' + minutes;
					
					return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ":00-03:00";
				}
				else {
					if (new Date().getTime() > tempDate.getTime()) return true;
					else return false;
				}
			}
			
			data = data.map(itens => (
				(itens.annually && verifyDate(itens.finalDate)) ? {
					...itens,
					initialDate: verifyDate(itens.initialDate, true),
					finalDate: verifyDate(itens.finalDate, true),
				} : itens
			))
			
			const sortedData = data.sort(
				(objA, objB) => Number(new Date(objA.initialDate)) - Number(new Date(objB.initialDate)),
			);
			
			SecureStore.setItemAsync("events", JSON.stringify(sortedData));
		}
	}
	
	// Enviando data e horário formatado.
	const formatDate = (date, mode = "date") => {
		const tempDate = new Date(date);
		
		var d = tempDate.getDate();
		var m = months[tempDate.getMonth()];
		var y = tempDate.getFullYear();
		var h = tempDate.getHours();
		var min = tempDate.getMinutes();
		
		if (d < 10) d = '0' + d;
		if (h < 10) h = '0' + h;
		if (min < 10) min = '0' + min;
		
		const formatedDate = d + '/' + m + '/' + y;
		const formatedTime = h + ':' + min;
		
		if (mode == "date") return formatedDate;
		else if (mode == "time") return formatedTime;
	}
	
	// Selecionando evento para a alteração.
	const selectEvent = (selectedEvent) => {
		// Definindo o id selecionado.
		global.id = selectedEvent.id;
		
		// Exibindo formulário ao usuário.
		navigation.dispatch(StackActions.replace("Form"));
	}
	
	// Exibindo os dados dos eventos ao usuário.
	const showFlatList = (data) => {
		const getBGColor = (item, image = false) => {
			var date = getFormatedDate(item.initialDate);
			var todayDate = getFormatedDate(new Date());
			var tomorrowDate = getFormatedDate(new Date(), true);
			
			if (date.getTime() == todayDate.getTime()) {
				date = new Date(item.finalDate);
				todayDate = new Date();
				
				if (date.getTime() < todayDate.getTime()) {
					if (image) return "#7e7a9f";
					else return "#646085";
				}
				else {
					if (image) return "#595676";
					else return "#434059";
				}
			}
			else if (date.getTime() == tomorrowDate.getTime()) {
				if (image) return "#646085";
				else return "#4e4b68";
			}
			else if (date.getTime() > tomorrowDate.getTime()) {
				if (image) return "#6f6b94";
				else return "#595676";
			}
			else if (date.getTime() < todayDate.getTime()) {
				if (image) return "#7e7a9f";
				else return "#646085";
			}
		}
		
		if (data.length <= 0) return (
			<Text style={{marginBottom: 10, marginLeft: 20}}>
				Não há eventos ou lembretes
				{
					data == today ? " para hoje."
					: data == tomorrow ? " para amanhã."
					: data == later ? " para depois."
					: " passados."
				}
			</Text>
		)
		else return (
			<FlatList
				data={data}
				renderItem={({item}) => (
					<TouchableOpacity onPress={() => selectEvent(item)}>
						<View
							style={{
								width: Dimensions.get("window").width - 40,
								marginBottom: 10,
								borderWidth: 1.6,
								borderRadius: 20,
								paddingHorizontal: 10,
								backgroundColor: getBGColor(item),
							}}>
							<Text
								style={{
									fontSize: 15,
									marginTop: 8,
									marginLeft: 2,
									marginBottom: 4,
									color: "white",
								}}>
								<Text style={{
									fontSize: 20,
									fontWeight: "bold",
								}}> {item.name} </Text>({item.category})
							</Text>
							<View style={{flexDirection: "row"}}>
								<View
									style={{
										borderWidth: 1.2,
										borderRadius: 8,
										marginRight: 6,
										marginLeft: 4,
										backgroundColor: getBGColor(item, true),
										borderColor: "#1f3447",
									}}>
									<View
										style={{
											marginLeft: 9,
											marginRight: 7,
											marginTop: 6,
											marginBottom: 6,
										}}>
										{item.category == "Lembrete" ? (
											<Image
												style={styles.image}
												source={require("../assets/Reminder.png")}
											/>
										) : item.category == "Evento" ? (
											<Image
												style={styles.image}
												source={require("../assets/Event.png")}
											/>
										) : item.category == "Aniversário" ? (
											<Image
												style={styles.image}
												source={require("../assets/Birthday.png")}
											/>
										) : item.category == "Trabalho" ? (
											<Image
												style={styles.image}
												source={require("../assets/Work.png")}
											/>
										) : item.category == "Acadêmico" ? (
											<Image
												style={styles.image}
												source={require("../assets/Academic.png")}
											/>
										) : item.category == "Relacionamento" ? (
											<Image
												style={styles.image}
												source={require("../assets/Relationship.png")}
											/>
										) : item.category == "Medicina" ? (
											<Image
												style={styles.image}
												source={require("../assets/Medicine.png")}
											/>
										) : null}
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										borderColor: "#1f3447",
									}}>
									<View style={{flexDirection: "row"}}>
										<View>
											<Text style={[styles.label, {fontWeight: "bold"}]}>
												Data:
											</Text>
											<Text style={[styles.label, {fontWeight: "bold"}]}>
												Horário:
											</Text>
										</View>
										<View>
											<Text style={styles.label}>
												{formatDate(item.initialDate)}
											</Text>
											<Text style={styles.label}>
												{formatDate(item.initialDate, "time")} - {formatDate(item.finalDate, "time")}
											</Text>
										</View>
									</View>
								</View>
							</View>
							<View
								style={{
									flexDirection: "row",
									marginBottom: 16,
								}}>
								<View style={{marginLeft: 6, marginTop: 6}}>
									<Text
									style={{
										fontWeight: "bold",
										color: "white",
									}}>
									Local:
									</Text>
									<Text
									style={{
										fontWeight: "bold",
										color: "white",
									}}>
									Descrição:
									</Text>
								</View>
								<View style={{marginTop: 6, marginLeft: 10}}>
									<Text style={{color: "white"}}>
										{item.place}
									</Text>
									<Text style={{color: "white"}}>
										{item.description}
									</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		);
	}
	
	if (loading) return (
		<View style={{flex: 1, alignItems: "center"}}>
			<View style={{flex: 1, justifyContent: "center"}}>
				<ActivityIndicator size="large" color="#2c2b3b" />
				<View style={{justifyContent: "center"}}>
					<Text
						style={{
							color: "#424059",
							fontSize: 22,
							marginTop: 12,
						}}>
						Carregando ...
					</Text>
				</View>
			</View>
			<Text
				style={{
					flex: 0,
					fontSize: 16,
					marginBottom: 10,
					color: "#424059",
				}}>
				Aplicativo desenvolvido por{' '}
				<Text style={{fontWeight: "bold"}}>
					Henrico Maeda.
				</Text>
			</Text>
		</View>
	);
	else return (
		<View style={{flex: 1, padding: 20}}>
			<View style={{flex: 1}}>
				<ScrollView contentContainerStyle={{flexGrow: 1}}>
					<View style={styles.subtitle}>
						<Text style={[styles.subtitleText, {marginTop: 0}]}>
							Hoje
						</Text>
					</View>
					{showFlatList(today)}
					<View style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Amanhã
						</Text>
					</View>
					{showFlatList(tomorrow)}
					<View style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Depois
						</Text>
					</View>
					{showFlatList(later)}
					<View style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Passado
						</Text>
					</View>
					{showFlatList(past)}
				</ScrollView>
			</View>
			<View
				style={{
					flex: 0,
					marginTop: 20,
					flexDirection: "row",
				}}>
				<TouchableOpacity
					style={[
						styles.button,
						{
							marginRight: 10,
							backgroundColor: "#53506e",
						}
					]}
					onPress={async () => {
						const response = await SecureStore.getItemAsync("events");
						if (response == null || response == "") Alert.alert("Calendar ©", "Não há dados a serem removidos.");
						else {
							Alert.alert(
								"Os dados serão removidos",
								"Quais eventos deseja remover?",
								[
									{text: "Nenhum"},
									{
										// Removendo todos os dados passados.
										text: "Passados",
										onPress: async () => {
											let data = [];
											const now = new Date();
											const response = await SecureStore.getItemAsync("events");
											if (response) {
												data = JSON.parse(response);
												if (data.filter(item => now.getTime() > new Date(item.finalDate).getTime()).length > 0) {
													let filteredData = data.filter(item => now.getTime() < new Date(item.finalDate).getTime());
													if (filteredData.length > 0) SecureStore.setItemAsync("events", JSON.stringify(filteredData));
													else SecureStore.setItemAsync("events", "");
													Alert.alert("Calendar ©", "Os eventos passados foram removidos!");
													navigation.dispatch(StackActions.replace("Main"));
												}
												else Alert.alert("Calendar ©", "Não há eventos passados salvos!");
											}
										},
									},
									{
										// Removendo todos os dados salvos.
										text: "Todos",
										onPress: async () => {
											SecureStore.setItemAsync("events", "");
											Alert.alert("Calendar ©", "Todos os eventos foram removidos!");
											navigation.dispatch(StackActions.replace("Main"));
										},
									},
								]
							);
						}
					}}>
					<Text style={styles.buttonText}> Remover dados </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.dispatch(StackActions.replace("Form"))}>
					<Text style={styles.buttonText}> Adicionar evento </Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default Main;
const styles = StyleSheet.create({
	subtitle: {
		marginBottom: 12,
		borderBottomWidth: 1.2,
		width: Dimensions.get("window").width - 80,
		alignSelf: "center",
	},
	
	subtitleText: {
		fontSize: 22,
		marginTop: 16,
		color: "black",
	},
	
	image: {
		height: 50,
		width: 50,
	},
	
	label: {
		marginLeft: 6,
		color: "white",
	},
	
	button: {
		padding: 10,
		borderRadius: 10,
		alignItems: "center",
		backgroundColor: global.headerBackgroundColor,
		width: (Dimensions.get("window").width / 2) - 25,
	},
	
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
}); 