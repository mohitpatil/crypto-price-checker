import React, { Component } from "react";
import { Segment, Icon, Card } from "semantic-ui-react";

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
    const tenDaysBefore = prices[prices.length - 10].price;
    const diffInLast10Days = currentPrice - tenDaysBefore;
    console.log(prices);

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
            <h1>Bitcoin</h1>
            <Card.Group centered>
              <Card >
                <Card.Content>
                  <Card.Header>Bitcoin Price</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description>
                  ${currentPrice}
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card >
                <Card.Content>
                  <Card.Header>Last Updated:</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description>
                  {currentDisplayTime}
                  </Card.Description>
                </Card.Content>
              </Card>


              <Card >
                <Card.Content>
                  <Card.Header>10 Days diffrence:</Card.Header>
                  {/* <Card.Meta>Co-Worker</Card.Meta> */}
                  <Card.Description>
                  ${diffInLast10Days}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
            
          </Segment>
        </div>
      );
    }
  }
}

export default Bitcoin;
