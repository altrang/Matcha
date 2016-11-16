import mailer 			from './mailer';
import mongoConnect 	from '../mongo_connect';
import * as tools		from './tools';

const checkedLiked = (userA, userB, db) => {
	const chats = db.collection('chats');
	chats.insert({
		userA: userA.username,
		userB: userB.username,
		messages: [],
	});
};

const dropChat = (userA, userB, db) => {
	const chats = db.collection('chats');
	const drop = chats.remove({ $or: [
		 { userA: userA.username, userB: userB.username },
		 { userA: userB.username, userB: userA.username }]
	 });

};

const getChat = (req, res) => {
	mongoConnect(res, async(db) => {
		const chats = db.collection('chats');
		const { username } = req.body;
		const chatsList = await chats.find({ $or: [
			{ userA: username },
			{ userB: username }]
		}).toArray();
		if (chatsList) {
			const chatsRoom = chatsList.map((el) => {
					return {
						user: el.userA === username ? el.userB : el.userA,
						messages: el.messages,
					}
			});
			return res.send({ status: true, chatsRoom });
		}
		return res.send({ status: true, details: 'no chat' });
	});
};

const liked = (socketList) => (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const likedUser = await users.findOne({ username });
		if (!likedUser) return res.send({ status: false, details: 'user doesnt exist' });
		const alreadyLiked = loggedUser.liked.indexOf(username);
		if (loggedUser.blocked.indexOf(username) === -1 && loggedUser.isBlocked.indexOf(username) === -1) {
			if (alreadyLiked >= 0) {
				tools.notify(socketList, likedUser, `${loggedUser.username} just unliked you!`, db);
				await users.update({ username: loggedUser.username }, { $pull: { liked: username } });
				await users.update({ username: likedUser.username }, { $pull: { isLiked: loggedUser.username } });
				dropChat(loggedUser, likedUser, db);
				return res.send({ status: false, details: 'unliked', likedUser: likedUser.username });
			}
			tools.notify(socketList, likedUser, `${loggedUser.username} just liked you!`, db);
			users.update({ username: loggedUser.username }, { $push: { liked: likedUser.username } });
			users.update({ username: likedUser.username }, { $push: { isLiked: loggedUser.username } });
			if (loggedUser.isLiked.indexOf(likedUser.username) !== -1)
				checkedLiked(loggedUser, likedUser, db);
				return res.send({ status: false, details: 'liked', likedUser: likedUser.username });
			} else {
				return (false)
			}
		});
	return (false);
};

const reportUser = (req, res) => {
	mongoConnect(res, async(db) => {
		const mail = 'trangalban@gmail.com';
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const visitedUser = await users.findOne({ username });
		if (!visitedUser) return res.send({ status: false, details: 'user doesnt exist' });
		mailer(mail, `A user reported this account: ${username}`, 'New user reported as fake!');
		return res.send({ status: true, details: 'user reported' });
	});
};

const visited = (socketList) => (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		const { username } = req.body;
		if (!username) return res.send({ status: false, details: 'invalid entry' });
		const visitedUser = await users.findOne({ username });
		if (!visitedUser) return res.send({ status: false, details: 'user doesnt exist' });
		if (loggedUser.isBlocked.indexOf(visitedUser.username) !== -1) return res.send({ status: false, details: 'blocked' });
		const alreadyVisited = visitedUser.visit.visiter.indexOf(loggedUser.username);
		if (alreadyVisited >= 0) {
			tools.notify(socketList, visitedUser,
				`${loggedUser.username} just visited your profile!`, db);
			return res.send({ status: true, details: 'already visited' });
		}
		users.update({ username: visitedUser.username },
			{ $push: { 'visit.visiter': loggedUser.username }, $inc: { 'visit.number': 1 } });
		tools.notify(socketList, visitedUser, `${loggedUser.username} just visited your profile!`, db);
		return res.send({ status: true, details: 'visit added' });
	});
};

export { liked, visited, reportUser, getChat, dropChat };
