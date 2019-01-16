import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import Moment from 'react-moment';
import abiDecoder from 'abi-decoder';

import {
  Table,
  Text,
  Tooltip,
  Badge,
} from 'tabler-react';

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

export default class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
      block: '',
      date: Date.now(),
      method: ''
    };
  }

  componentWillMount() {
    const { hash, block } = this.props;

    web3.eth.getTransaction(hash).then(transaction => {
      const method = abiDecoder.decodeMethod(transaction.input);
      let state = {
        from: transaction.from,
        to: transaction.to
      };

      if (method) {
        state.method = method;
      }

      this.setState(state);
    });

    web3.eth.getTransactionReceipt(hash).then(receipt => {
      this.setState({
        gas: receipt.gasUsed,
        contractAddress: receipt.contractAddress,
      });
    });

    web3.eth.getBlock(block).then(b => this.setState({ date: b.timestamp }));
  }

  render() {
    const { hash, block } = this.props;
    const { from, to, gas, date, method, contractAddress } = this.state;

    return (
      <Table.Row>
        <Table.Col>
          <Link to={`/transaction/${hash}`} title={hash}><Text muted={true}>{hash.substring(0, 15)}...</Text></Link>
        </Table.Col>
        <Table.Col>
          {(from || '').substring(0, 15)}...
        </Table.Col>
        <Table.Col>
          {to
            ? <Text>{to.substring(0, 15)}...</Text>
            : <Text>Contract Creation<Text muted={true}>{(contractAddress || '').substring(0, 15)}...</Text></Text>
          }
        </Table.Col>
        <Table.Col>
          {gas}
        </Table.Col>
        <Table.Col className='text-nowrap'>
          <Moment format='MMM DD, h:mma'>{new Date(date * 1000)}</Moment>
        </Table.Col>
        <Table.Col>
          {block}
        </Table.Col>
        <Table.Col>
          {method
            ? <Text>
                {method.name}({method.params.map(x => (
                  <Tooltip content={'Value: ' + x.value} placement='bottom' key={x.name}>
                    <span> <Badge color='secondary' className='mr-1'>{x.name}</Badge></span>
                  </Tooltip>
                ))})
              </Text>
            : ''}
        </Table.Col>
      </Table.Row>
    );
  }
}
