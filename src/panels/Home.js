import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Touch} from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import audiolib from '../lib/audio';
import TimeView from '../lib/timeView/timeView';

const MILISECONDS_IN_MINUTE = 60000;

const flexCenter = {
	display: 'flex',
	justifyContent: 'center'
};

const
];

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = this.getInitState();

		this.startTimer = this.startTimer.bind(this);
		this.stopTimer = this.stopTimer.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.duration && this.state.duration !== nextProps.duration) {
			this.setState({
				duration: nextProps.duration
			})
		}
		return true;
	}

	BUTTONSVOC = [
		{
			name: 'start',
			method: this.startTimer.bind(this),
		},
		{
			name: 'stop',
			method: this.stopTimer.bind(this),
		},
		{
			name: 'reset',
			method: this.resetTimer.bind(this),
		}
	]

	getInitState() {
		return {
			duration: this.props.duration,
			isOn: false,
			start: 0,
			timeLeft: 0,
			deadLine: Date.now() + this.props.duration,
			startSound: new Audio(audiolib.bellHighTone),
			stopSound: new Audio(audiolib.bellLowTone),
			buttons: [true, false, false]
		};
	}

	startTimer() {
		this.setState({
			isOn: true,
			timeLeft: this.state.duration,
			start: Date.now(),
			deadLine: Date.now() + this.state.duration,
			buttons: [false, true, true]
		});
		this.state.startSound.play();
		this.timer = setInterval(() => {
			if (this.state.timeLeft > 0) {
				this.setState({
					timeLeft: this.state.deadLine - Date.now()
				})
			} else {
				this.state.stopSound.play();
				this.stopTimer();
				this.resetTimer();
			}
		}, 1);
	}

	stopTimer() {
		this.setState({
			isOn: false,
			buttons: [true, false, true]
		})
		clearInterval(this.timer)
	}

	resetTimer() {
		this.setState({
			timeLeft: this.state.duration,
			isOn: false,
			deadLine: Date.now() + (this.state.duration),
			buttons: [true, false, false]
		})
	}

	render() {

		return(<Panel id={this.props.id}>
			{this.props.fetchedUser &&
			<Group title={this.props.fetchedUser.first_name}>
				<Cell
					before={this.props.fetchedUser.photo_200 ? <Avatar src={this.props.fetchedUser.photo_200}/> : null}
					description={this.props.fetchedUser.city && this.props.fetchedUser.city.title ? this.props.fetchedUser.city.title : ''}
				>
					{`${this.props.fetchedUser.first_name} ${this.props.fetchedUser.last_name}`}
				</Cell>
			</Group>
			}

			<PanelHeader>Dhyan Timer</PanelHeader>

			<Div onClick={this.props.showInput} style={flexCenter}>
				<TimeView time={this.state.isOn ? this.state.timeLeft : this.state.duration} />
			</Div>

			<Group title="controls">
				<Div style={flexCenter}>
					{
						this.BUTTONSVOC.map((item, index) => {
							if (this.state.buttons[index]) {
								return <Button key={index} size="xl" onClick={item.method}>
									{item.name}
								</Button>
							}
						})
					}
				</Div>
			</Group>
		</Panel>);
	}
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	duration: PropTypes.number,
	showInput: PropTypes.func.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
