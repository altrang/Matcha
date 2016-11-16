import crypto 					from 'crypto';
import mailer 					from './mailer';
import mongoConnect 			from '../mongo_connect';
import * as parserController 	from './parserController';

const passChange = (req, res) => {
	mongoConnect(res, async (db) => {
		const { username } = req.body;
		const data = { ...req.body,
				password: crypto.createHash('whirlpool').update(req.body.password).digest('hex'),
		};
		const users = db.collection('users');
		const alreadyExist = await users.findOneAndUpdate({ username },
			{ $set: { password: data.password } });
		if (alreadyExist) {
			res.send('mot de passe change');
		} else {
			res.send('l utilisateur nexiste pas');
		}
	});
};

const forgot = async (req, res) => {
	const error = await parserController.forgotPasswordChecker(req.body);
	if (error) return res.send({ status: false, details: 'invalid request', error });
	mongoConnect(res, async (db) => {
		const { mail } = req.body;
		const users = db.collection('users');
		const askedUser = await users.findOne({ mail });
		if (!askedUser) return res.send({ status: false, details: `${mail} does not exist` });
		const confirmKey = Math.random().toString(16).substring(2, 8);
		mailer(mail, `Use this code to reset your password ${confirmKey}`, 'Reset your password');
		await users.update({ mail }, { $set: { resetKey: confirmKey } });
		return res.send({ status: true, details: `A mail has been sent to ${mail}` });
	});
	return (false);
};

const resetWithKey = (req, res) => {
	const error = parserController.resetWithKeyChecker(req.body);
	if (error) return res.send({ status: false, details: 'invalid request', error });
	mongoConnect(res, async (db) => {
		const { username, resetKey, password } = req.body;
		const users = db.collection('users');
		const askedUser = await users.findOne({ username });
		if (!askedUser) return res.send({ status: false, details: `${username} does not exist` });
		else if (askedUser && askedUser.resetKey !== resetKey) {
			return res.send({ status: false,
				details: `impossible to reset ${username}'s password with this key` });
		}
		await users.update({ username }, {
			$unset: { resetKey: '' },
			$set: { password: crypto.createHash('whirlpool').update(password).digest('hex'),
			},
		});
		return res.send({ status: true, details: `${username}'s password successfully updated'` });
	});
	return (false);
};

export { passChange, forgot, resetWithKey };
