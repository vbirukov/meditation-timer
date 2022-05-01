import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Touch, Progress, Slider} from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import audiolib from '../lib/audio';
import TimeView from '../lib/timeView/timeView';
import { Icon32PauseCircle, Icon32PlayCircle, Icon28Replay } from '@vkontakte/icons';

const flexCenter = {
	display: 'flex',
	justifyContent: 'center'
};

const DEFAULT_TIMER_DURATION = 10 * 60000;

const getPercentRelation = (base, part) => {
	return (part / base) * 100;
}

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = this.getInitState();
	}

	getInitState() {
		return {
			duration: DEFAULT_TIMER_DURATION,
			isOn: false,
			start: 0,
			timeLeft: 0,
			deadLine: Date.now() + this.props.duration,
			startSound: new Audio(audiolib.bellHighTone),
			stopSound: new Audio(audiolib.bellLowTone),
			adjustTimer: false
		};
	}

	toggleTimer() {
		if (this.state.isOn) {
			this.stopTimer();
		} else {
			this.startTimer();
		}
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
					timeLeft: Math.max(this.state.deadLine - Date.now(), 0)
				})
			} else {
				this.state.stopSound.play();
				this.stopTimer();
				this.setState({
					timeLeft: 0
				})
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
		this.setState({
			timeLeft: this.state.duration,
			isOn: false,
			deadLine: Date.now() + (this.state.duration)
		})
	}

	toggleAdjust() {
		if (!this.state.isOn) {
			this.setState({
				adjustTimer: !this.state.adjustTimer
			})
		}
	}

	render() {

		let resetButton;

		if (!this.state.isOn && this.state.timeLeft > 0) {
			resetButton = <Button
							key='reset'
							before={<Icon28Replay/>}
							size="m"
							onClick={e => this.resetTimer()}>
						</Button>;
		} else {
			resetButton = '';
		}

		return(<Panel id={this.props.id}>
			<PanelHeader>Dhyan Timer</PanelHeader>
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

			<Div onClick={e => this.toggleAdjust()} style={flexCenter}>
				<TimeView time={this.state.isOn ? this.state.timeLeft : this.state.duration} />
				<Progress value={getPercentRelation(this.state.duration, this.state.timeLeft)} />
			</Div>

			{
				this.state.adjustTimer &&
				<Slider
					min={1}
					max={1000}
					step={1}
					value={Number(this.state.duration / 60000)}
					onChange={value => {
						this.setState({
							duration: value * 60000
						})
					}}
				/>
			}
			{
				this.state.adjustTimer &&
				<Div style={flexCenter}>
					<Button
						appearance='overlay'
						key='saveDuration'
						size="l"
						onClick={e => this.toggleAdjust()}>
						Сохранить
						</Button>
				</Div>
			}

			<Group title="controls">
				<Div style={flexCenter}>
					<Button
						appearance='overlay'
						before={this.state.isOn ? (<Icon32PauseCircle/>) : (<Icon32PlayCircle/>)}
						key='toggler'
						size="m"
						onClick={e => this.toggleTimer()}>
					</Button>
					{resetButton}
				</Div>
			</Group>
		</Panel>);
	}
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
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
