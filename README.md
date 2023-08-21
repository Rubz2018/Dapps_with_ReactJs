# Dapps_with_ReactJs

### The installation starts with the follwoing dependncies to be available in the local environment:
 - Truffle Suit
 - Node js
 - Ganache 
 - web3.js
 - Git
 - VsCode

 #### Truffle installation:
 We need to install nodejs and npm to install the following commands:
 - npm install -g truffle

#### Install Ganache:
download and install Ganache blockhain simulator from the official website.

#### Run the truffle File folder suit 

command : truffle init

#### Changing the truffle-config.js
Need to change the test blockchain, which is in this case Ganache.
The truffle-config.js files should the following block codes enabled and modified:
contracts_build_directory: "./client/src/contracts", // This will create the build folder under frontend(client) folder
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache, geth, or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
#### Adding smart contract files inside the contracts folder:
The smart contract is  iot_blockchain.sol.
This is a draft solidity contract that has the functionality of the following:

- It has the option to enter sensor_ID, moisture and ph level.
- Then there is an option to check those reading and incentivize or penalize it if the reading goes out of the standard range.

#### running the smart contracts inside truffle :
command : truffle migrate --reset
This command must run after the local test blockchain (Ganache) runs. For example, this git repo cloned in a different pc, then the artifacts(contract address and abi) will change accordingly. So, the code will create new artifacts accordingly.   