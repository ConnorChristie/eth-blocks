import React, { Component } from 'react';
import posed from 'react-pose';

export default class FadeFlip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: Math.random(),
      visible: false
    };
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;

    if (visible !== prevVisible) {
      if (!visible) {
        setTimeout(() => this.setState({ visible: false }), 600);
      } else {
        this.setState({ visible: true });
      }
    }
  }

  render() {
    const { visible, children } = this.props;
    const { visible: stateVisible, key } = this.state;

    return (visible || stateVisible) && (
      <FadeFlipAnimation key={key} initialPose="closed" pose={visible ? 'open' : 'closed'}>{children}</FadeFlipAnimation>
    );
  }
}

const FadeFlipAnimation = posed.div({
  open: {
    height: '100%',
    opacity: 1,
    delay: 300,
    transition: {
      height: { type: 'spring', stiffness: 400, damping: 30 },
      default: { duration: 300 }
    }
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { delay: 300 },
      default: { duration: 300 }
    }
  }
});
