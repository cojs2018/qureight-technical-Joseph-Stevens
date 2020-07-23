var express = require('express');
var podyparser = require('body-parser');
var cors = require('cors');

var app = express();

var http = require('http');
var fs = require('fs');

app.use(express.static(__dirname + "/public"));

const Port=3000;

console.log("Server running on the port" + Port.toString());

//Use this to store patients
let patients = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Post patient
app.post('/patient', (req, res) => {
	const patient = req.body;
	
	//Output to console for debugging
	console.log(patient);
	patients.push(patient);
	
	res.send('Patient is added to database');
});

//Get all patients
app.get('/patients', (req, res) => {
	res.json(patients);
});

//Get patients based on query
app.get('/patient/:lastName/:firstName/:middleNames/:age/:height/:notes', (req, res) => {
	//Read all search criteria
	const lastName = req.params.lastName;
	const firstName = req.params.firstName;
	const middleNames = req.params.middleNames;
	const age = req.params.age;
	const height = req.params.height;
	const notes = req.params.notes;
	
	//Search patients for search criteria
	let patientsQuery = []
	for (let patient of patients) {
		matchesQuery = (patient.lastName.includes(lastName) &&
					   patient.firstName.includes(firstName) &&
					   patient.middleName.includes(middleNames) &&
					   patient.notes.includes(notes)) ||
					   (patient.age === age) || (patient.height === height);
		
		if (matchesQuery) {
			patientsQuery.push(patient);
		}
	}
	
	//Parse any recieved patients
	if (patientsQuery.length > 0) {
		res.json(patientsQuery);
	}
	
	//Send 404
	res.status(404).send('Patients not found');
});

//Delete a selected patient
app.delete('/patient/:lastName/:firstName/:middleNames/:age/:height/:Notes', (req, res) => {
	//Read all search criteria
	const lastName = req.params.lastName;
	const firstName = req.params.firstName;
	const middleNames = req.params.middleNames;
	const age = req.params.age;
	const height = req.params.height;
	const notes = req.params.notes;
	
	patients = patient.filter (patient => {
		matchesQuery = (patient.lastName === lastName &&
					   patient.firstName === firstName &&
					   patient.middleName === middleNames &&
					   patient.notes === notes &&
					   patient.age === age && 
					   patient.height === height;
		
		if(!matchesQuery) {
			return true;
		}
		return false;
	});
	
	res.send("Patient has been deleted from the records");
});

//Edit selected patient
app.post('/patient/:lastName/:firstName/:middleNames/:age/:height/:Notes', (req, res) => {
	//Read all search criteria
	const lastName = req.params.lastName;
	const firstName = req.params.firstName;
	const middleNames = req.params.middleNames;
	const age = req.params.age;
	const height = req.params.height;
	const notes = req.params.notes;
	
	const newPatient = req.body;
	
	//Search patients for search criteria
	let patientsQuery = []
	for (let i = 0; i < patients.length; i++) {
		let patient = patients[i];
		
		matchesQuery = (patient.lastName === lastName &&
					   patient.firstName === firstName &&
					   patient.middleName === middleNames &&
					   patient.notes === notes &&
					   patient.age === age && 
					   patient.height === height;
		
		if(matchesQuery) {
			patients[i] = patient;
		}
		
		res.send('Patient has been edited');
	}