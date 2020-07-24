var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

var http = require('http');
var fs = require('fs');

app.use(express.static(__dirname + "/public"));

const Port=3000;
app.listen(Port);

console.log("Server running on the port" + Port.toString());

//Set patients
const John = {'lastName': 'Doe','firstName': 'John','middleNames': 'Fredrick', 'age': 423, 'height': 170, 'notes': 'Is married to Jane Doe.'};
const Jane = {'lastName': 'Doe','firstName': 'Jane','middleNames': 'Freda', 'age': 412, 'height': 160, 'notes': 'Is married to John Doe.'};
const Bill = {'lastName': 'Smith','firstName': 'Bill','middleNames': 'John', 'age': 285, 'height': 180, 'notes': 'Is on medication.'};

//Use this to store patients
let patients = [John, Jane, Bill];

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
	const lastName = req.params.lastName.replace('"', '').replace('"', '');
	const firstName = req.params.firstName.replace('"', '').replace('"', '');
	const middleNames = req.params.middleNames.replace('"', '').replace('"', '');
	const age = parseInt(req.params.age);
	const height = parseInt(req.params.height);
	const notes = req.params.notes.replace('"', '').replace('"', '');
	
	//Search patients for search criteria
	let patientsQuery = []
	for (let i = 0; i < patients.length; i++) {
		let patient = patients[i]
		console.log(patient)
		matchesQuery = patient.lastName == lastName ||
					   patient.firstName == firstName ||
					   patient.middleNames == middleNames ||
					   patient.notes == notes ||
					   patient.age == age || 
					   patient.height == height;
		
		if (matchesQuery) {
			patientsQuery.push(patient);
		}
	}
	
	//Parse any recieved patients
	if (patientsQuery.length > 0) {
		res.json(patientsQuery);
	}
	else {
		console.log('ERROR!: (404) No patients found matching the criteria');
	}
});

//Delete a selected patient
app.delete('/patient/:lastName/:firstName/:middleNames', (req, res) => {
	try {
		//Read all search criteria
		const lastName = req.params.lastName.replace('"', '').replace('"', '');
		const firstName = req.params.firstName.replace('"', '').replace('"', '');
		const middleNames = req.params.middleNames.replace('"', '').replace('"', '');
		
		console.log(lastName);
			
		for(let i = 0; i < patients.length; i++){
			
			let patient = patients[i];
			
			matchesQuery = (patient.lastName == lastName) && (patient.firstName == firstName) && (patient.middleNames == middleNames);
			console.log(matchesQuery);
						   
		
			
			if(matchesQuery) {
				delete patients[i];
				console.log("Patient has been removed from the records at" + (i).toString());
				res.send("Patient has been deleted from the records");
			}
		
		}
		
	}
	catch(exe) {
		console.log(exe);
	}
});

//Edit selected patient
app.put('/patient/:lastName/:firstName/:middleNames/:age/:height/:notes', (req, res) => {
	//Read all search criteria
	const lastName = req.params.lastName.replace('"', '').replace('"', '');
	const firstName = req.params.firstName.replace('"', '').replace('"', '');
	const middleNames = req.params.middleNames.replace('"', '').replace('"', '');
	const age = parseInt(req.params.age);
	const height = parseInt(req.params.height);
	const notes = req.params.notes.replace('"', '').replace('"', '');
	
	const newPatient = {'lastName': lastName,'firstName': firstName,'middleNames': middleNames, 'age': age, 'height': height, 'notes': notes};
	
	//Search patients for search criteria
	let patientsQuery = [];
	for (let i = 0; i < patients.length; i++) {
		let patient = patients[i];
		
		matchesQuery = (patient.firstName == firstName &&
					    patient.middleNames == middleNames &&
						patient.lastName == patient.lastName);
		
		if(matchesQuery) {
			//Delete patient
			delete patients[i];
			
			//Push edited object back into array
			patients.push(newPatient);
			console.log("");
			
			return;
		}
	}
});