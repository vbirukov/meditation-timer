
import React, {PropTypes} from "react";
import { Icon32PauseCircle, Icon32PlayCircle, Icon28Replay } from '@vkontakte/icons';
import styles from './control-btns.css';
import { Button, Div, Group } from "@vkontakte/vkui";

const ControlBtns = (props) => {
    const {isOn, toggleTimer, resetTimer, isResetBtnVisible} = props;

    return (
        <Group title="controls">
            <Div className={styles.flexCenter}>
                <Button
                    appearance='overlay'
                    before={isOn ? (<Icon32PauseCircle/>) : (<Icon32PlayCircle/>)}
                    key='toggler'
                    size="m"
                    onClick={toggleTimer}>
                </Button>
                {
                    isResetBtnVisible && <Button
                        key='reset'
                        before={<Icon28Replay/>}
                        size="m"
                        onClick={resetTimer}>
                    </Button>
                }
            </Div>
        </Group>
    )
} 

export default ControlBtns;

