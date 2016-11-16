import crypto 					from 'crypto';
import mongoConnect 			from '../mongo_connect';
import * as tools 				from './tools';
import * as parserController 	from './parserController';
import * as popu 				from './popularity';
import * as like 				from './like';

const checkUser = (req, res) => {
	mongoConnect(res, async (db) => {
		const logTok = req.get('logToken');
		if (!logTok) return res.send({ status: false, details: 'user unauthorized' });
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return (res.send({ status: false, details: 'user unauthorized' }));
		return res.send({ status: true, loggedUser });
	});
};

const getAge = (birthdate) => {
	const ageDifMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const addUser = async (req, res) => {
	const liked = [];
	const isLiked = [];
	const blocked = [];
	const tags = [];
	const isBlocked = [];
	const visit = {
		number: 0,
		visiter: [],
	};
	const image = [];
	const orientation = '';
	const popCount = 0;
	const error = await parserController.registerChecker(req.body);
	if (error) return res.send({ status: false, details: 'invalid entry', error });
		mongoConnect(res, async (db) => {  // fonction de callback success
			const { username } = req.body || ''; // == req.body.login == alban
			const { mail } = req.body || ''; // == req.body.login == alban
			const users = db.collection('users');
			const alreadyUsername = await users.findOne({ username });
			const alreadyMail = await users.findOne({ mail });
			const distance = 0;
			const age = getAge(new Date(req.body.birthdate));
			const data = { ...req.body,
					password: crypto.createHash('whirlpool').update(req.body.password).digest('hex'),
					liked,
					isLiked,
					popCount,
					visit,
					image,
					orientation,
					age,
					distance,
					blocked,
					isBlocked,
					tags,
				};
			if (alreadyUsername) {
				res.send({ status: false, details: 'Username already used' });
			} else if (alreadyMail) {
					res.send({ status: false, details: 'Mail already used' });
			} else {
				users.insert(data);
				res.send({ status: true, details: 'success' });
		}
	});
	return (false);
};

const deleteUser = (request, response) => {
	mongoConnect(response, async (db) => {
		const { username } = request.body;
		const users = db.collection('users');
		const alreadyExist = await users.findOne({ username });
		if (alreadyExist) {
			users.remove({ username });
			response.send('success');
		} else {
			db.close();
			response.send('user doesnt exist');
		}
	});
};

const editProfile = async (req, res) => {
	const error = await parserController.updateProfileChecker(req.body);
	if (error) return res.send({ status: false, details: 'invalid entry', error });
	mongoConnect(res, async (db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return (res.send({ status: false, details: 'user unauthorized' }));
		const { username } = loggedUser;
		const users = db.collection('users');
		const orientation = req.body.orientation || 'bisexual';
		let location = loggedUser.location;
		if (req.body.location !== null) {
			location = req.body.location;
		}
		const details = {
			...req.body,
			orientation,
			location,
		};
		await users.update({ username }, { $set: details });
		const newUser = await users.findOne({ username });
		return res.send({ status: true, details: 'success', newUser });
	});
	return (false);
};

const addToken = (res, token) => {
	res.set('Access-Control-Expose-Headers', 'logToken');
	res.set('logToken', token);
};

const connectUser = async (req, res) => {
	const error = await parserController.loginChecker(req.body);
	if (error) return res.send({ status: false, details: 'Invalid Entry', error });
	mongoConnect(res, async (db) => {
		const { username, password } = req.body || '';
		const users = db.collection('users');
		const data = { username,
				password: crypto.createHash('whirlpool').update(password).digest('hex'),
		};
		const alreadyExist = await users.findOne({ username: data.username, password: data.password });
		if (!alreadyExist) return res.send({ status: false, details: 'Username or password invalid' });
		const loginToken = {
				token: tools.createToken(),
				creaDate: new Date().getTime() / 1000,
		};
		await users.update({ username }, { $set: { loginToken } });
		addToken(res, loginToken.token);
		return res.send({ status: true, details: 'success' });
	});
	return (false);
};

const getInfo = (req, res) => {
	mongoConnect(res, async (db) => {
		const info = await tools.checkToken(req, db);
		delete info.password;
		if (info) return res.send(info);
		return res.send({ status: false, details: 'user unauthorized' });
	});
};

const getUserInfo = async (req, res) => {
	mongoConnect(res, async (db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		let fast = await popu.popuCount(loggedUser.username, db, res);
		if (!req.query.username) {
			return res.send({
				status: 'success',
				details: 'no username',
				askedUser: { ...loggedUser, selfReq: true, popCount: fast },
			});
		}
		const users = db.collection('users');
		const { username } = req.query;
		let askedUser = await users.findOne({ username });
		if (!askedUser) return res.send({ status: false, details: 'user doesnt exist' });
		fast = await popu.popuCount(askedUser.username, db, res);
		askedUser.age = getAge(new Date(askedUser.birthdate));
		const alreadyLiked = askedUser.isLiked && askedUser.isLiked.indexOf(loggedUser.username) !== -1;
		const selfReq = loggedUser.username === username;
		const alreadyBlocked = askedUser.isBlocked &&
			askedUser.isBlocked.indexOf(loggedUser.username) !== -1;
		askedUser = {
			...askedUser,
			alreadyLiked,
			selfReq,
			alreadyBlocked,
		};
		delete askedUser.password;
		delete askedUser.mail;
		delete loggedUser.password;
		delete loggedUser.mail;
		return res.send({ status: 'success', details: 'username', askedUser, loggedUser });
	});
};

const logout = async(req, res) => {
	mongoConnect(res, async (db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const askedUser = await users.findOne({ 'loginToken.token': loggedUser.loginToken.token });
		if (!askedUser) return res.send({ status: false, details: 'user doenst exist' });
		await users.update({
			'loginToken.token': loggedUser.loginToken.token },
			{ $unset: { loginToken: '' } });
		return res.send('successfully disconnected');
	});
	return (false);
};

const blockedUsers = (req, res) => {
	mongoConnect(res, async (db) => {
		const users = db.collection('users');
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const blockedUser = await users.findOne({ username });
		if (!blockedUser) return res.send({ status: false, details: 'user doesnt exist' });
		const alreadyBlocked = loggedUser.blocked.indexOf(username);
		if (alreadyBlocked >= 0) {
			users.update({ username: loggedUser.username }, { $pull: { blocked: username } });
			users.update({
				username: blockedUser.username },
				{ $pull: { isBlocked: loggedUser.username } });
			return res.send({ status: false, details: 'unblocked', blockedUser: blockedUser.username });
		}
		users.update({ username: blockedUser.username }, { $push: { isBlocked: loggedUser.username }, $pull: { isLiked: loggedUser.username } });
		users.update({ username: loggedUser.username }, { $push: { blocked: blockedUser.username }, $pull: { liked: blockedUser.username } });
		await like.dropChat(loggedUser, blockedUser, db);
		return res.send({ status: false, details: 'blocked', blockedUser: blockedUser.username });
	});
	return (false);
};

export { addUser,
		deleteUser,
		editProfile,
		connectUser,
		logout,
		getInfo,
		getUserInfo,
		blockedUsers,
		checkUser,
	};
