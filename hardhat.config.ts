import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const INFURA_API_KEY = "1814ed7ba309440fbd665a8e929766f5";
const GOERLI_PRIVATE_KEY = "a344590710cb84b725e73f82ae21fcae16816c9cbc504bb4aacc4941a210e3d0";
require("@nomicfoundation/hardhat-chai-matchers")

const config: HardhatUserConfig = {
  solidity: "0.8.1",
};

export default config;
