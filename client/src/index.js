import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DimensionContextProvider from './contexts/dimensionContext';
import UserContextProvider from './contexts/userContext';

ReactDOM.render(
  <UserContextProvider>
    <DimensionContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    </DimensionContextProvider>
  </UserContextProvider>,
  document.getElementById('root')
);