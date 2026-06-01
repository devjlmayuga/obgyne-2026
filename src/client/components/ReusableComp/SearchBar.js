import React, { Component } from 'react';

import {
  FormGroup,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  Button
} from 'reactstrap';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    };
  }

  render() {
    return (
      <FormGroup row>
        <Col>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button type="button" color="primary">
                <i className="fa fa-search" /> Search
              </Button>
            </InputGroupAddon>
            <Input
              type="text"
              id="input1-group2"
              name="input1-group2"
              value={this.state.term}
              placeholder={this.props.placeholder}
              onChange={event => this.onInputChange(event.target.value)}
            />
          </InputGroup>
        </Col>
      </FormGroup>
    );
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }
}

export default SearchBar;
