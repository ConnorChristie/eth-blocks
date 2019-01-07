import React, { Component } from 'react';
import Web3 from 'web3';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import _ from 'lodash';
import {
  Page,
  Grid,
  StatsCard,
  Card,
  Table,
} from 'tabler-react';

import Wrapper from './Wrapper';
import PromisifyBatchRequest from '../utils/PromisifyBatchRequest';
import TransactionRow from '../components/TransactionRow';

const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

export default class Transactions extends Component {
  constructor(props) {
    super(props);

    this.db = low(new LocalStorage('eth-blocks'));
    this.db.defaults({
      transactions: {
        block: 0,
        latestBlock: 0,
        transactions: []
      }
    }).write();

    this.state = this.db.get('transactions').value();
  }

  componentWillUpdate(props, state) {
    this.db.set('transactions', state).write();
  }

  componentWillMount() {
    this.getCurrentBlock();
    this.blockUpdateInterval = setInterval(() => this.getCurrentBlock(), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.blockUpdateInterval);
  }

  getCurrentBlock() {
    web3.eth.getBlockNumber().then(block => {
      this.setState({ block }, async () => await this.getLatestTransactions());
    });
  }

  async getLatestTransactions() {
    const {
      block,
      latestBlock,
      transactions,
    } = this.state;

    const limit = Math.min(block, latestBlock + 1000);
    const batch = new PromisifyBatchRequest(web3);

    for (let i = latestBlock; i <= limit; i++) {
      batch.add(web3.eth.getBlock.request, i);
    }

    const blocks = await batch.execute();
    
    const newTransactions = blocks.filter(x => x.transactions)
      .map(b => b.transactions.map(t => ({ block: b.number, hash: t })))
      .reduce((prev, current) => prev.concat(current), []);

    const uniqueTransactions = _.chain(transactions)
      .concat(newTransactions)
      .uniqBy('hash')
      .orderBy('block', 'desc')
      .value();

    this.setState({
      transactions: uniqueTransactions,
      latestBlock: limit
    });
  }

  render() {
    const {
      block,
      transactions,
    } = this.state;

    return (
      <Wrapper>
        <Page.Content title='Transactions'>
          <Grid.Row cards={true}>
            <Grid.Col width={6} sm={4} lg={3}>
              <StatsCard layout={1} movement={6} total={block} label='Latest Block' />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={3}>
              <StatsCard layout={1} movement={6} total={transactions.length} label='Total Transactions' />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={3}>
              <StatsCard layout={1} movement={6} total='43' label='Number of Contracts' />
            </Grid.Col>
            <Grid.Col width={6} sm={4} lg={3}>
              <StatsCard layout={1} movement={6} total='43' label='Number of Accounts' />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row cards={true}>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Transactions</Card.Title>
                </Card.Header>
                <Table
                  cards={true}
                  highlightRowOnHover={true}
                  responsive={true}
                  className="table-vcenter"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColHeader>Txn Hash</Table.ColHeader>
                      <Table.ColHeader>From</Table.ColHeader>
                      <Table.ColHeader>To</Table.ColHeader>
                      <Table.ColHeader>Gas</Table.ColHeader>
                      <Table.ColHeader>Date (Block)</Table.ColHeader>
                      <Table.ColHeader>Contract Method</Table.ColHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {transactions.map(x => <TransactionRow hash={x.hash} block={x.block} key={x.hash} />)}
                  </Table.Body>
                </Table>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </Wrapper>
    );
  }
}