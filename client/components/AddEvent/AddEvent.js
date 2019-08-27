import React from "react";
import { DatePicker, Button, Form, FormLayout, Select, Toast, TextField, Stack } from "@shopify/polaris";
import moment from 'moment';

// Import Polaris styles to our app
import "@shopify/polaris/styles.css";

// Import custom CSS
import "./addEvent.css";

class AddEvent extends React.Component {
  state = {
    selectedLocation: "",
    month: parseInt(moment().subtract(1, 'months').format('MM')),
    year: 2019,
    selectedDate: new Date(moment()),
    showToast: false,
    locations: [],
    start: "7:00",
    end: "18:00",
  };

  componentDidMount() {
    this.getLocations();
  }

  getLocations = () => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(result => {
        //console.log(result);
        var locationsList = [];
        result.map(location => {
          locationsList.push({
            label: location.name,
            value: location.name,
            key: location.id
          });
        });
        //console.log(locationsList);
        this.setState({
          locations: locationsList
        });
        this.setState({
          selectedLocation: locationsList[0].value
        });
      });
  };

  handleDateChange = dateValue => {
    console.log(dateValue.start);
    this.setState({ selectedDate: dateValue.start });
  };

  handleLocationChange = locationValue => {
    this.setState({ selectedLocation: locationValue });
  };

  // Time text box
  handleChangeStartTime = (start) => {
    this.setState({start});
  };
  handleChangeEndTime = (end) => {
    this.setState({end});
  };

  render() {
    const { month, year, selectedDate, showToast, locations, selectedLocation, start, end } = this.state;

    const toastMarkup = showToast ? (
      <Toast content="Date Added!" onDismiss={this.toggleToast} />
    ) : null;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormLayout>
            <Select
              label="Locations"
              options={locations}
              onChange={this.handleLocationChange}
              value={selectedLocation}
            />
            <Stack>
              <TextField
                label="Start Time"
                value={start}
                onChange={this.handleChangeStartTime}
                placeholder="7:00"
              />
              <TextField
                label="End Time"
                value={end}
                onChange={this.handleChangeEndTime}
                placeholder="17:00"
              />
            </Stack>
            <DatePicker
              month={month}
              year={year}
              onChange={this.handleDateChange}
              onMonthChange={this.handleMonthChange}
              selected={selectedDate}
            />
            <Button onClick={this.handleButtonClick} submit>
              Submit
            </Button>
          </FormLayout>
          {toastMarkup}
        </Form>
      </div>
    );
  }

  // Select location
  handleSubmit = event => {
    const { start, end, selectedLocation } = this.state;

    const  date = moment(this.state.selectedDate).format("YYYY-MM-DD");

    var data = JSON.stringify({
      "location_name": `${selectedLocation}`,
      "start": `${date} ${start}`,
      "end": `${date} ${end}`
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "/api/add-workday");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  };

  handleMonthChange = (month, year) => {
    this.setState({
      month,
      year
    });
  };

  handleButtonClick = () => {
    this.props.eventAdded();
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };

  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };
}

export default AddEvent;
