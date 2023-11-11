import React from 'react';

import {StyledView} from '../../../styles';

const Tabs = ({activeTab}) => {
  return (
    <StyledView mb="28px" mt="46px" justifyContent="center" flexDirection="row">
      {[0, 1, 2].map(tabNum => (
        <StyledView
          height="10px"
          mr="8px"
          width="10px"
          br="5px"
          backgroundColor={activeTab === tabNum ? 'white' : '#23355F'}
          key={tabNum}
        />
      ))}
    </StyledView>
  );
};

export default Tabs;
