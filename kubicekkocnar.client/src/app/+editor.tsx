import React, { useEffect } from 'react';
import { Coinage } from '../types/Coinage';
import { ItemUpgrade } from '../types/ItemUpgrade';
import { GetCoinages } from '../api/Coinages';
import { GetUpgrades } from '../api/Upgrades';

const Editor: React.FC = () => {

  const [coinages, setCoinages] = React.useState<Coinage[]>();
  const [upgrades, setUpgrades] = React.useState<ItemUpgrade[]>();

  useEffect(() => {
    
    (async () => {      
      setCoinages(await GetCoinages());
      setUpgrades(await GetUpgrades());
    })();


  }, []);

  return (
      <div className='mainmenu'>
          <h1>EdItOr</h1>
          <div>
              <h2>Upgrades</h2>
              <ul>
                {upgrades?.map((upgrade) => (
                  <li key={upgrade.itemUpgradeId}>{upgrade.description}</li>
                ))}
              </ul>
          </div>
          <div>
              <h2>Coinages</h2>
              <ul>
                {coinages?.map((coinage) => (
                  <li key={coinage.coinageId}>{coinage.name}</li>
                ))}
              </ul>
          </div>
      </div>
  );
};

export default Editor;