import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Touch, Progress, Slider} from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import audiolib from '../../utils/audio';
import TimeView from '../../components/time-view/time-view';
import { Icon32PauseCircle, Icon32PlayCircle, Icon28Replay } from '@vkontakte/icons';
import getPercentRelation from '../../utils/helpers';
import styles from './home.module.css';
import UserStats from '../../components/user-stats/user-stats';
import ControlBtns from '../../components/control-btns/control-btns';

const TIMER_DURATION_MULTIPLER = 60000;
const DEFAULT_TIMER_DURATION = 10 * TIMER_DURATION_MULTIPLER;

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
			timeLeft: DEFAULT_TIMER_DURATION,
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

		const isResetBtnVisible = !this.state.isOn && this.state.timeLeft !== this.state.duration;

		return (<Panel id={this.props.id}>
			<PanelHeader>Dhyan Timer</PanelHeader>
			{this.props.fetchedUser && <UserStats user={this.props.fetchedUser} /> }

			<Div onClick={e => this.toggleAdjust()}>
				<TimeView time={this.state.timeLeft} />
				<Progress className={styles.width100} value={getPercentRelation(this.state.duration, this.state.duration - this.state.timeLeft)} />
			</Div>

			{
				this.state.adjustTimer && (
					<>
						<Slider
							min={1}
							max={1000}
							step={1}
							value={Number(this.state.duration / TIMER_DURATION_MULTIPLER)}
							onChange={value => {
								this.setState({
									timeLeft: value * TIMER_DURATION_MULTIPLER,
									duration: value * TIMER_DURATION_MULTIPLER
								})
							}}
						/>
						<Div className={styles.flexCenter}>
							<Button
								appearance='overlay'
								key='saveDuration'
								size="l"
								onClick={e => this.toggleAdjust()}>
								Сохранить
							</Button>
						</Div>
					</>
				)
			}

			<ControlBtns isOn={this.state.isOn} toggleTimer={this.toggleTimer.bind(this)} resetTimer={this.resetTimer.bind(this)} isResetBtnVisible={isResetBtnVisible} />

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
