import React, { Component } from 'react';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import Flip from 'react-reveal/Flip';
import Web3 from 'web3';
import low from 'lowdb';
import _ from 'lodash';
import {
  Page,
  Grid,
  StatsCard,
  Card,
  Table,
  Button,
  Alert,
} from 'tabler-react';

import Wrapper from './Wrapper';
import PromisifyBatchRequest from '../utils/PromisifyBatchRequest';
import TransactionRow from '../components/TransactionRow';

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

export default class Transactions extends Component {
  render() {
    return (
      <Wrapper>
        <Page.Content title='Smart Contracts'>
          <Grid.Row cards>
            <Grid.Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Uploaded Contract ABIs</Card.Title>
                </Card.Header>
                <Table
                  cards={true}
                  highlightRowOnHover={true}
                  responsive={true}
                  className='table-vcenter'
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColHeader>Contract Name</Table.ColHeader>
                      <Table.ColHeader>Address</Table.ColHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {/* {_.take(transactions, 10).map(x => <TransactionRow hash={x.hash} block={x.block} key={x.hash} />)} */}
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