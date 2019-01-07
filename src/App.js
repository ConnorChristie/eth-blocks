import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'tabler-react/dist/Tabler.css';

import Transactions from './containers/Transactions';
import TransactionDetail from './containers/TransactionDetail';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Transactions} />
          <Route path="/transaction/:hash" component={TransactionDetail} />
        </Switch>
      </Router>
    );
  }
}

export default App;
