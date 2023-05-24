const survey = artifacts.require('survey')

module.exports = function(deployer){
    deployer.deploy(survey)
}