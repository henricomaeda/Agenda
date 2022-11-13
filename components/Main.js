import {pushNotification, cancelNotifications} from "../Notification";
import {StackActions} from "@react-navigation/native";
import {useState, useEffect, useRef} from "react";
import * as SecureStore from "expo-secure-store";
import {
	Text,
	View,
	Image,
	Alert,
	Switch,
	FlatList,
	StyleSheet,
	ScrollView,
	Dimensions,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";

const Main = ({navigation}) => {
	// Definindo variáveis de objeto.
	const [today, setToday] = useState([]);
	const [tomorrow, setTomorrow] = useState([]);
	const [later, setLater] = useState([]);
	const [past, setPast] = useState([]);
	
	const [holidays, setHolidays] = useState(true);
	const [holidayName, setHolidayName] = useState("Nenhum.");
	
	const [todayView, setTodayView] = useState(true);
	const [tomorrowView, setTomorrowView] = useState(true);
	const [laterView, setLaterView] = useState(true);
	const [pastView, setPastView] = useState(true);
	const [scrollBtnView, setScrollBtnView] = useState(false);
	
	// Definindo variável de carregamento e meses.
	const [loading, setLoading] = useState(0);
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
		seeHolidays();
		fetchData();
	}, []); // eslint-disable-line
	
	// Definindo função para retornar data.
	const getFormatedDate = (date, tomorrow = false) => {
		const tempDate = new Date(date);
		
		var day = tempDate.getDate();
		var month = tempDate.getMonth();
		var year = tempDate.getFullYear();
		
		if (tomorrow) day++;
		if (day < 10) day = "0" + day;
		if (month < 10) month = "0" + month;
		
		return new Date(year, month, day);
	}
	
	// Verificar se o usuário deseja visualizar os feriados nacionais.
	const seeHolidays = async (edit = false, view = true) => {
		if (edit) {
			setHolidays(view);
			if (view) SecureStore.setItemAsync("seeHolidays", "Visualizar");
			else SecureStore.setItemAsync("seeHolidays", "");
			navigation.dispatch(StackActions.replace("Main"));
		}
		else {
			const response = await SecureStore.getItemAsync("seeHolidays");
			if (response == null || response == "") setHolidays(false);
		}
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
					
					if (day < 10) day = "0" + day;
					if (month < 10) month = "0" + month;
					if (hours < 10) hours = "0" + hours;
					if (minutes < 10) minutes = "0" + minutes;
					
					return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00-03:00";
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
	
	// Enviando dados para a requisição.
	const fetchData = async () => {
		try {
			// Criando objeto e ordenando.
			let data = [];
			sortData();
			
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
			
			// Convertendo cadeia de caracteres JSON em um objeto JavaScript.
			const response = await SecureStore.getItemAsync("events");
			if (response) data = JSON.parse(response);
			
			// Recebendo feriados nacionais.
			const seeNationalHolidays = await SecureStore.getItemAsync("seeHolidays");
			if (seeNationalHolidays != null && seeNationalHolidays == "Visualizar") {
				const getDate = (date, finalDate = false) => {
					var day = date.getDate() + 1;
					var month = date.getMonth() + 1;
					var year = date.getFullYear();
					var hours = "00";
					var minutes = "00";
					
					if (day < 10) day = "0" + day;
					if (month < 10) month = "0" + month;
					if (finalDate) {
						hours = "23";
						minutes = "59";
					}
					
					const new_date = new Date(year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00-03:00");
					return new_date;
				}
				
				let today = getDate(new Date());
				const API_URL = "https://brasilapi.com.br/api/feriados/v1/" + today.getFullYear();
				const response = await fetch(API_URL);
				if (response) {
					const national = await response.json();
					national.map((item) => {
						const national_initialDate = getDate(new Date(item.date));
						const national_finalDate = getDate(new Date(item.date), true);
						if (today.getTime() <= national_finalDate.getTime()) {
							data.push({
								id: -1,
								name: item.name,
								place: "Não definido.",
								initialDate: national_initialDate,
								finalDate: national_finalDate,
								description: "Feriado nacional.",
								category: "Feriado",
								allDay: false,
								annually: false,
							});
						}
					});
					
					data = data.sort(
						(objA, objB) => Number(new Date(objA.initialDate)) - Number(new Date(objB.initialDate)),
					);
				}
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
			
			setLoading(1);
			fetchNotifications();
		}
		catch (exception) {
			console.error("ERRO: " + exception);
		}
	}
	
	const fetchNotifications = async () => {
		try {
			// Definindo mapeamento.
			const addNotifications = async () => {
				const response = await SecureStore.getItemAsync("events");
				if (response) {
					const data = JSON.parse(response);
					if (data.length > 0) {
						data.map((event) => {
							const date = new Date(event.initialDate);
							if (date.getTime() >= new Date().getTime()) {
								const title = "Agenda";
								const body = event.name + " está acontecendo agora!";
								
								pushNotification(title, body, date);
							}
						});
					}
				}
			}
			
			// Definindo notificações.
			cancelNotifications();
			addNotifications();
			setLoading(2);
			
			// Exibindo interface ao usuário.
			const delay = ms => new Promise(res => setTimeout(res, ms));
			await delay(1200);
			setLoading(3);
		}
		catch (exception) {
			console.error("ERRO: " + exception);
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
		
		if (d < 10) d = "0" + d;
		if (h < 10) h = "0" + h;
		if (min < 10) min = "0" + min;
		
		const formatedDate = d + "/" + m + "/" + y;
		const formatedTime = h + ":" + min;
		
		if (mode == "date") return formatedDate;
		else if (mode == "time") return formatedTime;
	}
	
	// Selecionando evento para a alteração.
	const selectEvent = (selectedEvent) => {
		if (selectedEvent.id > -1) {
			// Definindo o id selecionado.
			global.id = selectedEvent.id;
			
			// Exibindo formulário ao usuário.
			navigation.navigate("Form");
		}
	}
	
	// Verificando se há feriado nacional.
	const nationalDay = () => {
		if (today.length > 0) {
			today.map((item) => {
				if (item.category == "Feriado") {
					setHolidayName(item.name);
					return true;
				}
			});
		}
		else return false;
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
		
		let show = false;
		if (data.length <= 0) return (
			<Text style={{fontSize: 14.6, marginBottom: 10, marginLeft: 20, color: "#6aa374"}}>
				Não há eventos ou lembretes
				{
					data == today ? " para hoje."
					: data == tomorrow ? " para amanhã."
					: data == later ? " para depois."
					: " passados."
				}
			</Text>
		)
		else if (data == today && todayView) show = true;
		else if (data == tomorrow && tomorrowView) show = true;
		else if (data == later && laterView) show = true;
		else if (data == past && pastView) show = true;
		
		if (!show) return (
			<Text
				style={{
					fontSize: 14.6,
					marginLeft: 20,
					color: "#806aa3",
					marginBottom: 10,
				}}>
				Os eventos estão escondidos.
			</Text>
		);
		else return (
			<FlatList
				data={data}
				style={{flex: 0}}
				renderItem={({item}) => (
					<TouchableOpacity onPress={() => selectEvent(item)}>
						<View
							style={{
								marginBottom: 10,
								borderWidth: 1.6,
								borderRadius: 20,
								paddingHorizontal: 10,
								backgroundColor: getBGColor(item),
								width: Dimensions.get("window").width - 40,
							}}>
							<Text
								style={{
									fontWeight: "bold",
									paddingLeft: 8,
									color: "white",
									marginTop: 8,
									fontSize: 20,
								}}>
								{item.name}
							</Text>
							<Text
								style={{
									fontSize: 10,
									color: "white",
									paddingLeft: 8,
									marginBottom: 4,
								}}>
								{item.category}
							</Text>
							<View style={{flexDirection: "row"}}>
								<View
									style={{
										marginLeft: 4,
										marginRight: 6,
										borderRadius: 8,
										borderWidth: 1.2,
										borderColor: "#1f3447",
										backgroundColor: getBGColor(item, true),
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
												source={require("../assets/icons/Reminder.png")}
											/>
										) : item.category == "Evento" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Event.png")}
											/>
										) : item.category == "Aniversário" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Birthday.png")}
											/>
										) : item.category == "Trabalho" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Work.png")}
											/>
										) : item.category == "Acadêmico" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Academic.png")}
											/>
										) : item.category == "Relacionamento" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Relationship.png")}
											/>
										) : item.category == "Medicina" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Medicine.png")}
											/>
										) : item.category == "Religião" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Religion.png")}
											/>
										) : item.category == "Feriado" ? (
											<Image
												style={styles.image}
												source={require("../assets/icons/Holiday.png")}
											/>
										) : null}
									</View>
								</View>
								<View style={{justifyContent: "center", borderColor: "#1f3447"}}>
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
									marginLeft: 10,
									marginTop: 10,
									flexWrap: "wrap",
								}}>
								<Text
									style={{
										fontWeight: "bold",
										marginRight: 37,
										color: "white",
										flex: 0,
									}}>
									Local:
								</Text>
								<Text style={{flex: 1, color: "white"}}>
									{item.place}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									marginBottom: 12,
									marginLeft: 10,
									flexWrap: "wrap",
								}}>
								<Text
									style={{
										fontWeight: "bold",
										marginRight: 8,
										color: "white",
										flex: 0,
									}}>
									Descrição:
								</Text>
								<Text style={{flex: 1, color: "white"}}>
									{item.description}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		);
	}
	
	const verifyPosition = (event: Object) => {
		if (event.nativeEvent.contentOffset.y > 60) setScrollBtnView(true);
		else setScrollBtnView(false);
	}
	
	const scrollRef = useRef();
	if (loading <= 2) return (
		<View style={{flex: 1, alignItems: "center"}}>
			<View style={{flex: 1, justifyContent: "center"}}>
				<View style={styles.loadingComponent}>
					{loading <= 0 ? (
						<ActivityIndicator size="large" color="#2c2b3b" />
					) : (
						<Image
							style={styles.loadingImage}
							source={require("../assets/icons/Verified.png")}
						/>
					)}
					<View style={{justifyContent: "center"}}>
						<Text style={styles.loadingText}>
							{
								loading <= 0
								? "Verificando dados..."
								: "Dados verificados com sucesso!"
							}
						</Text>
					</View>
				</View>
				<View style={styles.loadingComponent}>
					{loading <= 1 ? (
						<ActivityIndicator size="large" color="#2c2b3b" />
					) : (
						<Image
							style={styles.loadingImage}
							source={require("../assets/icons/Verified.png")}
						/>
					)}
					<View style={{justifyContent: "center"}}>
						<Text style={styles.loadingText}>
							{
								loading <= 1
								? "Agendando notificações..."
								: "Notificações agendadas com sucesso!"
							}
						</Text>
					</View>
				</View>
				<View style={styles.loadingComponent}>
					{loading <= 2 ? (
						<ActivityIndicator size="large" color="#2c2b3b" />
					) : (
						<Image
							style={styles.loadingImage}
							source={require("../assets/icons/Verified.png")}
						/>
					)}
					<View style={{justifyContent: "center"}}>
						<Text style={styles.loadingText}>
							{
								loading <= 2
								? "Carregando interface do usuário..."
								: "Interface carregada com sucesso!"
							}
						</Text>
					</View>
				</View>
			</View>
			<Text
				style={{
					flex: 0,
					fontSize: 16,
					marginBottom: 10,
					color: "#424059",
				}}>
				Aplicativo desenvolvido por <Text style={{fontWeight: "bold"}}>Henrico Maeda</Text>.
			</Text>
		</View>
	);
	else return (
		<View style={{flex: 1, padding: 20}}>
			<View style={{flex: 1}}>
				<ScrollView ref={scrollRef} contentContainerStyle={{flexGrow: 1}} onScroll={verifyPosition}>
					<View style={{marginBottom: 10}}>
						{nationalDay() && (
							<TouchableOpacity
								onPress={() => Alert.alert("Feriado nacional", holidayName + "\n" + holidayDate)}
								style={{
									padding: 10,
									marginBottom: 6.2,
									borderRadius: 26.2,
									backgroundColor: "#9793db",
								}}>
								<View
									style={{
										flexWrap: "wrap",
										flexDirection: "row",
									}}>
									<View
										style={{
											flex: 0,
											padding: 6,
											borderRadius: 22,
											alignSelf: "center",
											backgroundColor: "#e6e6ff",
										}}>
										<Image
											style={{
												width: Dimensions.get("window").width / 12,
												height: Dimensions.get("window").width / 12,
											}}
											source={require("../assets/icons/Holiday.png")}
										/>
									</View>
									<View style={{flex: 1, alignSelf: "center"}}>
										<Text
											style={{
												color: "white",
												alignSelf: "center",
												fontSize: Dimensions.get("window").width / 26.2,
											}}>
											Feriado nacional, não há compromissos!
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							onPress={() => navigation.dispatch(StackActions.replace("Main"))}
							style={{
								padding: 10,
								borderRadius: 26.2,
								backgroundColor: "#a9a7e8",
							}}>
							<View
								style={{
									flexWrap: "wrap",
									flexDirection: "row",
								}}>
								<View
									style={{
										flex: 0,
										borderRadius: 22,
										alignSelf: "center",
										backgroundColor: "#e6e6ff",
										padding: (Dimensions.get("window").width / 12) / 12.6,
									}}>
									<Image
										style={{
											width: Dimensions.get("window").width / 10.2,
											height: Dimensions.get("window").width / 10.2,
										}}
										source={require("../assets/icons/Support.png")}
									/>
								</View>
								<View style={{flex: 1, alignSelf: "center"}}>
									<Text
										style={{
											color: "white",
											alignSelf: "center",
											fontSize: Dimensions.get("window").width / 26.2,
										}}>
										Caso esteja desatualizado, aperte aqui.
									</Text>
								</View>
							</View>
						</TouchableOpacity>
						<View
							style={{
								marginTop: 10,
								alignSelf: "center",
								flexDirection: "row",
							}}>
							<Switch
								thumbColor={global.toggleColor}
								trackColor={{
									false: global.offSwitchBackground,
									true: global.onSwitchBackground,
								}}
								onValueChange={(view) => seeHolidays(true, view)}
								style={{
									marginLeft: holidays ? -10 : null,
									transform: [
										{scaleX: 1.6},
										{scaleY: 1.6},
									],
								}}
								value={holidays}
							/>
							<Text
								style={{
									alignSelf: "center",
									marginLeft: holidays ? 16 : 6,
									fontSize: Dimensions.get("window").width / 26.2,
								}}>
								Deseja visualizar feriados nacionais?
							</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => setTodayView(!todayView)}
						style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Hoje
						</Text>
						<View style={{flex: 1}}>
							<Image
								style={{
									marginTop: 12,
									marginRight: 10,
									alignSelf: "flex-end",
									width: Dimensions.get("window").width / 14.26,
									height: Dimensions.get("window").width / 14.26,
								}}
								source={
									! todayView
									? require("../assets/icons/Hidden.png")
									: require("../assets/icons/Visible.png")
								}
							/>
						</View>
					</TouchableOpacity>
					{showFlatList(today)}
					<TouchableOpacity
						onPress={() => setTomorrowView(!tomorrowView)}
						style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Amanhã
						</Text>
						<View style={{flex: 1}}>
							<Image
								style={{
									marginTop: 12,
									marginRight: 10,
									alignSelf: "flex-end",
									width: Dimensions.get("window").width / 14.26,
									height: Dimensions.get("window").width / 14.26,
								}}
								source={
									! tomorrowView
									? require("../assets/icons/Hidden.png")
									: require("../assets/icons/Visible.png")
								}
							/>
						</View>
					</TouchableOpacity>
					{showFlatList(tomorrow)}
					<TouchableOpacity
						onPress={() => setLaterView(!laterView)}
						style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Depois
						</Text>
						<View style={{flex: 1}}>
							<Image
								style={{
									marginTop: 12,
									marginRight: 10,
									alignSelf: "flex-end",
									width: Dimensions.get("window").width / 14.26,
									height: Dimensions.get("window").width / 14.26,
								}}
								source={
									! laterView
									? require("../assets/icons/Hidden.png")
									: require("../assets/icons/Visible.png")
								}
							/>
						</View>
					</TouchableOpacity>
					{showFlatList(later)}
					<TouchableOpacity
						onPress={() => setPastView(!pastView)}
						style={styles.subtitle}>
						<Text style={styles.subtitleText}>
							Passado
						</Text>
						<View style={{flex: 1}}>
							<Image
								style={{
									marginTop: 12,
									marginRight: 10,
									alignSelf: "flex-end",
									width: Dimensions.get("window").width / 14.26,
									height: Dimensions.get("window").width / 14.26,
								}}
								source={
									! pastView
									? require("../assets/icons/Hidden.png")
									: require("../assets/icons/Visible.png")
								}
							/>
						</View>
					</TouchableOpacity>
					{showFlatList(past)}
				</ScrollView>
			</View>
			<View style={styles.buttons}>
				{scrollBtnView && (
					<TouchableOpacity
						onPress={() => scrollRef.current?.scrollTo({y: 0, animated: true})}>
						<Image
							style={styles.buttonImage}
							source={require("../assets/icons/Scrollup.png")}
						/>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					onPress={async () => {
						const response = await SecureStore.getItemAsync("events");
						if (response == null || response == "") Alert.alert("Nenhum evento", "Não há dados a serem removidos.");
						else {
							Alert.alert(
								"Os dados serão removidos",
								"Feriados nacionais não inclusos.\nQuais eventos deseja remover?",
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
													Alert.alert("Eventos passados", "Os dados foram removidos!");
													navigation.dispatch(StackActions.replace("Main"));
												}
												else Alert.alert("Nenhum evento passado", "Não há dados a serem removidos.");
											}
										},
									},
									{
										// Removendo todos os dados salvos.
										text: "Todos",
										onPress: async () => {
											SecureStore.setItemAsync("events", "");
											Alert.alert("Todos os eventos", "Os dados foram removidos!");
											navigation.dispatch(StackActions.replace("Main"));
										},
									},
								]
							);
						}
					}}>
					<Image
						style={styles.buttonImage}
						source={require("../assets/icons/Trashcan.png")}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						global.id = -1;
						navigation.navigate("Form");
					}}>
					<Image
						style={styles.buttonImage}
						source={require("../assets/icons/Add.png")}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default Main;
const styles = StyleSheet.create({
	loadingComponent: {
		flexDirection: "row",
		margin: 10,
	},
	
	loadingImage: {
		width: Dimensions.get("window").width / 13.62,
		height: Dimensions.get("window").width / 13.62,
	},
	
	loadingText: {
		fontSize: (Dimensions.get("window").width / 6.60) / 3.60,
		color: "#424059",
		marginLeft: 10,
	},
	
	subtitle: {
		marginBottom: 12,
		alignSelf: "center",
		flexDirection: "row",
		borderBottomWidth: 1.2,
		width: Dimensions.get("window").width - 80,
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
	
	buttons: {
		flex: 0,
		right: 10,
		bottom: 10,
		position: "absolute",
	},
	
	buttonImage: {
		height: Dimensions.get("window").width / 8.2,
		width: Dimensions.get("window").width / 8.2,
		marginTop: 12,
	},
});