import React, { Component } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	View,
	ModalRoot,
	ModalPage,
	ModalCard,
	platform,
	ScreenSpinner,
	Slider,
	Input,
	ANDROID,
	IOS,
	ModalPageHeader,
	PanelHeaderButton,
	Group, Div, Button, List, Cell, Panel
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {Icon24Cancel, Icon24Done} from '@vkontakte/icons/dist/28/settings_outline';
import Home from './panels/Home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Icon24Shuffle from "@vkontakte/icons/dist/24/shuffle";
import {IconFire} from "./components/icons/fire/IconFire";
import {SoundEffectView} from "./components/soundEffectView";
import {IconRain} from "./components/icons/rain/IconRain";
import {IconWind} from "./components/icons/wind/IconWind";
import {IconLeaves} from "./components/icons/leaves/IconLeaves";
import {IconBirds} from "./components/icons/birds/IconBirds";
import {IconWaves} from "./components/icons/waves/IconWaves";

Amplify.configure(awsconfig);

const APP_ID = 7595020;
const MILLISECONDS_IN_MINUTE = 60000;

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
			platform: platform(),
			soundSettings: {
				fire: 0,
				rain: 0,
				wind: 0,
				birds: 0,
				waves: 0,
				leaves: 0
			}
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

	share() {
		bridge.send("VKWebAppShowWallPostBox", {
			"message": `Я хорошо помедитировал${this.state.user.sex === 1 ? 'ла' : ''}, используя приложение 'Таймер для Медитации'. Попробуй и ты https://vk.com/app7595020`
		});
	}

	bridgeEventManager(response) {
		switch (response.detail.type) {
			case 'VKWebAppUpdateConfig':
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = response.detail.data.scheme ? response.detail.data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
				break
			case 'VKWebAppGetAuthTokenResult':
				this.setState({token: response.detail.token});
				break
			case 'VKWebAppCallAPIMethodResult':
				this.state.callback(response.detail.data);
		}
	}

	openOptions() {
		this.setState({
			backupSeetings: this.state.soundSettings,
			activePanel: 'settings'
		})
	}

	go(e) {
		this.setState({activePanel: e.currentTarget.dataset.to});
	};

	handleSoundChange(name, value) {
		const newSettings = this.state.soundSettings;
		newSettings.name = value;
		this.setState({soundSettings: newSettings});
	}

	cancelSoundChanges() {
		this.setState({soundSettings: this.state.backupSeetings});
	}

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
								duration: this.state.durationBuffer * MILLISECONDS_IN_MINUTE,
								activeModal: null
							});
						}
					}]}
				>
				</ModalCard>
				<ModalPage
					id='audioSettings'
					header={
						<ModalPageHeader
							left={platform() === ANDROID && <PanelHeaderButton onClick={this.cancelSoundChanges}><Icon24Cancel /></PanelHeaderButton>}
							right={<PanelHeaderButton onClick={() => {
								this.setState({activeModal: null})
							}}>{platform() === IOS ? 'Готово' : <Icon24Done />}</PanelHeaderButton>}
						>
							Фоновая музыка
						</ModalPageHeader>
					}
				>
					<Group>
						<Div className="header">
							<Button className="header__shuffle"
									onClick={this.shuffle}
									level="1"
									before={<Icon24Shuffle/>}
									size="l"
							>Случайный набор</Button>
						</Div>
					</Group>
					<Group title="Звуки">
						<List>
							<Cell
								before={<IconFire color={this.state.fire ? 'black' : 'gray'}
												  size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/fire.mp3'}
												 onChange={this.handleSoundChange}
												 name="fire" value={this.state.fire}/>
							</Cell>
							<Cell
								before={<IconRain color={this.state.rain ? 'black' : 'gray'}
												  size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/rain.mp3'}
												 onChange={this.handleSoundChange}
												 name="rain" value={this.state.rain}/>
							</Cell>
							<Cell
								before={<IconWind color={this.state.wind ? 'black' : 'gray'}
												  size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/wind.mp3'}
												 onChange={this.handleSoundChange}
												 name="wind" value={this.state.wind}/>
							</Cell>
							<Cell
								before={<IconLeaves
									color={this.state.leaves ? 'black' : 'gray'}
									size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/leaves.mp3'}
												 onChange={this.handleSoundChange}
												 name="leaves" value={this.state.leaves}/>
							</Cell>
							<Cell
								before={<IconBirds color={this.state.birds ? 'black' : 'gray'}
												   size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/birds.mp3'}
												 onChange={this.handleSoundChange}
												 name="birds" value={this.state.birds}/>
							</Cell>
							<Cell
								before={<IconWaves color={this.state.waves ? 'black' : 'gray'}
												   size={32}/>}>
								<SoundEffectView url={process.env.PUBLIC_URL + '/samples/waves.mp3'}
												 onChange={this.handleSoundChange}
												 name="waves" value={this.state.waves}/>
							</Cell>
						</List>
					</Group>
				</ModalPage>
			</ModalRoot>
		);

		return (
			<View modal={modal} activePanel={this.state.activePanel} popout={this.state.Popout}>
				<Home
					id='home'
					fetchedUser={this.state.user}
					duration={this.state.duration}
					share={this.share.bind(this)}
					showInput={() => {
						this.setState({activeModal: 'timeInputTest'})
					}}
					go={this.openOptions.bind(this)} />
			</View>
		);
	}
}

export default App;

