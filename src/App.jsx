import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import abiDecoder from 'abi-decoder';

import 'tabler-react/dist/Tabler.css';

import Contracts from './containers/Contracts';
import Transactions from './containers/Transactions';
import TransactionDetail from './containers/TransactionDetail';

class App extends Component {
  componentDidMount() {
    const { contracts } = this.props.contracts;

    for (const contract in contracts) {
      abiDecoder.addABI(contracts[contract]);
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Transactions} />
          <Route exact path="/transaction/:hash" component={TransactionDetail} />
          <Route exact path="/contracts" component={Contracts} />
        </Switch>
      </Router>
    );
  }
}

export default connect(
  ({ contracts }) => ({ contracts })
)(App);
