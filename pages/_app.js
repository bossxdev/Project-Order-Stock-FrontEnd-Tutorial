import React from 'react';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { wrapper } from 'store';
import { Suspense } from 'react';

const WrappedApp = ({ Component, pageProps }) => {
  const store = useStore((state) => {
    return state;
  });

  return (
    <div>
      <PersistGate persistor={store.__persistor} loading={null}>
        <Suspense fallback={null}>
          <Component {...pageProps} />
        </Suspense>
      </PersistGate>
    </div>
  );
};

export default wrapper.withRedux(WrappedApp);
