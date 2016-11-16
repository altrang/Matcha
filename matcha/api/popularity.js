import mongoConnect from '../mongo_connect';
import * as tools from './tools';

const popuCount = async (username, db, res) => {
		const users = db.collection('users');
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const userAsked = await users.findOne({ username });
		if (!userAsked) return res.send({ status: false, details: 'user doesnt exist' });
		const pop = (userAsked.isLiked.length / userAsked.visit.number) * 100;
		userAsked.popCount = Math.floor(pop);
		users.update({ username }, { $set: { popCount: userAsked.popCount } });
		return (userAsked.popCount);
};

const getFullDetails = async (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const userAsked = await users.findOne({ username });
		if (!userAsked) return res.send({ status: false, details: 'user doenst exist' });
		popuCount(username, db, res);
		return res.send(userAsked);
	});
};

export { getFullDetails, popuCount };
