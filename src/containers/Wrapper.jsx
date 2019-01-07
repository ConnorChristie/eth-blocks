import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import {
  Site,
  Form,
  RouterContextProvider
} from 'tabler-react';

const navBarItems = [
  {
    value: 'Transactions',
    icon: 'layers',
    to: '/',
    LinkComponent: withRouter(NavLink)
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
    return (
      <Site.Wrapper
        footerProps={{}}
        routerContextComponentType={withRouter(RouterContextProvider)}
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
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default Wrapper;