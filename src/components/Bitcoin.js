import React, { Component } from "react";
import { Segment, Icon, Card } from "semantic-ui-react";
import CurrencyFormater from "../components/CurrencyFormater";
import Chart from "./BitCoinChart";
class Bitcoin extends Component {
  constructor() {
    super();

    this.state = {
      data: {},
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    fetch("https://api.coindesk.com/v1/bpi/historical/close.json")
      .then(res => res.json())
      .then(
        json => {
          this.setState({
            data: json,
            isLoading: false
          });
        },
        error => {
          this.setState({ isLoading: false, error: true });
        }
      );
  }

  render() {
    const { data, error, isLoading } = this.state;

    if (!data.bpi) {
      return (
        <div className="ui container">
          <Segment loading>
            <Icon name="circle notched" loading />
          </Segment>
        </div>
      );
    }

    const prices = Object.keys(data.bpi).map(k => ({
      time: k,
      price: data.bpi[k]
    }));

    const currentPrice = prices[prices.length - 1].price;
    const currentDisplayTime = prices[prices.length - 1].time;
    const ThirtyDaysBefore = prices[0].price;
    const diffInLast30Days = currentPrice - ThirtyDaysBefore;
    const symbol = diffInLast30Days > 0;

    if (error) {
      return (
        <div className="ui container">
          <Segment>
            <h1>There seems to be some problem with api.</h1>
          </Segment>
        </div>
      );
    } else if (isLoading) {
      return (
        <div className="ui container">
          <Segment loading>
            <Icon name="circle notched" loading />
          </Segment>
        </div>
      );
    } else {
      return (
        <div className="ui container">
          <Segment>
            <h1 className="bit-header">Bitcoin</h1>
            <Card.Group centered>
              <Card>
                <Card.Content>
                  <Card.Header>Bitcoin Price</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description>
                    {CurrencyFormater(currentPrice)}
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>Last Updated:</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description>{currentDisplayTime}</Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header>30 Days diffrence:</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description className={symbol ? "plus" : "minus"}>
                    {symbol ? "+" : ""}
                    {CurrencyFormater(diffInLast30Days)}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>

            <Segment>
              <Chart/>
            </Segment>
          </Segment>
        </div>
      );
    }
  }
}

export default Bitcoin;
