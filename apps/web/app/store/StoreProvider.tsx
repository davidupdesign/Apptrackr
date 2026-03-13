// this is a separate client component for the Provider. 

'use client'; 

import { Provider } from 'react-redux';
import { store } from './index';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}