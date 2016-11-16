import mongoConnect from '../mongo_connect';
import * as tools from './tools';

const getFullDetails = async (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const userAsked = await users.findOne({ username });
		if (!userAsked) return res.send({ status: false, details: 'user doenst exist' });
		return res.send(userAsked);
	});
};

export { getFullDetails };
