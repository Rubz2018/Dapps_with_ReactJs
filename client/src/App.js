import Web3 from "web3";
import { useState, useEffect } from "react";
import SensorRanking from "./contracts/SensorRanking.json";

import "./App.css";

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [centralWeightPool, setCentralWeightPool] = useState("nil");
  const [sensorCount, setSensorCount] = useState("nil");
  const [sensorList, setSensorList] = useState([]);
  const [sortedSensorList, setSortedSensorList] = useState([]);
  const [sensorInfo, setsensorInfo] = useState([]);
  const [sensorIndex, setSensorIndex] = useState(0);

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    async function fetchNetworkData() {
      try {
        const web3 = new Web3(provider);

        const networkID = await web3.eth.net.getId();
        const deployedNetwork = SensorRanking.networks[networkID];
        const contract = new web3.eth.Contract(
          SensorRanking?.abi,
          deployedNetwork?.address
        );

        setState({ web3: web3, contract: contract });
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

    // get unsorted sensor list
    async function readSensorListData() {
      try {
        const { contract } = state;
        if (contract) {
          const data1 = await contract.methods.getSortedSensors().call();
          setSensorList(data1);
        }
      } catch (error) {
        console.error("Error getSortedSensors data:", error);
      }
    }
    readCentralWeightPoolData();
    readSensorCountData();
    readSensorListData();
    getSingleSensorData();
  }, [state]);

  // add sensor reading data
  async function writeData() {
    try {
      const { contract } = state;
      const sensorID = document.querySelector("#sensorID").value;
      const moisture = parseInt(document.querySelector("#moisture").value);
      const ph = parseInt(document.querySelector("#ph").value);
      //   await contract.methods.addSensorReading("Sensor1", 3600, 600).send({from:"0xa5d0e56645b46a7BdBfd8F33ffAe9Ebdf9E3dd12"});
      await contract.methods.addSensorReading(sensorID, moisture, ph).send({
        from: "0xfFC5c77d8FA31D072bC355Ad3dFB42e71d601aEa",
        gas: 200000,
      }); // Increase the gas limit as needed

      window.location.reload();
    } catch (error) {
      console.error("Error writting data:", error);
    }
  }

  // Getting sorted sensor list
  async function getSortedSensors() {
    try {
      const { contract } = state;
      if (contract) {
        await contract.methods.sortSensors().call();
        // const data1 = await contract.methods.getSortedSensors().call();
        const data1 = await contract.methods.sortSensors().call();
        setSortedSensorList(data1);
      }
    } catch (error) {
      console.error("Error getSortedSensors data:", error);
    }
  }

  // Getting single sensor data
  async function getSingleSensorData() {
    try {
      const { contract } = state;
      if (contract) {
        const data1 = await contract.methods.getSensor(sensorIndex).call();
        setsensorInfo(data1);
      }
    } catch (error) {
      console.error("Error getSingleSensorData data:", error);
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <p className="text-4xl font-bold">
        The centralWeightPool is: {centralWeightPool}
      </p>
      <p className="text-4xl font-bold mt-5">
        Total Sensor Count: {sensorCount}
      </p>

      {/* Sensor list  */}
      <div className="mt-5">
        <p className="text-4xl font-bold">Existing Sensor List:</p>
        {sensorList.map((el, i) => {
          return (
            <p key={i} className="text-2xl">
              <span className="font-bold">Array Index: </span> {i}
              <span className="font-bold"> SensorId:</span> {el.sensorId}{" "}
              <span className="font-bold">TotalWeight:</span>{" "}
              {el.totalWeight.toString()}
            </p>
          );
        })}
      </div>

      {/* Get Single Sensor data  */}
      <div className="mt-5">
        <p className="text-4xl font-bold">Single Sensor Info</p>
        <select
          id="sensorNameList"
          onChange={(e) => setSensorIndex(parseInt(e.target.value))}
          className="w-[25%] bg-gray-500 text-white py-2 rounded-lg mr-2"
        >
          {sensorList.map((el, i) => {
            return (
              <option key={i} value={i}>
                {el.sensorId}
              </option>
            );
          })}
        </select>
        <button
          onClick={getSingleSensorData}
          className="text-white bg-blue-700 px-5 py-2 rounded-lg w-[25%]"
        >
          Get Single Sensor Info
        </button>
        {sensorInfo[0] && (
          <div>
            <p className="text-2xl">
              <span className="font-bold"> SensorId:</span>{" "}
              {sensorInfo[0] ? sensorInfo[0] : ""}{" "}
              <span className="font-bold">TotalWeight:</span>{" "}
              {sensorInfo[1] ? sensorInfo[1].toString() : ""}
            </p>
          </div>
        )}
      </div>

      {/* Add sensor reading  */}
      <div className="mb-6 flex flex-col gap-5 mt-4">
        <p className="text-4xl font-bold">Add Sensor Reading:</p>
        <div>
          <p className="block text-lg font-medium text-gray-900">Sensor ID</p>
          <input
            type="text"
            id="sensorID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"
          />
        </div>
        <div>
          <p className="block text-lg font-medium text-gray-900">Moisture</p>
          <input
            type="text"
            id="moisture"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"
          />
        </div>
        <div>
          <p className="block text-lg font-medium text-gray-900">Ph</p>
          <input
            type="text"
            id="ph"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-[25%]"
          />
        </div>
        <button
          onClick={writeData}
          className="text-white bg-blue-700 px-5 py-2 rounded-lg w-[25%]"
        >
          Submit
        </button>
      </div>

      {/* Show Sorted Sensor List  */}
      <div className="flex flex-col gap-3">
        <p className="text-4xl font-bold">
          Sorted Sensor List: (Click Button to get the list)
        </p>
        {sortedSensorList.length > 0 && (
          <div>
            {sortedSensorList.map((el, i) => {
              return (
                <p key={i} className="text-2xl">
                  <span className="font-bold">Rank: </span> {i + 1}
                  <span className="font-bold"> SensorId:</span> {el.sensorId}{" "}
                  <span className="font-bold">TotalWeight:</span>{" "}
                  {el.totalWeight.toString()}
                </p>
              );
            })}
          </div>
        )}

        <button
          onClick={getSortedSensors}
          className="text-white bg-blue-700 px-5 py-2 rounded-lg w-[25%]"
        >
          Get Sorted Sensors
        </button>
      </div>
    </div>
  );
}

export default App;
