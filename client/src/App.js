import Web3 from "web3";
import {useState, useEffect} from "react";
import SensorRanking from "./contracts/SensorRanking.json";

import './App.css';

function App() {
  const [state,setState] = useState({web3:null, contract:null});
  const [centralWeightPool,setCentralWeightPool] = useState("nil");
  const [sensorCount,setSensorCount] = useState("nil");
  const [sensorList,setSensorList] = useState([]);
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    async function fetchNetworkData() {
      try {
        const web3 = new Web3(provider);
        
        const networkID = await web3.eth.net.getId();
        const deployedNetwork = SensorRanking.networks[networkID];
        const contract = new web3.eth.Contract(SensorRanking?.abi,deployedNetwork?.address)

        setState({web3:web3,contract:contract})
      } catch (error) {
        console.error("Error fetching network data:", error);
      }
    }
    
    provider && fetchNetworkData();
  }, []);

  useEffect(() => {

    // reading central weight pool
    async function readCentralWeightPoolData() {
      try {
        const { contract } = state;
        if (contract) {
          const data1 = await contract.methods.getCentralWeightPool().call();
          setCentralWeightPool(data1.toString());
        }
      } catch (error) {
        console.error("Error readCentralWeightPoolData data:", error);
      }
    }

    // reading the number of sensors
    async function readSensorCountData() {
      try {
        const { contract } = state;
        if (contract) {
          const data1 = await contract.methods.getSensorCount().call();
          setSensorCount(data1.toString());
        }
      } catch (error) {
        console.error("Error readSensorCountData data:", error);
      }
    }

    // get sorted sensor list
    async function readSensorListData() {
        try {
          const { contract } = state;
          if (contract) {
            const data1 = await contract.methods.getSortedSensors().call();
            setSensorList(data1.toString());
          }
        } catch (error) {
          console.error("Error getSortedSensors data:", error);
        }
      }

    
    readCentralWeightPoolData();
    readSensorCountData();
    readSensorListData();
  }, [state]);

  async function writeData(){
    try{
      const {contract} = state;
      const sensorID = document.querySelector('#sensorID').value;
      const moisture = parseInt(document.querySelector('#moisture').value)
      const ph = parseInt(document.querySelector('#ph').value)
    //   await contract.methods.addSensorReading("Sensor1", 3600, 600).send({from:"0xa5d0e56645b46a7BdBfd8F33ffAe9Ebdf9E3dd12"});
      await contract.methods.addSensorReading(sensorID, moisture, ph).send({ from: "0xcae0B7603746bB7193d9e2eD4AaCDCbFCdd61889", gas: 200000 }); // Increase the gas limit as needed

      window.location.reload();
    // console.log('write data');
    // console.log(typeof sensorID);
    // console.log(typeof moisture);
    // console.log(typeof ph);
    }catch (error) {
      console.error("Error writting data:", error);
    }
  }

  return (
    <div className="flex flex-col justify-center">
        <p className="text-4xl font-bold">The centralWeightPool is: {centralWeightPool}</p>
        <p className="text-4xl font-bold">Total Sensor Count: {sensorCount}</p>
        <p className="text-4xl font-bold">Sensor List: {sensorList}</p>
        <div className="mb-6 flex flex-col gap-5">
            <p className="block mb-2 text-lg font-medium text-gray-900">Sensor ID</p>
            <input type="text" id="sensorID" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"/>
            <p className="block mb-2 text-lg font-medium text-gray-900">Moisture</p>
            <input type="text" id="moisture" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"/>
            <p className="block mb-2 text-lg font-medium text-gray-900">Ph</p>
            <input type="text" id="ph" className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"/>
            <button onClick={writeData} className="text-white bg-blue-700 px-5 py-2 rounded-lg w-[25%]">Submit</button>
        </div>
    </div>
  );
}

export default App;