import React, {Component} from 'react';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import PropTypes from 'prop-types';
import {Avatar, Switch, PanelHeader, Panel, Button, Group, Cell, Div} from '@vkontakte/vkui';
import audiolib from '../lib/audio';
import TimeView from '../lib/timeView/timeView';

const MILISECONDS_IN_MINUTE = 60000;

const flexCenter = {
	display: 'flex',
	justifyContent: 'center'
};

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
				duration: nextProps.duration,
				timeLeft: nextProps.duration
			})
		}
		return true;
	}

	getInitState() {
		return {
			duration: this.props.duration,
			isOn: false,
			start: 0,
			timeLeft: 0,
			deadLine: Date.now() + this.props.duration,
			startSound: new Audio(audiolib.bellHighTone),
			stopSound: new Audio(audiolib.bellLowTone),
		};
	}

	startTimer() {
		this.setState({
			isOn: true,
			timeLeft: this.state.duration,
			start: Date.now(),
			deadLine: Date.now() + this.state.duration
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
				this.props.share();
			}
		}, 1);
	}

	stopTimer() {
		this.setState({
			isOn: false
		})
		clearInterval(this.timer)
	}

	resetTimer() {
		this.stopTimer();
		this.setState({
			timeLeft: this.state.duration,
			deadLine: Date.now() + (this.state.duration)
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
					{   this.state.isOn ? <Button size="xl" onClick={this.state.stopTimer}>
						Stop
					</Button> : <Button size="xl" onClick={this.startTimer}>
						Start
					</Button>
					}
					{
						this.state.duration !== this.state.timeLeft ? <Button size="xl" onClick={this.resetTimer}>
						Reset
					</Button> : null
					}
				</Div>
				<Cell asideContent={<Switch />}>
					Фоновая музыка
					<Icon28SettingsOutline
						onClick={this.props.share}/>
				</Cell>
			</Group>
		</Panel>);
	}
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	duration: PropTypes.number,
	showInput: PropTypes.func.isRequired,
	go: PropTypes.func.isRequired,
	share: PropTypes.func.isRequired,
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
