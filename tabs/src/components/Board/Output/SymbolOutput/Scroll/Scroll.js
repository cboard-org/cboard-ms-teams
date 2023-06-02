import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Scannable } from 'react-scannable';

import './Scroll.css';

export class Scroll extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    theme: PropTypes.object
  };

  render() {
    const {
      children,
      style,
      theme: { direction },
      scrollContainerReference,
      ...other
    } = this.props;

    return (
      <Scannable>
        <div
          className="Scroll__container"
          id="style-1"
          style={{ ...style, direction }}
          ref={scrollContainerReference}
          {...other}
        >
          {children}
        </div>
      </Scannable>
    );
  }
}

export default withStyles(null, { withTheme: true })(Scroll);
