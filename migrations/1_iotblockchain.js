var SensorRanking = artifacts.require("./SensorRanking.sol");

module.exports = function (deployer) {
    deployer.deploy(SensorRanking);
}
