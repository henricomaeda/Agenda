import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {Platform} from 'react-native';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export const Notification = (title, body) => {
	// Chamando o construtor.
	const constructor = () => {
		defineSettings();
		sendNotification();
	}
	
	// Definindo as configurações e o token.
	const defineSettings = async () => {
		if (Platform.OS == "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
		
		if (Device.isDevice) {
			const {status: existingStatus} = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			
			if (existingStatus != "granted") {
				const {status} = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			
			if (finalStatus != "granted") return;
			console.log((await Notifications.getExpoPushTokenAsync()).data);
		}
	};
	
	// Caminhando a notificação.
	const sendNotification = async () => {
		await Notifications.scheduleNotificationAsync({
			trigger: {seconds: 2},
			content: {
				title: title,
				body: body,
			},
		});
	};
	
	constructor();
};