import React, { Component } from 'react';
import Web3 from 'web3';
import abiDecoder from 'abi-decoder';

import {
  Card,
  Grid,
  Page,
  Header,
  Tooltip,
  List,
  Badge,
  Text,
} from 'tabler-react';

import Wrapper from './Wrapper';
import './TransactionDetail.css';

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const MethodCall = ({ name, params, color }) => (
  <Card
    isCollapsible
    isCollapsed
    title={(
      <Text>
        {name}({params.map(x => (
          <Tooltip content={'Value: ' + x.value} placement='bottom' key={x.name}>
            <span> <Badge color='secondary' className='mr-1'>{x.name}</Badge></span>
          </Tooltip>
        ))})
      </Text>
    )}
  >
    <Card.Status color={color} side />
    <Card.Body>
      <List.Group style={{ wordBreak: 'break-all' }}>
        {params.map(x => (
          <List.GroupItem key={x.name}>
            <Badge color='secondary' className='mr-1'>{x.name}</Badge>: {x.value}
          </List.GroupItem>
        ))}
      </List.Group>
    </Card.Body>
  </Card>
);

export default class TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: props.match.params.hash,
      method: null,
      logs: []
    };
  }

  componentDidMount() {
    const { hash } = this.state;

    web3.eth.getTransaction(hash).then(transaction => {
      this.setState({
        method: abiDecoder.decodeMethod(transaction.input)
      });
    });

    web3.eth.getTransactionReceipt(hash).then(receipt => {
      const logs = abiDecoder.decodeLogs(receipt.logs);
      this.setState({
        block: receipt.blockNumber,
        gas: receipt.gasUsed,
        logs
      });
    });
  }

  render() {
    const { hash, block, gas, method, logs } = this.state;
    return (
      <Wrapper>
        <Page.Content title={`Transaction ${hash}`}>
          <Grid.Row>
            <Grid.Col width={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Transaction Information</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Header.H6>Hash</Header.H6>
                  <p>{hash}</p>
                  <Header.H6>Block</Header.H6>
                  <p>{block}</p>
                  <Header.H6>Gas Used</Header.H6>
                  <p>{gas}</p>
                </Card.Body>
              </Card>
            </Grid.Col>
            <Grid.Col width={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Contract Method and Logs</Card.Title>
                </Card.Header>
                <Card.Body>
                  {method && <MethodCall name={method.name} params={method.params} key={method.name} color="blue"></MethodCall>}
                  {logs.map(log => <MethodCall name={`emit ${log.name}`} params={log.events} key={log.name} color="green"></MethodCall>)}
                </Card.Body>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </Wrapper>
    );
  }
}
