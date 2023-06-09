
pragma solidity ^0.5.16;

contract MedicalRecords {
    struct Patient {
        uint id;
        uint aadharID;
        string name;
        uint age;
        string gender;
        string medicalHistory;
        string reportLocation; // new field for storing reference to medical report
    }

    mapping (uint => Patient) public patients;
    uint public patientCount;

    constructor() public {
        addPatient(1234, "Shahbaz", 21, "male", "Cholesterol, BP", "1234ab");
        addPatient(1235, "Prachi", 21, "female", "low BP", "1235ab");
        addPatient(1236, "Sumedh", 21, "male", "TB", "1236ab");
    }

    function addPatient(uint _aadharID, string memory _name, uint _age, string memory _gender, string memory _medicalHistory, string memory _reportLocation) public {
        patientCount++;
        patients[patientCount] = Patient(patientCount, _aadharID, _name, _age, _gender, _medicalHistory, _reportLocation);
    }

    function deletePatient(uint _id) public {
        require(_id > 0 && _id <= patientCount, "Invalid patient ID!");
        delete patients[_id];
    }

    function getPatientIdByAadharID(uint _aadharID) public view returns (uint) {
        for (uint i = 1; i <= patientCount; i++) {
            if (patients[i].aadharID == _aadharID) {
                return patients[i].id;
            }
        }
        revert("Patient with given Aadhar ID not found!");
    }

    function getPatient(uint _id) public view returns (uint, string memory, uint, string memory, string memory, string memory) {
        require(_id > 0 && _id <= patientCount, "Invalid patient ID!");
        return (patients[_id].aadharID, patients[_id].name, patients[_id].age, patients[_id].gender, patients[_id].medicalHistory, patients[_id].reportLocation);
    }

    function getAllPatients() public view returns (uint[] memory) {
        uint[] memory patientIds = new uint[](patientCount);
        uint j = 0;
        for (uint i = 1; i <= patientCount; i++) {
            if (patients[i].id != 0) {
                patientIds[j] = patients[i].id;
                j++;
            }
        }
        return patientIds;
    }
}