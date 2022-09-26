import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {StackActions} from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import {useState, useEffect} from 'react';
import "../Globals";
import {
	Text,
	View,
	Alert,
	Switch,
	TextInput,
	Dimensions,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';

const Form = ({navigation}) => {
	// Definindo variáveis de dados do formulário.
	const [name, setName] = useState(null);
	const [place, setPlace] = useState(null);
	const [date, setDate] = useState(null);
	const [initialTime, setInitialTime] = useState(null);
	const [finalTime, setFinalTime] = useState(null);
	const [category, setCategory] = useState("Lembrete");
	const [description, setDescription] = useState(null);
	const [allDay, setAllDay] = useState(false);
	const [annually, setAnnually] = useState(false);
	const [required, setRequired] = useState(false);
	
	// Definindo variáveis de caixa combo.
	const [cmbOpen, setCmbOpen]=useState(false);
	const [cmbItems, setCmbItems]=useState([
		{label: "Lembrete", value: "Lembrete"},
		{label: "Evento", value: "Evento"},
		{label: "Aniversário", value: "Aniversário"},
		{label: "Trabalho", value: "Trabalho"},
		{label: "Acadêmico", value: "Acadêmico"},
		{label: "Relacionamento", value: "Relacionamento"},
		{label: "Medicina", value: "Medicina"},
	]);
	
	// Definindo variável de meses.
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
	
	// Definindo variáveis de calendário.
	const [dtpInitialDate, setDtpInitialDate] = useState(new Date());
	const [dtpInitialShow, setDtpInitialShow] = useState(false);
	const [dtpFinalDate, setDtpFinalDate] = useState(new Date());
	const [dtpFinalShow, setDtpFinalShow] = useState(false);
	const [dtpMode, setDtpMode] = useState(null);
	
	// Definindo o construtor do componente.
	useEffect(() => {
		if (global.id == -1) reset();
		else reset(false);
	}, []); // eslint-disable-line
	
	const showMode = (initial, mode) => {
		if (initial) setDtpInitialShow(true);
		else setDtpFinalShow(true);
		setDtpMode(mode);
	};
	
	const dtpInitialChange = (event, selectedDate) => {
		setDtpInitialShow(false);
		if (dtpMode == 'time') {
			var day = dtpInitialDate.getDate();
			var month = dtpInitialDate.getMonth() + 1;
			var year = dtpInitialDate.getFullYear();
			var hours = selectedDate.getHours();
			var minutes = selectedDate.getMinutes();
			
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			if (hours < 10) hours = '0' + hours;
			if (minutes < 10) minutes = '0' + minutes;
			
			const tempDate = new Date(year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ":00-03:00");
			setDtpInitialDate(tempDate);
			setInitialTime(hours + ':' + minutes);
			
			if (tempDate >= dtpFinalDate) {
				setDtpFinalDate(tempDate);
				setFinalTime(hours + ':' + minutes);
			}
		}
		else {
			day = selectedDate.getDate();
			month = selectedDate.getMonth() + 1;
			year = selectedDate.getFullYear();
			var initialHours = dtpInitialDate.getHours();
			var initialMinutes = dtpInitialDate.getMinutes();
			var finalMinutes = dtpFinalDate.getMinutes();
			var finalHours = dtpFinalDate.getHours();
			
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			if (initialHours < 10) initialHours = '0' + initialHours;
			if (initialMinutes < 10) initialMinutes = '0' + initialMinutes;
			if (finalMinutes < 10) finalMinutes = '0' + finalMinutes;
			if (finalHours < 10) finalHours = '0' + finalHours;
			
			let tempDate = year + '-' + month + '-' + day + 'T' + initialHours + ':' + initialMinutes + ":00-03:00";
			setDtpInitialDate(new Date(tempDate));
			
			tempDate = year + '-' + month + '-' + day + 'T' + finalHours + ':' + finalMinutes + ":00-03:00";
			setDtpFinalDate(new Date(tempDate));
			setDate(day + '/' + months[month - 1] + '/' + year);
		}
	};
	
	const dtpFinalChange = (event, selectedDate) => {
		setDtpFinalShow(false);
		if (dtpMode == 'time') {
			var day = dtpFinalDate.getDate();
			var month = dtpFinalDate.getMonth() + 1;
			var year = dtpFinalDate.getFullYear();
			var hours = selectedDate.getHours();
			var minutes = selectedDate.getMinutes();
			
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			if (hours < 10) hours = '0' + hours;
			if (minutes < 10) minutes = '0' + minutes;
			
			const tempDate = new Date(year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ":00-03:00");
			if (tempDate >= dtpInitialDate) {
				setDtpFinalDate(tempDate);
				setFinalTime(hours + ':' + minutes);
			}
			else {
				setDtpFinalDate(dtpInitialDate);
				
				hours = dtpInitialDate.getHours();
				minutes = dtpInitialDate.getMinutes();
				
				if (hours < 10) hours = '0' + hours;
				if (minutes < 10) minutes = '0' + minutes;
				
				setFinalTime(hours + ':' + minutes);
			}
		}
	};
	
	const reset = async (resetting = true) => {
		setCmbOpen(false);
		if (resetting) {
			setName('');
			setPlace('');
			setDescription('');
			setCategory("Lembrete");
			
			const tempDate = new Date();
			setDtpInitialDate(tempDate);
			setDtpFinalDate(tempDate);
			setAnnually(false);
			setAllDay(false);
			
			var day = tempDate.getDate();
			var month = tempDate.getMonth() + 1;
			var year = tempDate.getFullYear();
			var hours = tempDate.getHours();
			var minutes = tempDate.getMinutes();
			
			if (day < 10) day = '0' + day;
			if (month < 10) month = '0' + month;
			if (hours < 10) hours = '0' + hours;
			if (minutes < 10) minutes = '0' + minutes;
			
			setDate(day + '/' + months[month - 1] + '/' + year);
			setInitialTime(hours + ':' + minutes);
			setFinalTime(hours + ':' + minutes);
		}
		else {
			// Criando objeto de dados.
			let temporaryEvents = [];
			
			// Convertendo cadeia de caracteres JSON em um objeto JavaScript.
			const response = await SecureStore.getItemAsync("events");
			if (response) temporaryEvents = JSON.parse(response);
			
			temporaryEvents.map((item) => {
				if (item.id == global.id) {
					setName(item.name);
					setAllDay(item.allDay);
					setAnnually(item.annually);
					setCategory(item.category);

					if (item.place != "Não definido.") setPlace(item.place);
					if (item.description != "Não definido.") setDescription(item.description);
					
					let tempDate = new Date(item.initialDate);
					setDtpInitialDate(tempDate);
					
					var day = tempDate.getDate();
					var month = tempDate.getMonth() + 1;
					var year = tempDate.getFullYear();
					var hours = tempDate.getHours();
					var minutes = tempDate.getMinutes();
					
					if (day < 10) day = '0' + day;
					if (month < 10) month = '0' + month;
					if (hours < 10) hours = '0' + hours;
					if (minutes < 10) minutes = '0' + minutes;
					
					setDate(day + '/' + months[month - 1] + '/' + year);
					setInitialTime(hours + ':' + minutes);

					tempDate = new Date(item.finalDate);
					setDtpFinalDate(tempDate);
					
					day = tempDate.getDate();
					month = tempDate.getMonth() + 1;
					year = tempDate.getFullYear();
					hours = tempDate.getHours();
					minutes = tempDate.getMinutes();
					
					if (day < 10) day = '0' + day;
					if (month < 10) month = '0' + month;
					if (hours < 10) hours = '0' + hours;
					if (minutes < 10) minutes = '0' + minutes;

					setFinalTime(hours + ':' + minutes);
				}
			})
		}
	};
	
	const create = async (creating = true) => {
		setCmbOpen(false);
		if (name.trim().length == 0) setRequired(true);
		else {
			// Criando objeto de dados.
			let temporaryEvents = [];
			setRequired(false);
			
			// Convertendo cadeia de caracteres JSON em um objeto JavaScript.
			const response = await SecureStore.getItemAsync("events");
			if (response) temporaryEvents = JSON.parse(response);
			
			// Criando função de finalização.
			const done = async () => {
				// Salvando e atualizando dados.
				SecureStore.setItemAsync("events", JSON.stringify(temporaryEvents));
				
				// Enviando resposta ao usuário.
				if (creating) Alert.alert(name, "O evento foi adicionado!");
				else Alert.alert(name, "O evento foi atualizado!");
				
				// Atualizando controle de imagem.
				navigation.popToTop();
				navigation.dispatch(StackActions.replace("Main"));
			}
			
			if (creating) {
				// Adicionando um evento.
				temporaryEvents.push({
					id: temporaryEvents.length,
					name: name,
					place: place.trim().length == 0 ? "Não definido." : place,
					initialDate: dtpInitialDate,
					finalDate: dtpFinalDate,
					description: description.trim().length == 0 ? "Não definido." : description,
					category: category,
					allDay: allDay,
					annually: annually,
				});
				
				// Finalizando.
				done();
			}
			else {
				Alert.alert(
					"Os dados serão atualizados",
					"Você deseja mesmo alterá-los?",
					[
						{text: "Cancelar"},
						{
							text: "Atualizar",
							onPress: () => {
								// Atualizando os dados do evento.
								temporaryEvents = temporaryEvents.map(itens => (
									itens.id == global.id ? {
										...itens,
										name: name,
										place: (place == null || place.trim().length == 0) ? "Não definido." : place,
										initialDate: dtpInitialDate,
										finalDate: dtpFinalDate,
										description: (description == null || description.trim().length == 0) ? "Não definido." : description,
										category: category,
										allDay: allDay,
										annually: annually,
									} : itens
								));
								
								// Finalizando.
								done();
							},
						},
					]
				);
			}
		}
	};
	
	return (
		<ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: "center"}}>
			<View style={{margin: 30}}>
				<Text> Nome do evento ou lembrete </Text>
				<TextInput
					style={styles.input}
					placeholder="Entre com o nome do evento"
					onChangeText={(text) => setName(text)}
					value={name}
				/>
				{required ? (
					<Text
						style={{
							marginBottom: 10,
							marginTop: -8,
							marginLeft: 6,
							color: "red",
						}}>
						Campo obrigatório.
					</Text>
				) : null}
				<Text> Endereço ou localidade </Text>
				<TextInput
					style={styles.input}
					placeholder="Entre com o endereço do evento"
					onChangeText={(text) => setPlace(text)}
					value={place}
				/>
				<View style={{flexDirection: "row"}}>
					<View>
						<Text> Data do evento </Text>
						<TouchableOpacity
							style={[
								styles.input,
								{
									width: ((Dimensions.get("window").width / 3) + 50) - 2,
									alignItems: "center",
								}
							]}
							onPress={() => showMode(true, "date")}>
							<Text> {date} </Text>
						</TouchableOpacity>
					</View>
					<View>
						<Text style={{marginLeft: 6}}> Início </Text>
						<TouchableOpacity
							style={[
								styles.input,
								{
									marginLeft: 6,
									width: (Dimensions.get("window").width / 3) - 60,
									alignItems: "center",
								},
							]}
							onPress={() => !allDay && showMode(true, "time")}>
							<Text> {initialTime} </Text>
						</TouchableOpacity>
					</View>
					<View>
						<Text style={{marginLeft: 6}}> Término </Text>
						<TouchableOpacity
							style={[
								styles.input,
								{
									marginLeft: 6,
									width: (Dimensions.get("window").width / 3) - 60,
									alignItems: "center",
								},
							]}
							onPress={() => !allDay && showMode(false, "time")}>
							<Text> {finalTime} </Text>
						</TouchableOpacity>
					</View>
				</View>
				<Text> Categoria </Text>
				<DropDownPicker
					style={styles.input}
					textStyle={{color: "black"}}
					dropDownContainerStyle={styles.input}
					placeholder="Entre com uma categoria"
					open={cmbOpen}
					value={category}
					items={cmbItems}
					setOpen={setCmbOpen}
					setValue={setCategory}
					setItems={setCmbItems}
					theme='DARK'
				/>
				<Text> Descrição </Text>
				<TextInput
					style={[styles.input, {textAlignVertical: 'top'}]}
					multiline={true}
					numberOfLines={6}
					placeholder="Entre com a descrição do evento"
					onChangeText={(text) => setDescription(text)}
					value={description}
				/>
				<View style={styles.buttonSwitch}>
					<Switch
						thumbColor={global.toggleColor}
						trackColor={{
							false: global.offSwitchBackground,
							true: global.onSwitchBackground,
						}}
						onValueChange={() => {
							setAllDay(!allDay);
							setCmbOpen(false);
							
							if (!allDay) {
								var day = dtpInitialDate.getDate();
								var month = dtpInitialDate.getMonth() + 1;
								var year = dtpInitialDate.getFullYear();
								
								if (day < 10) day = '0' + day;
								if (month < 10) month = '0' + month;
								
								let tempDate = new Date(year + '-' + month + '-' + day + "T00:00:00-03:00");
								setDtpInitialDate(tempDate);
								setInitialTime("00:00");
								
								day = dtpFinalDate.getDate();
								month = dtpFinalDate.getMonth() + 1;
								year = dtpFinalDate.getFullYear();
								
								if (day < 10) day = '0' + day;
								if (month < 10) month = '0' + month;
								
								tempDate = new Date(year + '-' + month + '-' + day + "T23:59:00-03:00");
								setDtpFinalDate(tempDate);
								setFinalTime("23:59");
							}
						}}
						style={styles.switch}
						value={allDay}
					/>
					<Text> Dia inteiro </Text>
				</View>
				<View style={styles.buttonSwitch}>
					<Switch
						thumbColor={global.toggleColor}
						trackColor={{
							false: global.offSwitchBackground,
							true: global.onSwitchBackground,
						}}
						onValueChange={() => {
							setAnnually(!annually);
							setCmbOpen(false);
						}}
						style={styles.switch}
						value={annually}
					/>
					<Text> Repetir anualmente </Text>
				</View>
				<View style={{flexDirection: "row"}}>
					<TouchableOpacity
						style={[
							styles.button,
							{
								marginRight: 6,
								backgroundColor: "#646085",
							},
						]}
						onPress={() => navigation.dispatch(StackActions.replace("Main"))}>
						<Text style={styles.buttonText}> Retornar </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.button,
							{
								marginRight: 6,
								backgroundColor: "#53506e",
							},
						]}
						onPress={() => reset()}>
						<Text style={styles.buttonText}> Resetar </Text>
					</TouchableOpacity>
					{global.id == -1 ? (
						<TouchableOpacity
							style={styles.button}
							onPress={() => create()}>
							<Text style={styles.buttonText}>
								Adicionar
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={styles.button}
							onPress={() => create(false)}>
							<Text style={styles.buttonText}>
								Atualizar
							</Text>
						</TouchableOpacity>
					)}
				</View>
				{dtpInitialShow && (
					<DateTimePicker
						testID="dateTimePicker"
						value={dtpInitialDate}
						mode={dtpMode}
						is24Hour={true}
						display="default"
						onChange={dtpInitialChange}
					/>
				)}
				{dtpFinalShow && (
					<DateTimePicker
						testID="dateTimePicker"
						value={dtpFinalDate}
						mode={dtpMode}
						is24Hour={true}
						display="default"
						onChange={dtpFinalChange}
					/>
				)}
			</View>
		</ScrollView>
	);
};

export default Form;
const styles = StyleSheet.create({
	input: {
		width: Dimensions.get("window").width - 60,
		padding: 6,
		color: "gray",
		borderWidth: 2,
		borderRadius: 6,
		marginBottom: 10,
		backgroundColor: "white",
		borderColor: global.headerBackgroundColor,
	},
	
	buttonSwitch: {
		flexDirection: "row",
		marginLeft: 6,
		marginTop: 6,
	},
	
	switch: {
		transform: [
			{scaleX: 1.6},
			{scaleY: 1.5},
		],
		marginTop: -14.2,
		marginRight: 10,
	},
	
	button: {
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
		backgroundColor: global.headerBackgroundColor,
		width: (Dimensions.get("window").width / 3) - 24,
	},
	
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});