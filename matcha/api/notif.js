import mongoConnect 	from '../mongo_connect';

const getNotif = (req, res) => {
	if (!req.body.username) return res.send({ status: false, details: 'invalid entry' });
	mongoConnect(res, async(db) => {
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const alreadyLiked = await users.findOne({ username });
		if (!alreadyLiked) return res.send({ status: false, details: 'invalid entry' });
		return res.send({ status: 'success', alreadyLiked });
	});
	return (false);
};

const deleteNotif = (req, res) => {
	mongoConnect(res, async(db) => {
		const users = db.collection('users');
		const { key, username } = req.body;
		if (!req.body.notif) return res.send({ status: false, details: 'invalid entry' });
		const loggedUser = await users.findOne({ username });
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		loggedUser.notifications.splice(key, 1);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		users.update({ username }, { $set: { notifications: loggedUser.notifications } });
		return res.send({ status: true, details: 'success', notification: loggedUser.notifications });
	});
};
export { getNotif, deleteNotif };
