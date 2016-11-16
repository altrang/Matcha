import _ from 'lodash';

const createToken = () => {
		const token = Math.random().toString(16).substring(2, 15);
		return (token);
};

const checkToken = async (req, db) => {
		const logToken = req.get('logToken');
		if (!logToken) return (null);
		const users = db.collection('users');
		const loggedUser = await users.findOne({ 'loginToken.token': logToken });
		if (!loggedUser) return (null);
		const actualDate = new Date().getTime() / 1000;
		const lifeTime = actualDate - loggedUser.loginToken.creaDate;
		if (lifeTime > 1209600) {
		await users.update({ username: loggedUser.username }, { $unset: { loginToken: '' } });
		} else if (lifeTime <= 10) {
		await users.update({ username: loggedUser.username },
							{ $set: {
								loginToken: {
										token: loggedUser.loginToken.token,
										creaDate: actualDate,
									},
								},
							});
	}
	return (loggedUser);
};

const notify = (socketList, receiver, message, db) => {
	const receiverSocket = _.find(socketList, (socket) => socket.username === receiver.username);
	if (receiverSocket) {
		receiverSocket.socket.emit('notification', message);
	}
	const users = db.collection('users');
	const notifications = receiver.notifications ? [message, ...receiver.notifications] : [message];
	users.update({ username: receiver.username }, { $set: { notifications } });
};

export { createToken, checkToken, notify };
