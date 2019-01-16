import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { dismissAlert } from '../actions/alertStatus';
import FadeFlip from '../components/FadeFlip';

import {
  Site,
  Form,
  Grid,
  Button,
  Icon,
  Alert,
  Page,
  RouterContextProvider
} from 'tabler-react';

const navBarItems = [
  {
    value: 'Transactions',
    icon: 'layers',
    to: '/',
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: 'Contracts',
    icon: 'box',
    to: '/contracts',
    LinkComponent: withRouter(NavLink)
  }
];

class Wrapper extends React.Component {
  render() {
    const { title } = this.props;
    const { visible, message } = this.props.alertStatus;

    return (
      <Site.Wrapper
        navProps={{
          itemsObjects: navBarItems,
          rightColumnComponent: (
            <Form.Input
              icon="search"
              placeholder="Search..."
              position="append"
            />
          )
        }}
        headerProps={{
          href: '/',
          alt: 'Eth Blocks',
        }}
        footerProps={{
          note: 'Ethereum Block and Contract Explorer',
          copyright: (
            <React.Fragment>
              Made with <Icon prefix="fa" name="heart" /> by Connor Christie
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto>
                <Button
                  href="https://github.com/tabler/tabler-react"
                  size="sm"
                  outline
                  color="primary"
                  RootComponent="a"
                >
                  Source code
                </Button>
              </Grid.Col>
            </React.Fragment>
          ),
        }}
        routerContextComponentType={withRouter(RouterContextProvider)}
      >
        <Page.Content title={title}>
          <Grid.Row>
            <Grid.Col>
              <FadeFlip visible={visible}>
                <Alert type="success" icon="check" isDismissible onDismissClick={this.props.dismissAlert}>
                  {message}
                </Alert>
              </FadeFlip>
            </Grid.Col>
          </Grid.Row>
          {this.props.children}
        </Page.Content>
      </Site.Wrapper>
    );
  }
}

export default connect(
  ({ alertStatus }) => ({ alertStatus }),
  (dispatch) => ({
    dismissAlert: bindActionCreators(dismissAlert, dispatch)
  })
)(Wrapper);