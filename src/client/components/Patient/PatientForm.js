import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  CardFooter,
  Input,
  Collapse,
  Table
} from 'reactstrap';

class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [true, true, true, true, true]
    };
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    this.setState({
      accordion: state
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form encType="multipart/form-data" className="form-horizontal">
                  <Card>
                    <CardHeader id="headingOne">
                      <strong>Patient Information</strong>
                      <div className="card-header-actions">
                        <Button
                          color="link"
                          className="card-header-action btn-setting"
                          onClick={() => this.toggleAccordion(0)}
                          aria-expanded={this.state.accordion[0]}
                          aria-controls="collapseOne"
                        >
                          <i
                            className="fa fa-align-justify"
                            title="Item list"
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <Collapse
                      isOpen={this.state.accordion[0]}
                      id="collapseOne"
                      aria-labelledby="headingOne"
                    >
                      <CardBody>
                        <FormGroup row className="my-0">
                          <Col md="6">
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Name</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Address</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Birthday</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Age</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">CP #</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">CS</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Philhealth</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">HMO</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Collapse>
                  </Card>

                  <Card>
                    <CardHeader id="headingOne">
                      <strong>Past Medical History</strong>
                      <div className="card-header-actions">
                        <Button
                          color="link"
                          className="card-header-action btn-setting"
                          onClick={() => this.toggleAccordion(1)}
                          aria-expanded={this.state.accordion[1]}
                          aria-controls="collapseTwo"
                        >
                          <i
                            className="fa fa-align-justify"
                            title="Item list"
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <Collapse
                      isOpen={this.state.accordion[1]}
                      id="collapseTwo"
                      aria-labelledby="headingOne"
                    >
                      <CardBody>
                        <FormGroup row className="my-0">
                          <Col md="12">
                            <FormGroup>
                              <Label htmlFor="text-input">Remarks</Label>
                              <Input
                                type="textarea"
                                name="textarea-input"
                                id="textarea-input"
                                rows="3"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row className="my-0">
                          <Col md="6">
                            <FormGroup>
                              <Label htmlFor="text-input">Allergies</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label htmlFor="text-input">Asthma</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="1">
                            <Label>
                              <strong>FmHx</strong>
                            </Label>
                          </Col>
                          <Col md="1">
                            {' '}
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox1"
                              name="checkbox1"
                              value="option1"
                            />
                            <Label htmlFor="text-input">DM</Label>
                          </Col>

                          <Col md="1">
                            <Label htmlFor="text-input">Remarks</Label>
                          </Col>
                          <Col md="9">
                            <Input
                              type="textarea"
                              name="textarea-input"
                              id="textarea-input"
                              rows="3"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="1" />
                          <Col md="1">
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox1"
                              name="checkbox1"
                              value="option1"
                            />
                            <Label htmlFor="text-input">HPN</Label>
                          </Col>

                          <Col md="1">
                            <Label htmlFor="text-input">Remarks</Label>
                          </Col>
                          <Col md="9">
                            <Input
                              type="textarea"
                              name="textarea-input"
                              id="textarea-input"
                              rows="3"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="1" />
                          <Col md="1">
                            {' '}
                            <Input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox1"
                              name="checkbox1"
                              value="option1"
                            />
                            <Label htmlFor="text-input">Others</Label>
                          </Col>

                          <Col md="1">
                            <Label htmlFor="text-input">Remarks</Label>
                          </Col>
                          <Col md="9">
                            <Input
                              type="textarea"
                              name="textarea-input"
                              id="textarea-input"
                              rows="3"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row className="my-0">
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">OB Score</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">LMP</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">EDC</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">AOG</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <Table
                          responsive
                          className="table-outline mb-0 d-none d-sm-table"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>&nbsp;</th>
                              <th>Year of Delivery</th>
                              <th>Mode of Delivery</th>
                              <th>Place of Delivery</th>
                              <th>Attendant</th>
                              <th colSpan="2">Complications</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>G1</td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td className="text-right">
                                <Button type="submit" size="sm" color="danger">
                                  <i className="fa fa-trash" />
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td>G2</td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </td>
                              <td className="text-right">
                                <Button type="submit" size="sm" color="danger">
                                  <i className="fa fa-trash" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                        <Button
                          type="button"
                          size="sm"
                          color="success"
                          className="mt-sm-2"
                        >
                          <i className="fa fa-plus" /> ADD MORE
                        </Button>

                        <FormGroup className="mt-sm-3" row>
                          <Col md="2">
                            <Label>
                              <strong>Checkup Type</strong>
                            </Label>
                          </Col>
                          <Col md="9">
                            <FormGroup check inline>
                              <Input
                                className="form-check-input"
                                type="radio"
                                id="inline-radio1"
                                name="inline-radios"
                                value="option1"
                              />
                              <Label
                                className="form-check-label"
                                check
                                htmlFor="inline-radio1"
                              >
                                Obstertics
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input
                                className="form-check-input"
                                type="radio"
                                id="inline-radio2"
                                name="inline-radios"
                                value="option2"
                              />
                              <Label
                                className="form-check-label"
                                check
                                htmlFor="inline-radio2"
                              >
                                Gynecology
                              </Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row className="my-0">
                          <Col md="6">
                            <h5 className="text-center">
                              <strong>Menstrual History</strong>
                            </h5>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Menarche</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Interval</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Duration</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Amount</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Symptoms</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <h5 className="text-center">
                              <strong>Sexual History</strong>
                            </h5>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Coitarche</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">NOP</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">STD's</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Vaccinations</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="text-input">Others</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row className="my-0">
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">Date</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">AOG by LMP</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">AOG by UTZ</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup>
                              <Label htmlFor="text-input">Remarks</Label>
                              <Input
                                type="textarea"
                                name="textarea-input"
                                id="textarea-input"
                                rows="3"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <h5>
                          <strong>Vital Signs</strong>
                        </h5>
                        <FormGroup row className="my-0">
                          <Col md="2">
                            <FormGroup>
                              <Label htmlFor="text-input">Weight</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label htmlFor="text-input">BP</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label htmlFor="text-input">CR</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <FormGroup>
                              <Label htmlFor="text-input">Temp</Label>
                              <Input
                                type="text"
                                id="text-input"
                                name="text-input"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <Label htmlFor="text-input">Remarks</Label>
                              <Input
                                type="textarea"
                                name="textarea-input"
                                id="textarea-input"
                                rows="3"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Collapse>
                  </Card>

                  <Card>
                    <CardHeader id="headingOne">
                      <strong>SOAP</strong>
                      <div className="card-header-actions">
                        <Button
                          color="link"
                          className="card-header-action btn-setting"
                          onClick={() => this.toggleAccordion(2)}
                          aria-expanded={this.state.accordion[2]}
                          aria-controls="collapseThree"
                        >
                          <i
                            className="fa fa-align-justify"
                            title="Item list"
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <Collapse
                      isOpen={this.state.accordion[2]}
                      id="collapseThree"
                      aria-labelledby="headingOne"
                    >
                      <CardBody>
                        <FormGroup row className="my-0">
                          <Col md="1">
                            <strong className="display-4">S</strong>
                          </Col>
                          <Col md="11">
                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Nausea/Vomiting</Label>
                              </Col>
                              <Col md="2">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio1"
                                    name="inline-radios"
                                    value="option1"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Yes
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio2"
                                    name="inline-radios"
                                    value="option2"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio2"
                                  >
                                    None
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Hypogastric Pain</Label>
                              </Col>
                              <Col md="2">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio1"
                                    name="inline-radios"
                                    value="option1"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Yes
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio2"
                                    name="inline-radios"
                                    value="option2"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio2"
                                  >
                                    None
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Uterine Contractions</Label>
                              </Col>
                              <Col md="2">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio1"
                                    name="inline-radios"
                                    value="option1"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Yes
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio2"
                                    name="inline-radios"
                                    value="option2"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio2"
                                  >
                                    None
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Bleeding</Label>
                              </Col>
                              <Col md="2">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio1"
                                    name="inline-radios"
                                    value="option1"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Yes
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio2"
                                    name="inline-radios"
                                    value="option2"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio2"
                                  >
                                    None
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Fetal Movement</Label>
                              </Col>
                              <Col md="2">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio1"
                                    name="inline-radios"
                                    value="option1"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Yes
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="inline-radio2"
                                    name="inline-radios"
                                    value="option2"
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio2"
                                  >
                                    None
                                  </Label>
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="2" className="text-right">
                                <Label>Others</Label>
                              </Col>
                              <Col md="2">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <hr />

                        <FormGroup row className="mt-sm-4">
                          <Col md="1">
                            <strong className="display-4">O</strong>
                          </Col>
                          <Col md="11">
                            <FormGroup row>
                              <Col md="2">
                                <Label htmlFor="text-input">
                                  Fundic Height
                                </Label>
                              </Col>
                              <Col md="2">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="2">
                                <Label htmlFor="text-input">
                                  Fetal Heart Beat
                                </Label>
                              </Col>
                              <Col md="2">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup row>
                              <Col md="2">
                                <Label htmlFor="text-input">Others</Label>
                              </Col>
                              <Col md="2">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="7">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <hr />

                        <FormGroup row className="mt-sm-4">
                          <Col md="1">
                            <strong className="display-4">A</strong>
                          </Col>
                          <Col md="11">
                            <FormGroup>
                              <Label htmlFor="text-input">Remarks</Label>
                              <Input
                                type="textarea"
                                name="textarea-input"
                                id="textarea-input"
                                rows="3"
                              />
                            </FormGroup>
                          </Col>
                        </FormGroup>

                        <hr />

                        <FormGroup row className="mt-sm-4">
                          <Col md="1">
                            <strong className="display-4">P</strong>
                          </Col>
                          <Col md="11">
                            <h5>
                              <strong>Medicines</strong>
                            </h5>
                            <Table
                              responsive
                              className="table-outline mb-0 d-none d-sm-table"
                            >
                              <thead className="thead-light">
                                <tr>
                                  <th>&nbsp;</th>
                                  <th>Name</th>
                                  <th>MG</th>
                                  <th colSpan="2">Frequency</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>M1</td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td className="text-right">
                                    <Button
                                      type="submit"
                                      size="sm"
                                      color="danger"
                                    >
                                      <i className="fa fa-trash" />
                                    </Button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>M2</td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="text-input"
                                    />
                                  </td>
                                  <td className="text-right">
                                    <Button
                                      type="submit"
                                      size="sm"
                                      color="danger"
                                    >
                                      <i className="fa fa-trash" />
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                            <Button
                              type="button"
                              size="sm"
                              color="success"
                              className="mt-sm-2"
                            >
                              <i className="fa fa-plus" /> ADD MORE
                            </Button>

                            <h5 className="mt-sm-4">
                              <strong>Labs</strong>
                            </h5>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">UTZ</Label>
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">Blood</Label>
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">Urine</Label>
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">Others</Label>
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  id="text-input"
                                  name="text-input"
                                />
                              </Col>
                            </FormGroup>

                            <h5 className="mt-sm-4">
                              <strong>Vaccine</strong>
                            </h5>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="11">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>

                            <h5 className="mt-sm-4">
                              <strong>Monitoring</strong>
                            </h5>

                            <FormGroup row>
                              <Col md="1">
                                <Label htmlFor="text-input">Remarks</Label>
                              </Col>
                              <Col md="11">
                                <Input
                                  type="textarea"
                                  name="textarea-input"
                                  id="textarea-input"
                                  rows="3"
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Collapse>
                  </Card>

                  <Card>
                    <CardHeader id="headingOne">
                      <strong>Test Results</strong>
                      <div className="card-header-actions">
                        <Button
                          color="link"
                          className="card-header-action btn-setting"
                          onClick={() => this.toggleAccordion(3)}
                          aria-expanded={this.state.accordion[3]}
                          aria-controls="collapseFour"
                        >
                          <i
                            className="fa fa-align-justify"
                            title="Item list"
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <Collapse
                      isOpen={this.state.accordion[3]}
                      id="collapseFour"
                      aria-labelledby="headingOne"
                    >
                      <CardBody>
                        <FormGroup row>
                          <Col md="1">
                            <Label htmlFor="text-input">Test Type</Label>
                          </Col>
                          <Col md="4">
                            <Input
                              type="text"
                              id="text-input"
                              name="text-input"
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="1">
                            <Label htmlFor="file-input">Browse</Label>
                          </Col>
                          <Col md="4">
                            <Input
                              type="file"
                              id="file-input"
                              name="file-input"
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="1" />
                          <Col md="4">
                            <Button type="submit" size="sm" color="primary">
                              Upload
                            </Button>
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Collapse>
                  </Card>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary">
                  <i className="fa fa-dot-circle-o" /> Save
                </Button>
                &nbsp;
                <Button type="reset" size="sm" color="danger">
                  <i className="fa fa-ban" /> Reset
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PatientForm;
