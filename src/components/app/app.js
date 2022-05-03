import React, { useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, platform, ScreenSpinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from '../../panels/home/home';
// import fetchUser from '../../api/reques';

// 84 strings
// TODO: УБрать APP_ID в Env
// TODO: Добавить возможность создавать промежуточные сигналыъ
// TODO: ДОбавить звуковое сопровождение
// TODO: Поправить баг с конпкой reset

const MILISECONDS_IN_MINUTE = 60000;

const initialState = {
	Popout: <ScreenSpinner size='large' />,
	activePanel: 'home',
	activeModal: null,
	platform: platform()
};

function App() {

	const [state, setState] = useState(initialState);
	const [vkResponse, setVkResponse] = useState();

	useEffect(() => {
		bridge.subscribe((response) => {bridgeEventManager(response)});
		fetchUser().then(() => {
			setState({...state, Popout: null})
		});
	}, []);

	// todo: move to api
	const APP_ID = 7595020;
	const fetchUser = async function() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		setState({...state, user});
		bridge.send("VKWebAppGetAuthToken", {"app_id": APP_ID, "scope": "friends"})
			.then((response) => {
				setState({...state, token: response.access_token});
			}).catch((e) => {
			console.log(`error: ${e} `)
		});
	}

	const bridgeEventManager = (response) => {
		if (response.detail.type === 'VKWebAppUpdateConfig') {
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = response.detail.data.scheme ? response.detail.data.scheme : 'client_light';
			document.body.attributes.setNamedItem(schemeAttribute);
		}
		if (response.detail.type === 'VKWebAppGetAuthTokenResult') {
			setState({...state, token: response.detail.token});
			console.log(`token set: ${state.token}`);
		}
		if (response.detail.type === 'VKWebAppCallAPIMethodResult') {
			setVkResponse(response.detail.data)
		}
	}

	const goToPanel = (e) => {
		setState({...state, activePanel: e.currentTarget.dataset.to});
	};

	return (
		// todo: add props modal={modal}
		<View  activePanel={state.activePanel} popout={state.Popout}>
			<Home
				id='home'
				fetchedUser={state.user}
				duration={state.duration}
				showInput={() => {
					setState({...initialState, activeModal: 'timeInputTest'})
				}}
				go={goToPanel} />
		</View>
	);
}

export default App;