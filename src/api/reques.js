import bridge from '@vkontakte/vk-bridge';

const APP_ID = 7595020;

const fetchUser = async function() {
    const user = await bridge.send('VKWebAppGetUserInfo');
    this.setState({user});
    bridge.send("VKWebAppGetAuthToken", {"app_id": APP_ID, "scope": "friends"})
        .then((response) => {
            this.setState({token: response.access_token});
        }).catch((e) => {
        console.log(`error: ${e} `)
    });
}
export default fetchUser;