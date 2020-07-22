const patientSchema = new Schema({
	/*We need, patients name, height in centimeters, age in months 
	  and notes from physicians*/
	  
	  ID: String,
	  firstName: String,
	  lastName: String,
	  middleNames: String,
	  height: Number, //cm
	  age: Number, //months
	  notes: Array
})