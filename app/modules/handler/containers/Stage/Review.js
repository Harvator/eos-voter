// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'lodash/fp/compose';
import { Grid, Header, Segment } from 'semantic-ui-react';

import PromptReviewControls from '../../components/Review/Controls';
import ErrorMessage from '../../components/error';
import PromptFragmentPlaceholderTransactionAction from '../../components/Fragment/Placeholder/Transaction/Action';
import PromptFragmentTransactionAction from '../../components/Fragment/Transaction/Action';

class PromptStageReview extends Component<Props> {
  render() {
    const {
      onShareLink,
      prompt,
      settings,
      system,
      wallet,
    } = this.props;
    const {
      chainId,
      callback,
      tx
    } = prompt;

    const error = system.EOSIOURIBUILD_LAST_ERROR;
    const loading = (system.EOSIOURI === 'PENDING' || system.EOSIOURIBUILD === 'PENDING');

    return (
      <Grid stackable>
        <Grid.Column width={6}>
          <PromptReviewControls
            callback={callback}
            chainId={chainId}
            onCheck={this.props.onCheck}
            onSelect={this.props.swapAccount}
            settings={settings}
            wallet={wallet}
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Header>
            Actions to Perform
            <Header.Subheader>
              Listed below are the actions to be performed. If you are unsure of what this request does,
              {' '}
              <a onClick={onShareLink} style={{ cursor: 'pointer' }}>
                use a URI link to ask those you trust
              </a>.
            </Header.Subheader>
          </Header>
          {(loading)
            ? <PromptFragmentPlaceholderTransactionAction />
            : false
          }
          {(tx)
            ? tx.actions.map((action, index) => (
              <PromptFragmentTransactionAction
                action={action}
                key={index}
                index={index}
              />
            ))
            : false
          }
          {(error)
            ? (
              <Segment attached>
                <ErrorMessage
                  error={error}
                />
              </Segment>
            )
            : false
          }
        </Grid.Column>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    prompt: state.prompt,
    settings: state.settings,
    system: state.system,
  };
}

export default compose(
  translate('global'),
  connect(mapStateToProps)
)(PromptStageReview);
