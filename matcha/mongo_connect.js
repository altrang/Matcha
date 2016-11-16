import mongodb from 'mongodb';

const mongoConnect = (response, success) => {
	const mdb = mongodb.MongoClient;
	const url = 'mongodb://atrang:just4Funny@ds139267.mlab.com:39267/matcha';
	mdb.connect(url, (err, db) => {
		if (err) {
			response.send({
				status: false,
				details: 'mongodb connection error',
				err,
			});
		} else {
			success(db);
		}
	});
};

export default mongoConnect;
