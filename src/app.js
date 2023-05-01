
/*...........................................................................................................................
*/
//final please work
const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const contract = require('truffle-contract');

const app = express();

// Loading the compiled smart contract
const MedicalRecordsJSON = require('../build/contracts/MedicalRecords.json');

app.use(bodyParser.json());

// Connect to Ganache
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Create an instance of the smart contract
const medicalRecords = contract(MedicalRecordsJSON);
medicalRecords.setProvider(web3.currentProvider);

// Get the accounts from Ganache
web3.eth.getAccounts((err, accounts) => {
  if (err) throw err;

  // Set the default account (the first account in Ganache)
  medicalRecords.defaults({ from: accounts[0] });
});

// Add a new medical record
app.post('/records', async (req, res) => {
  const { aadharID, name, age, gender, medicalhistory, reportLocation } = req.body;
  try {
    // Add the medical record to the smart contract
    const result = await medicalRecords.deployed().then(instance => instance.addPatient(parseInt(aadharID), name, parseInt(age), gender, medicalhistory,reportLocation));

    res.status(201).json({ message: 'Medical record added successfully', transaction: result.tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add medical record' });
  }
});

// Delete a medical record by Aadhar ID
app.delete('/records/:aadharid', async (req, res) => {
  const aadharid = req.params.aadharid;

  try {
    const id = await medicalRecords.deployed().then(instance => instance.getPatientIdByAadharID(parseInt(aadharid)));
    await medicalRecords.deployed().then(instance => instance.deletePatient(id).send({ gas: 1000000 }));

    res.status(201).json({ message: 'Medical record deleted successfully' });

  } catch (err) {

    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});


// Get a medical record by Aadhar ID
app.get('/records', async (req, res) => {
  const aadharID = parseInt(req.query.aadharID);
  try {
    const id = await medicalRecords.deployed().then(instance => instance.getPatientIdByAadharID(aadharID));
    const patientRecord = await medicalRecords.deployed().then(instance => instance.getPatient(id));
    
    // Create an object with field names
    const result = {
      aadharID: parseInt(patientRecord[0]),
      name: patientRecord[1],
      age: parseInt(patientRecord[2]),
      gender: patientRecord[3],
      medicalhistory: patientRecord[4],
      reportLocation: patientRecord[5]
    };
    
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get medical record' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
