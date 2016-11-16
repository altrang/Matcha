import multer 		from 'multer';
import mongoConnect from '../mongo_connect';

const upload = multer({ dest: 'media/' }).single('image');

const addImage = (req, res) => {
	upload(req, res, async (err) => {
		const logToken = req.get('logToken');
		if (err) return (res.send({ status: false, details: 'invalid entry' }));
		if (!req.file) {
			return (res.send({ status: false, details: 'image required' }));
		}
		if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
			return res.send({ status: false, details: 'wrong format' });
		}
		mongoConnect(res, async (db) => {
			let image = req.file.filename;
			if (req.file.mimetype.includes('png')) image = `${image}`;
			else image = `${image}`;
			const users = db.collection('users');
			const loggedUser = await users.findOne({ 'loginToken.token': logToken });
			if (!loggedUser) return (res.sen.d({ status: false, details: 'user unauthorized' }));
			let arrImg = null;
			if (!loggedUser.image) {
				arrImg = [image];
			} else if (loggedUser.image.length >= 5) {
				return (res.send({ status: false, details: 'trop dimg' }));
			} else arrImg = [image, ...loggedUser.image];
			users.update({ username: loggedUser.username }, { $set: { image: arrImg } });
			return (res.send({ status: true, details: 'image added', image }));
		});
		return (false);
	});
};

const removeImage = (req, res) => {
	const logToken = req.get('logToken');
	const { image } = req.body;
	if (!image) {
		return res.send({
			status: false,
			details: 'invalid entry',
			error: { path: 'image', error: 'required' } });
	}
	mongoConnect(res, async (db) => {
		const users = db.collection('users');
		const loggedUser = await users.findOne({ 'loginToken.token': logToken });
		const index = loggedUser.image.indexOf(image);
		if (index !== -1) {
			loggedUser.image.splice(index, 1);
			users.update({ username: loggedUser.username }, { $set: { image: loggedUser.image } });
			return res.send({ status: true, details: 'image removed' });
		}
		return res.send({ status: false, details: 'image does not exist' });
	});
	return (false);
};

const getImage = (req, res) => {
	const logToken = req.get('logToken');
	mongoConnect(res, async (db) => {
		const users = db.collection('users');
		const loggedUser = await users.findOne({ 'loginToken.token': logToken });
		if (!loggedUser) return res.send({ status: false, details: 'user doesnt exist' });
		const images = loggedUser.image;
		res.send(images);
		return (false);
	});
};

export { addImage, removeImage, getImage };
