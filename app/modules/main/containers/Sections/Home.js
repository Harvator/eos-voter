// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  HashRouter,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

import ColdWalletContainer from './ColdWallet';
import GlobalBlockchainManage from '.../../../shared/containers/Global/Blockchain/Manage';
import HomeAccountsContainer from './Home/Accounts';
import HomeInitializeContainer from './Home/Initialize';
import HomeUpgradeContainer from './Home/Upgrade';
import OverviewContainer from './Overview';

class HomeContainer extends Component<Props> {
  constructor(props) {
    super(props);
    this.checkForRedirect();
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.checkForRedirect();
    }
  }
  checkForRedirect = () => {
    const {
      history,
      settings,
      wallets,
    } = this.props;
    const {
      pathname
    } = history.location;
    if (!settings.walletInit) {
      if (pathname !== '/home/init') {
        history.push('/home/init');
      }
    } else if (!settings.chainId || !settings.blockchains || settings.blockchains.length === 0) {
      if (pathname !== '/home/blockchains') {
        history.push('/home/blockchains');
      }
    } else if (!wallets || wallets.length === 0) {
      if (pathname !== '/home/accounts') {
        history.push('/home/accounts');
      }
    } else if (settings.walletMode === 'cold') {
      if (pathname !== '/home/coldwallet') {
        history.push('/home/coldwallet');
      }
    }
  }
  render() {
    const {
      upgradable
    } = this.props;
    let interrupt;
    if (upgradable) {
      interrupt = <HomeUpgradeContainer />
    }
    return (
      <React.Fragment>
        {interrupt}
        <HashRouter>
          <Switch>
            <Route exact path="/" component={OverviewContainer} />
            <Route path="/home/accounts" component={HomeAccountsContainer} />
            <Route path="/home/blockchains" component={GlobalBlockchainManage} />
            <Route path="/home/coldwallet" component={ColdWalletContainer} />
            <Route path="/home/init" component={HomeInitializeContainer} />
            <Route path="/home/upgrade" component={HomeUpgradeContainer} />
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    auths:state.auths,
    storage:state.storage,
    connection:state.connection,
    settings: state.settings,
    test: state.wallets,
    wallets: state.wallets.filter(w => (w.chainId === state.settings.chainId)),
    // Determine if any wallets require an upgrade from v1
    upgradable: state.wallets.filter(w => w.data).length,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({

    }, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeContainer));
