import nodemailer from 'nodemailer';

const mailer = (dest, content, obj) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'apimatcha@gmail.com',
			pass: 'apiMatcha1212',
		},
	});
	const mailOptions = {
			from: 'dawdawdwadaw@gmail.com',
			to: dest,
			subject: obj,
			text: content,
	};
	transporter.sendMail(mailOptions, (error, info) => console.log(error || info));
};

export default mailer;
