import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./store";
// import store from './store.js';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClint = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClint}>
    <Provider store={store}>
      {/* store.js 안에 있는 state들을 사용가능. */}
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Provider>
    {/* react-router-dom 설치 후 반드시 적용. */}
  </QueryClientProvider>
);
reportWebVitals();