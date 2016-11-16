import geolib 			from 'geolib';
import mongoConnect 	from '../mongo_connect';
import * as tools 		from './tools';

const fastSearch = (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const newUsername = req.body.username || loggedUser.username;
		const users = db.collection('users');
		let searchObj;
		if (loggedUser.gender === 'male') {
			if (loggedUser.orientation === 'gay') {
				searchObj = {
					$or: [
						{
							orientation: 'gay',
							gender: 'male',
						},
						{
							orientation: 'bisexual',
							gender: 'male',
						},
					],
				};
			} else if (loggedUser.orientation === 'straight') {
				searchObj = {
					$or: [
						{
							orientation: 'straight',
							gender: 'female',
						},
						{
							orientation: 'bisexual',
							gender: 'female',
						},
					],
				};
			} else {
				searchObj = {
					$nor: [
						{
							orientation: 'gay',
							gender: 'female',
						},
						{
							orientation: 'straight',
							gender: 'male',
						},
					],
				};
			}
		} else if (loggedUser.gender === 'female') {
			if (loggedUser.orientation === 'gay') {
				searchObj = {
					$or: [
						{
							orientation: 'gay',
							gender: 'female',
						},
						{
							orientation: 'bisexual',
							gender: 'female',
						},
					],
				};
			} else if (loggedUser.orientation === 'straight') {
				searchObj = {
					$or: [
						{
							orientation: 'straight',
							gender: 'male',
						},
						{
							orientation: 'bisexual',
							gender: 'male',
						},
					],
				};
			} else {
				searchObj = {
					$nor: [
						{
							orientation: 'gay',
							gender: 'male',
						},
						{
							orientation: 'straight',
							gender: 'female',
						},
					],
				};
			}
		}
		const listUser = await users.aggregate([
			{
				$match: {
					...searchObj,
					username: { $nin: [loggedUser.username, newUsername] },
				},
			},
			{
				$sample: { size: 6 },
			},
		], {
			username: 1,
			popCount: 1,
			image: 1,
			location: 1,
			tags: 1,
		}).toArray();
		listUser.forEach((user) => {
			user.distance = geolib.getDistance(
				{ latitude: user.location.lat, longitude: user.location.lon },
				{ longitude: loggedUser.location.lon, latitude: loggedUser.location.lat });
			user.commonTags = loggedUser.tags.filter((tag) => (user.tags.indexOf(tag) !== -1));
			user.distance = user.distance / 1000;
		});
		return res.send({ status: true, details: 'success', listUser, loggedUser });
	});
};

const fullSearch = (req, res) => {
	mongoConnect(res, async(db) => {
		const loggedUser = await tools.checkToken(req, db);
		if (!loggedUser) return res.send({ status: false, details: 'user unauthorized' });
		const users = db.collection('users');
		let searchObj;
		if (loggedUser.gender === 'male') {
			if (loggedUser.orientation === 'gay') {
				searchObj = {
					$or: [
						{
							orientation: 'gay',
							gender: 'male',
						},
						{
							orientation: 'bisexual',
							gender: 'male',
						},
					],
				};
			} else if (loggedUser.orientation === 'straight') {
				searchObj = {
					$or: [
						{
							orientation: 'straight',
							gender: 'female',
						},
						{
							orientation: 'bisexual',
							gender: 'female',
						},
					],
				};
			} else {
				searchObj = {
					$nor: [
						{
							orientation: 'gay',
							gender: 'female',
						},
						{
							orientation: 'straight',
							gender: 'male',
						},
					],
				};
			}
		} else if (loggedUser.gender === 'female') {
			if (loggedUser.orientation === 'gay') {
				searchObj = {
					$or: [
						{
							orientation: 'gay',
							gender: 'female',
						},
						{
							orientation: 'bisexual',
							gender: 'female',
						},
					],
				};
			} else if (loggedUser.orientation === 'straight') {
				searchObj = {
					$or: [
						{
							orientation: 'straight',
							gender: 'male',
						},
						{
							orientation: 'bisexual',
							gender: 'male',
						},
					],
				};
			} else {
				searchObj = {
					$nor: [
						{
							orientation: 'gay',
							gender: 'male',
						},
						{
							orientation: 'straight',
							gender: 'female',
						},
					],
				};
			}
		}
		let listUser = await users.aggregate([
			{
				$match: {
					...searchObj,
					username: { $nin: [loggedUser.username] },
				},
			},
		], {
			username: 1,
			popCount: 1,
			image: 1,
			location: 1,
			tags: 1,
		}).toArray();
		listUser.forEach((user) => {
			user.distance = geolib.getDistance(
				{ latitude: user.location.lat, longitude: user.location.lon },
				{ longitude: loggedUser.location.lon, latitude: loggedUser.location.lat });
			user.commonTags = loggedUser.tags.filter((tag) => (user.tags.indexOf(tag) !== -1));
			user.distance = user.distance / 1000;
			let distancePoint;
			if (user.distance < 100) {
			 	user.distancePoint = 1000;
			} else if (user.distance > 100 && user.distance < 300) {
				user.distancePoint = 500;
			} else {
				user.distancePoint = 100;
			}
		});
		listUser.forEach((user) => {
			if (user.tags && user.tags.length > 0) {
				let tagPoint;
				const tagNumber = user.tags.filter((tag) => loggedUser.tags.indexOf(tag) !== -1);
				if (tagNumber.length > 10) {
					user.tagPoint = 50;
				} else if (tagNumber.length < 10 && tagNumber.length > 0) {
					user.tagPoint = 20;
				} else {
					user.tagPoint = 0;
				}
			} else {
				user.tagPoint = 0;
			}
		});
		listUser.forEach((user) => {
			user.suggestPoint = user.distancePoint + user.tagPoint;
		});
		listUser = listUser.sort((a, b) => {
				return (b.suggestPoint - a.suggestPoint);
		});
		return res.send({ status: true, details: 'success', listUser, loggedUser });
	});
};

export { fastSearch, fullSearch };
