
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/0mRQzdGahNloz6LeweVUTCFc6fF_110d',
      accounts: ['39646a7c94253955c1516c3dfeabdb8fd997731f70a36644f78e72cea209a827'],
    },
  },
};