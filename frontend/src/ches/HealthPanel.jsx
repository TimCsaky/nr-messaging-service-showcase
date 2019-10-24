import React, {Component} from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import ChesValidationError from './ChesValidationError';

const CHES_ROOT = process.env.REACT_APP_CHES_ROOT || '';
const CHES_PATH = `${CHES_ROOT}/ches/v1`;
const HEALTH_URL = `${CHES_PATH}/health`;

class HealthPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api: false,
      smtp: false
    };
  }

  async componentDidMount() {
    await this.healthCheck();

    this.interval = setInterval(async () => {
      await this.healthCheck();
    }, 60000*5);
  }

  componentWillUnmount() {
  }


  async healthCheck() {
    let { apiOk, smtpOk } = false;
    try {
      this.props.onBusy(true);
      const user = await this.props.authService.getUser();
      const response = await axios.get(
        HEALTH_URL,
        {
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      ).catch(e => {
        if (e && e.response && e.response.status === 422) {
          throw new ChesValidationError(e.response.data);
        } else {
          throw Error('Could not get health check data from Showcase CHES API: ' + e.message);
        }
      });
      apiOk = (response.status >= 200 && response.status < 400);
      response.data.endpoints.forEach((p) => {
        if (p.name === 'SMTP Endpoint') {
          smtpOk = p.healthCheck;
        }
      });
      this.props.onBusy(false);
    } catch (err) {
      this.props.onBusy(false, err);
    }
    this.setState({ api: apiOk, smtp: smtpOk });
  }

  render() {
    const apiIndClass = this.state.api ? 'icon good' : 'icon bad';
    const smtpIndClass = this.state.smtp ? 'icon good' : 'icon bad';

    return (
      <div id="healthCheck">
        <div className="row">
          <div className="col-sm-10 hc-text">Common Hosted Email Service available</div>
          <div className="col-sm-2"><span id="apiInd" className={apiIndClass}/></div>
        </div>
        <div className="row">
          <div className="col-sm-10 hc-text">SMTP available</div>
          <div className="col-sm-2"><span id="smtpInd" className={smtpIndClass}/></div>
        </div>
      </div>
    );
  }
}

HealthPanel.propTypes = {
  authService: PropTypes.object,
  onBusy: PropTypes.func
};

export default HealthPanel;
