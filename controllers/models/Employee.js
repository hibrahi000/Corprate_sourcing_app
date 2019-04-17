const mongoose = require('mongoose');

const Employee = mongoose.model(
	'Employee',
	new mongoose.Schema({
		FirstName: {
			type: String,
			required: true
		},
		LastName: {
			type: String,
			required: true
		},
		Email: {
			type: String,
			required: true
		},
		Cell: {
			type: String,
			required: true
		},
		Department: {
			type: String,
			required: true
		},
		Admin: {
			type: Boolean,
			required: true
		},
		Scheduel: {
			type: Array,
			default: null
		},
		Username: {
			type: String,
			required: true
		},
		Password: {
			type: String,
			default: null
		},
		PlainPassword: {
			type: String,
			default: null
		},
		DateCreated: {
			type: String,
			default: Date
		}
	}),
	'Employee'
);

module.exports = { Employee };
