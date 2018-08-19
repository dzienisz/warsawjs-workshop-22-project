import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, AppBar, Toolbar, Typography, Grid } from '@material-ui/core';

import Backend from './Backend';
import Panel from './Panel';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import ExchangeRates from './ExchangeRates';
import TransferForm from './TransferForm';

const STYLES = {
  self: {
    flexGrow: 1
  }
};

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    loading: true,
    error: null,
    date: null,
    currencies: null,
    rates: null,
    submitting: false,
    submitError: null,
  };

  backend = new Backend();

  handleCancel = () => {
    this.setState({ submitError: null });
  };

  handleOperation = params => {
    this.setState({
      submitting: true,
      submitError: null,
    });
    this.backend.operation(params).then(result => {
      global.console.warn(result);
      this.setState({ submitting: false });
    }).catch(error => {
      this.setState({
        submitting: false,
        submitError: error,
      });
    });
  };

  componentDidMount() {
    this.setState({
      loading: true,
      error: null,
    });
    this.backend.exchangeRates().then(() => {
      this.setState({
        loading: false,
        date: this.backend.date,
        currencies: this.backend.currencies,
        rates: this.backend.rates,
      });
    }).catch(error => {
      this.setState({
        loading: false,
        error,
        date: null,
        currencies: null,
        rates: null,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { loading, error, submitError, date, currencies, rates } = this.state;

    let exchangeRates;
    if (loading) {
      exchangeRates = <Loader />;
    } else if (error) {
      exchangeRates = <ErrorMessage error={error} />;
    } else {
      exchangeRates = <ExchangeRates date={date} rates={rates} />;
    }

    let transferForm;
    if (loading) {
      transferForm = <Loader />;
    } else if (error) {
      transferForm = <ErrorMessage error={error} />;
    } else {
      transferForm = (
        <TransferForm
          error={submitError}
          currencies={currencies}
          onCancel={this.handleCancel}
          onSubmit={this.handleOperation}
        />
      );
    }

    return (
      <div className={classes.self}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">Wirtualny kantor</Typography>
          </Toolbar>
        </AppBar>
        <Panel elevation={0}>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              {exchangeRates}
            </Grid>
            <Grid item xs={6}>
              {transferForm}
            </Grid>
          </Grid>
        </Panel>
      </div>
    );
  }
}

export default withStyles(STYLES)(App);
