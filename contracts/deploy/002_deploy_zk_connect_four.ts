import { type HardhatRuntimeEnvironment } from 'hardhat/types';
import { type DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;

  const { deployer } = await getNamedAccounts();
  const { address } = await get('PlonkVerifier');

  await deploy('ZKConnectFour', {
    from: deployer,
    args: [address],
    log: true,
    autoMine: true // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
};

export default func;

func.tags = ['ZKConnectFour'];
