import React, { Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ModalRoot, ModalPage, ModalCard, ModalPageHeader, PanelHeaderButton, platform, ANDROID, IOS, ScreenSpinner, Slider} from '@vkontakte/vkui';
import {Icon24Cancel, Icon24Done} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';

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
			duration: 1,
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
				<ModalPage
					header={
						<ModalPageHeader
							left={this.state.platform === ANDROID && <PanelHeaderButton onClick={() => {
								this.setState({
									duration: 0,
									activeModal: null
								})
							}}><Icon24Cancel /></PanelHeaderButton>}
							right={<PanelHeaderButton onClick={() => {
								this.setState({
									duration: this.state.durationBuffer * MILISECONDS_IN_MINUTE,
									activeModal: null
								})
							}}>{this.state.platform === IOS ? 'Готово' : <Icon24Done />}</PanelHeaderButton>}
						>
							Установите длительность
						</ModalPageHeader>
					}
					id="timeInput">
					<Slider
						min={1}
						max={1000}
						value={Number(this.state.duration)}
						onChange={this.handleChange.bind(this)}
					/>
					<input type={'number'} onChange={this.handleChange.bind(this)}/>
				</ModalPage>

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
					<input type={'number'} onChange={this.handleChange.bind(this)}/>
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

