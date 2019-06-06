const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoUtil = require('../mongoUtil.js');
const key = require('./keys');

//load emoployee

const employee = require('../models/Employee').Employee;
function connectABHPharmaDB(theFunction) {
	mongoose
		.connect(key.ABHPHARMA_DB_CONNECT_URI, { useNewUrlParser: true })
		.then(() => theFunction, console.log('Connected to ABH Pharma DB.....'))
		.catch((err) => console.log(err));
}

function passport(passport) {
	
	connectABHPharmaDB();
	passport.use(
		'adminPass',
		new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
			//match user
			console.log('entering passport ADMIN');
			employee
				.findOne({ Username: userName })
				.then((empl) => {
					if (!empl) {
						console.log('Attempt was made to go into Admin USERNAME : ' + userName);
						return done(null, false, { message: 'Invalid username or password' });
					}

					//match password
					bcrypt.compare(password, empl.Password, (err, isMatch) => {
						if (err) throw err;

						if (isMatch) {
							//check to see if admin
							employee.findOne({ Username: userName }).then((empl) => {
								if (!empl.Admin) {
									return done(null, false, {
										message: 'It seems like you dont have permision to acces this site'
									});
								} else {
									console.log('we have confirmed');

									return done(null, empl);
								}
							});
						} else {
							console.log('Attempt was made to log into Admin USERNAME: ' + userName);
							return done(null, false, { message: 'Invalid username or password' });

						}
					});
				})
				.catch((err) => console.log(err));
		})
	);

	passport.use(
		'purchPass',
		new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
			//match user
			console.log('entering passport PURCH');
			employee
				.findOne({ Username: userName })
				.then((empl) => {
					if (!empl) {
						console.log('entering passport !empl');
						return done(null, false, { message: 'Invalid username or password' });
					}
					console.log('userfound');
					//match password
					bcrypt.compare(password, empl.Password, (err, isMatch) => {
						if (err) throw err;

						if (isMatch) {
							console.log('passFound');
							//check to see if purchase
							employee.findOne({ Username: userName }).then((empl) => {
								if (empl.Department != 'Purchasing') {
									console.log('Not Dep Purch');
									if (!empl.Admin) {
										console.log('Not Admin');
										return done(null, false, {
											message: 'It seems like you dont have permision to acces this site'
										});
									} else {
										console.log('is admin USER:' + userName);
										return done(null, empl);
									}
								} else {
									console.log('is Purch USER: ' + userName);
									connectABHPharmaDB();
								return done(null, empl);
								}
							});
						} else {
							return done(null, false, { message: 'Invalid username or password' });
						}
					});
				})
				.catch((err) => console.log(err));
		})
	);

	passport.serializeUser((employee, done) => {
		done(null, employee.id);
	});

	passport.deserializeUser((id, done) => {
		employee.findById(id, function(err, user) {
			done(err, user);
		});
	});
}

module.exports = passport;
