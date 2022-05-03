
import React, {PropTypes} from "react";
import styles from './control-btns.css';
import { Icon48Pause, Icon48Play, Icon48Replay } from '@vkontakte/icons';
import { Button, Div, Group } from "@vkontakte/vkui";

const ControlBtns = (props) => {
    const {isOn, toggleTimer, resetTimer, isResetBtnVisible} = props;
    const divName = styles.playButton;
    return (
        <Group title="controls">

            {/*почему то в этом файле React не видит импортированный styles */}
            <Div className='flexCenter'>
                <div
                    className='playButton'
                    onClick={toggleTimer}>
                    {isOn ? (<Icon48Pause/>) : (<Icon48Play/>)}
                </div>
                {
                    isResetBtnVisible &&

                    <div
                        className='playButton'
                        onClick={resetTimer}>
                        <Icon48Replay/>
                    </div>
                }
            </Div>
        </Group>
    )
} 

export default ControlBtns;

