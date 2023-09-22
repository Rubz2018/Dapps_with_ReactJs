import Web3 from "web3";
import {useState, useEffect} from "react";
import SensorRanking from "./contracts/SensorRanking.json";
import './App.css';

function App() {
  const [state,setState] = useState({web3:null, contract:null});
  const [data,setData] = useState("nil");
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
    async function readData() {
      try {
        const { contract } = state; // Use the contract directly from the state
        if (contract) {
          const data1 = await contract.methods.getCentralWeightPool().call();
          setData(data1.toString());
        }
      } catch (error) {
        console.error("Error reading data:", error);
      }
    }
    
    readData();
  }, [state]);

  console.log("data-----------",data)

  return (
    <div className="flex flex-col justify-center">
      <p className="text-9xl font-bold">Dapp with ReactJS</p>
      <p className="text-9xl font-bold">The data is: {data}</p>
    </div>
  );
}

export default App;
