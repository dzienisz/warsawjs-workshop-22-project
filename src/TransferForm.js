import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
  TextField,
  Button
} from '@material-ui/core';

import { OPERATION_TYPE } from './consts';
import Panel from './Panel';
import ErrorMessage from './ErrorMessage';

export default class TransferForm extends Component {
  static propTypes = {
    error: PropTypes.object,
    currencies: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  state = {
    operation: OPERATION_TYPE.BUY,
    buyCurrency: null,
    sellCurrency: null,
    amount: 0,
  };

  handleChangeOperation = event => {
    this.setState({ operation: event.target.value });
  };

  handleChangeBuyCurrency = event => {
    this.setState({ buyCurrency: event.target.value });
  };

  handleChangeSellCurrency = event => {
    this.setState({ sellCurrency: event.target.value });
  };

  handleChangeAmount = event => {
    this.setState({ amount: event.target.value });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      operation: OPERATION_TYPE.BUY,
      buyCurrency: null,
      sellCurrency: null,
      amount: 0,
    });
    if (onCancel) {
      onCancel();
    }
  };
  
  handleSubmit = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      const { operation, buyCurrency, sellCurrency, amount } = this.state;
      onSubmit({ operation, buyCurrency, sellCurrency, amount });
    }
  };

  render() {
    const { error, currencies } = this.props;
    const { operation, buyCurrency, sellCurrency, amount } = this.state;
    return (
      <Panel>
        <Grid container spacing={24}>
          {error ? (
            <Grid item xs={12}>
              <ErrorMessage text="Cannot submit form" />
            </Grid>
          ) : (
            <Fragment>
              <Grid item xs={12}>
                <FormControl component="fieldset" required name="mode">
                  <FormLabel component="legend">Operacja</FormLabel>
                  <RadioGroup
                    name="mode"
                    value={operation}
                    onChange={this.handleChangeOperation}
                  >
                    <FormControlLabel
                      value={OPERATION_TYPE.BUY}
                      control={<Radio color="primary" />}
                      label="Kupno"
                    />
                    <FormControlLabel
                      value={OPERATION_TYPE.SELL}
                      control={<Radio color="primary" />}
                      label="Sprzedaż"
                    />
                    <FormControlLabel
                      value={OPERATION_TYPE.EXCHANGE}
                      control={<Radio color="primary" />}
                      label="Wymiana"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  required
                  disabled={operation === OPERATION_TYPE.SELL}
                >
                  <InputLabel shrink htmlFor="buy-currency">Kupujemy</InputLabel>
                  <Select
                    value={buyCurrency}
                    onChange={this.handleChangeBuyCurrency}
                    name="buy-currency"
                    inputProps={{
                      id: 'buy-currency',
                    }}
                  >
                    {currencies.map(({ code, name }) => (
                      <MenuItem key={code} value={code}>{name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>pole wymagane</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  required
                  disabled={operation === OPERATION_TYPE.BUY}
                >
                  <InputLabel shrink htmlFor="sell-currency">Sprzedajemy</InputLabel>
                  <Select
                    value={sellCurrency}
                    onChange={this.handleChangeSellCurrency}
                    name="sell-currency"
                    inputProps={{
                      id: 'sell-currency',
                    }}
                  >
                    {currencies.map(({ code, name }) => (
                      <MenuItem key={code} value={code}>{name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>pole wymagane</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="amount"
                  name="amount"
                  label="Kwota"
                  value={amount}
                  fullWidth
                  required
                  helperText="pole wymagane"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleChangeAmount}
                />
              </Grid>
              <Grid item xs={12} />
            </Fragment>
          )}
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="default"
              onClick={this.handleCancel}
            >
              anuluj
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Wykonaj
            </Button>
          </Grid>
        </Grid>
      </Panel>
    );
  }
}
