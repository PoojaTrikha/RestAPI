import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {createStore} from redux;

ReactDOM.render(
<Provider store ={store}>
<App />
</Provider>, 
document.getElementById('root'));
registerServiceWorker();
