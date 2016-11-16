import _ 						from 'lodash';
import http 					from 'http';
import cors 					from 'cors';
import moment 					from 'moment';
import express 					from 'express';
import socketIo 				from 'socket.io';
import bodyParser 				from 'body-parser';
import mongoConnect 			from './mongo_connect';

import * as img 				from './api/image';
import * as liked 				from './api/like';
import * as notif 				from './api/notif';
import * as Details 			from './api/popularity';
import * as passWord 			from './api/password';
import * as fastSearch 			from './api/search';
import * as userController 		from './api/user';
import * as parser				from './schema/parser';
import * as tools				from './api/tools';

const users = [];
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('media'));

app.post('/addimage', img.addImage);
app.post('/forgot', passWord.forgot);
app.post('/getNotif', notif.getNotif);
app.post('/add', userController.addUser);
app.post('/reportuser', liked.reportUser);
app.post('/visited', liked.visited(users));
app.post('/deleteNotif', notif.deleteNotif);
app.post('/edit', userController.editProfile);
app.post('/delete', userController.deleteUser);
app.post('/login', userController.connectUser);
app.post('/fullsearch', fastSearch.fullSearch);
app.post('/fastsearch', fastSearch.fastSearch);
app.post('/changepassword', passWord.passChange);
app.post('/resetpassword', passWord.resetWithKey);

app.put('/liked', liked.liked(users));
app.put('/removeimage', img.removeImage);
app.put('/logout', userController.logout);
app.put('/checkuser', userController.checkUser);
app.put('/blocked', userController.blockedUsers);
app.put('/getchat', liked.getChat);

app.get('/getimage', img.getImage);
app.get('/get_info', userController.getInfo);
app.get('/getdetails', Details.getFullDetails);
app.get('/getprofile', userController.getUserInfo);

io.on('connection', (socket) => {
	socket.on('auth', ({ logToken }) => {
		if (logToken) {
			mongoConnect(null, async(db) => {
				const loggedUser = await db.collection('users').findOne({ 'loginToken.token': logToken });
				if (loggedUser) {
					socket.emit('auth status', { status: 'success' });
					users.push({ username: loggedUser.username, socket });
					db.collection('users').update({ username: loggedUser.username },
						{ $set: { connected: 'Online' } });
					socket.on('sendMess', async ({ recipient, message }) => {
						if (!parser.message(message)) return (false);
						const connected = await db.collection('chats').findOne({
							$or: [
								{ userA: loggedUser.username, userB: recipient },
								{ userA: recipient, userB: loggedUser.username },
							],
						});
						if (connected) {
						const fullMessage = {
							author: loggedUser.username,
							message,
						};
						const toSend = _.find(users, (user) => user.username === recipient);
						const recipientUser = await db.collection('users').findOne({ username: recipient });
						if (toSend) toSend.socket.emit('receiveMess', { sender: loggedUser.username, message });
						else {
							tools.notify(socket, recipientUser, `${loggedUser.username} sent you a message`, db)
						}
						db.collection('chats').update({ $or: [
							{ userA: loggedUser.username, userB: recipient },
							{ userA: recipient, userB: loggedUser.username },
						] },
						{
							$push: { messages: fullMessage },
						}
					);
				}
				return (false);
			});
				} else {
					socket.emit('auth status',
						{ status: 'fail' });
				}
			});
		} else socket.emit('auth status', { status: 'fail' });
	});
	socket.on('disconnect', () => {
		mongoConnect(null, async(db) => {
			const username = await _.find(users, { socket }).username;
			db.collection('users').update({ username },
				{ $set: { connected: moment().format('MM-DD-YYYY') } });
			_.remove(users, (a) => _.isEqual(a.socket, socket));
		});
	});
 });

server.listen(8080);
