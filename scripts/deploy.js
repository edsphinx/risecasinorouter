/**
 * @title Deploy Uniswap V2 Router02
 * @notice Deploys UniswapV2Router02 to Rise Testnet
 * @dev Run: npx hardhat run scripts/deploy.js --network rise_testnet
 * 
 * IMPORTANT: You must first deploy the Factory and get the INIT_CODE_HASH
 * Then update the UniswapV2Library.sol with the correct hash!
 */

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying Router02 with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Required addresses
    const factoryAddress = process.env.FACTORY_ADDRESS;
    const wethAddress = process.env.WETH_ADDRESS;

    if (!factoryAddress) {
        throw new Error("FACTORY_ADDRESS not set in environment!");
    }
    if (!wethAddress) {
        throw new Error("WETH_ADDRESS not set in environment!");
    }

    console.log("\n--- Deploying UniswapV2Router02 ---");
    console.log("Factory:", factoryAddress);
    console.log("WETH:", wethAddress);

    const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
    const router = await UniswapV2Router02.deploy(factoryAddress, wethAddress);
    await router.deployed();

    console.log("UniswapV2Router02 deployed to:", router.address);

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        router: router.address,
        factory: factoryAddress,
        weth: wethAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };

    console.log("\n--- Deployment Info ---");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Write to file for reference
    const fs = require("fs");
    fs.writeFileSync(
        `deployment-router-${hre.network.name}.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\nDeployment info saved to deployment-router-${hre.network.name}.json`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
