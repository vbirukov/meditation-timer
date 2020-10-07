import React, { Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ModalRoot, ModalCard, platform, ScreenSpinner, Slider, Input, ANDROID, IOS} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const APP_ID = 7595020;
const MILISECONDS_IN_MINUTE = 60000;

class App extends Component {

	constructor(props) {
		super(props);

		this.state = App.getInitState();
	}



	static getInitState() {
		return {
			Popout: <ScreenSpinner size='large' />,
			activePanel: 'home',
			activeModal: null,
			duration: 0,
			platform: platform()
		};
	}

	componentDidMount() {
		bridge.subscribe((response) => {this.bridgeEventManager(response)});
		this.fetchUser().then(() => {
			this.setState({Popout: null})
		});
	}

	fetchUser = async function() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		this.setState({user});
		bridge.send("VKWebAppGetAuthToken", {"app_id": APP_ID, "scope": "friends"})
			.then((response) => {
				this.setState({token: response.access_token});
			}).catch((e) => {
			console.log(`error: ${e} `)
		});
	}

	handleChange(event) {
		this.setState({durationBuffer: parseInt(event.target.value)});
	}

	bridgeEventManager(response) {
		if (response.detail.type === 'VKWebAppUpdateConfig') {
			const schemeAttribute = document.createAttribute('scheme');
			schemeAttribute.value = response.detail.data.scheme ? response.detail.data.scheme : 'client_light';
			document.body.attributes.setNamedItem(schemeAttribute);
		}
		if (response.detail.type === 'VKWebAppGetAuthTokenResult') {
			this.setState({token: response.detail.token});
			console.log(`token set: ${this.state.token}`);
		}
		if (response.detail.type === 'VKWebAppCallAPIMethodResult') {
			this.state.callback(response.detail.data);
		}
	}


	go(e) {
		this.setState({activePanel: e.currentTarget.dataset.to});
	};

	render() {

		const modal = (
			<ModalRoot activeModal={this.state.activeModal}>
				<ModalCard
					id='timeInputTest'
					onClose={() => this.setState({
						activeModal: null
					})}
					header="Установите желаемую длительность"
					caption="в минутах"
					actions={[{
						title: 'Установить',
						mode: 'primary',
						action: () => {
							this.setState({
								duration: this.state.durationBuffer * MILISECONDS_IN_MINUTE,
								activeModal: null
							});
						}
					}]}
				>
					{
						platform() === ANDROID || platform() === IOS ?
						<Slider
							min={1}
							max={90}
							value={this.state.durationBuffer}
							onChange={(durationBuffer) => {
								this.setState({durationBuffer})
							}}
							step={1}
							top="Simple [1, 90]"
						/> : null
					}
					<Input value={String(this.state.durationBuffer)} onChange={e => this.setState({ durationBuffer: e.target.value })} type="number"/>
				</ModalCard>
			</ModalRoot>
		);

		return (
			<View modal={modal} activePanel={this.state.activePanel} popout={this.state.Popout}>
				<Home
					id='home'
					fetchedUser={this.state.user}
					duration={this.state.duration}
					showInput={() => {
						this.setState({activeModal: 'timeInputTest'})
					}}
					go={this.go} />
			</View>
		);
	}
}

export default App;

