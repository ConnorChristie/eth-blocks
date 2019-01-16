import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { addContract } from '../actions/contracts';
import { getLatestTransactions } from '../actions/transactions';

import {
  Grid,
  StatsCard,
  Card,
  Table,
  Button,
} from 'tabler-react';

import Wrapper from './Wrapper';
import TransactionRow from '../components/TransactionRow';

class Transactions extends Component {
  componentDidMount() {
    this.blockUpdateInterval = setInterval(() => this.props.getLatestTransactions(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.blockUpdateInterval);
  }

  _addContractAbi = () => {
    this.props.addContract('Migrations', require('../Migrations.json').abi);
  }

  render() {
    const {
      currentBlock,
      transactions
    } = this.props.transactions;

    return (
      <Wrapper title='Transactions'>
        <Grid.Row cards deck>
          <Grid.Col width={4}>
            <StatsCard layout={2} movement={7} total={currentBlock} label='Latest Block' />
          </Grid.Col>
          <Grid.Col width={4}>
            <StatsCard layout={2} movement={6} total={transactions.length} label='Total Transactions' />
          </Grid.Col>
          <Grid.Col width={4}>
            <StatsCard layout={2} movement={3} total='Contract ABIs' label={(
              <Button outline color="primary" size="sm" icon="upload" onClick={this._addContractAbi}>
                Add Contract ABI
              </Button>
            )} />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row cards>
          <Grid.Col lg={12}>
            <Card>
              <Card.Header>
                <Card.Title>Transactions</Card.Title>
              </Card.Header>
              <Table
                cards={true}
                highlightRowOnHover={true}
                responsive={true}
                className='table-vcenter'
              >
                <Table.Header>
                  <Table.Row>
                    <Table.ColHeader>Txn Hash</Table.ColHeader>
                    <Table.ColHeader>From</Table.ColHeader>
                    <Table.ColHeader>To</Table.ColHeader>
                    <Table.ColHeader>Gas</Table.ColHeader>
                    <Table.ColHeader>Date</Table.ColHeader>
                    <Table.ColHeader>Block</Table.ColHeader>
                    <Table.ColHeader>Contract Method</Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.take(transactions, 10).map(x => <TransactionRow hash={x.hash} block={x.block} key={x.hash} />)}
                </Table.Body>
              </Table>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Wrapper>
    );
  }
}

export default connect(
  ({ transactions }) => ({ transactions }),
  (dispatch) => ({
    addContract: bindActionCreators(addContract, dispatch),
    getLatestTransactions: bindActionCreators(getLatestTransactions, dispatch),
  })
)(Transactions);
