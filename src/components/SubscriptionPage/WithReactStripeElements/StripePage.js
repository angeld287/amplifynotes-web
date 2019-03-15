import React from 'react';
import {
    StripeProvider,
} from 'react-stripe-elements';

import MyStoreCheckout from './MyStoreCheckout';

const StripePage = () => {
  return (
    <StripeProvider apiKey="pk_test_Sf3SVsdtbMDpkm2wiWzHe5k2">
      <MyStoreCheckout />
    </StripeProvider>
  );
};

export default StripePage;