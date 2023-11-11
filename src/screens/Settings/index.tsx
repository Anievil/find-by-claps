import React from 'react';

import {StyledView} from '../../styles';
import {DropDownList} from '../../components';

import ICHand from '../../../assets/icons/hand.svg';
import ICMelody from '../../../assets/icons/melody.svg';
import ICVibration from '../../../assets/icons/vibration.svg';
import ICFlash from '../../../assets/icons/flash.svg';

const settindsItems = [
  {
    title: 'sensitivity',
    Icon: ICHand,
    childrenItemsType: 'swipe',
    childrenItems: [''],
  },
  {
    title: 'melody',
    Icon: ICMelody,
    childrenItemsType: 'swipe',
    childrenItems: ['volume'],
  },
  {
    title: 'vibration',
    Icon: ICVibration,
    childrenItemsType: 'radio',
    childrenItems: ['default', 'strongVibration', 'heartbeat', 'tickTock'],
  },
  {
    title: 'flashlight',
    Icon: ICFlash,
    childrenItemsType: 'radio',
    childrenItems: ['default', 'disco', 'sos'] ,
  },
];

const Settings = () => {
  return (
    <StyledView>
      <DropDownList settindsItems={settindsItems} />
    </StyledView>
  );
};

export default Settings;
