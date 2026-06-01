import React from 'react';
import { Field, FieldArray } from 'redux-form';
import {         
    Col,   
    FormGroup,    
    Label,
} from 'reactstrap';
import {
    renderPatientDeliveries,
    renderVerticalFormTextField,
    renderVerticalFormTextArea,
    renderSingleTextArea,
    required,
    renderFormTextField
} from './PatientUtil';

export function renderMedicalHistoryForm () {
    const validate = [];
    validate.push(required('This field is required'));
    return (
        <div>
            <FormGroup row className="my-0">
                <Col md="12">                                                       
                    <Field
                        component={renderVerticalFormTextArea}
                        name="medical_history.remarks"
                        label="Remarks"                                                                
                    />                                                        
                </Col>                                                        
            </FormGroup>    

            <FormGroup row className="my-0">
                <Col md="6">                                                        
                    <Field
                        component={renderVerticalFormTextField}
                        name="medical_history.allergies"
                        label="Allergies"                                                                
                    />                                                          
                </Col>   
                <Col md="6">
                    <Field
                        component={renderVerticalFormTextField}
                        name="medical_history.asthma"
                        label="Asthma"                                                               
                    />                                                          
                </Col>   
            </FormGroup>  
            
            <FormGroup row>
                <Col md="1">
                    <Label><strong>FmHx</strong></Label>
                </Col>
                <Col md="1">
                    <Field
                        name="medical_history.dm"
                        id="medical_history.dm"
                        component="input"
                        type="checkbox"
                        className="form-check-input"
                    />  
                    <Label htmlFor="medical_history.dm">DM</Label>
                </Col>

                <Col md="1">
                    <Label>Remarks</Label>
                </Col>
                <Col md="9">
                    <Field
                        component={renderSingleTextArea}
                        name="medical_history.dm_remarks"                                     
                    />                                                                                                                
                </Col>
            </FormGroup> 

            <FormGroup row>
                <Col md="1" />
                <Col md="1"> 
                    <Field
                        name="medical_history.hpn"
                        id="medical_history.hpn"
                        component="input"
                        type="checkbox"
                        className="form-check-input"
                    /> 
                    <Label htmlFor="medical_history.hpn">HPN</Label>
                </Col>

                <Col md="1">
                    <Label>Remarks</Label>
                </Col>
                <Col md="9">
                    <Field
                        component={renderSingleTextArea}
                        name="medical_history.hpn_remarks"                                       
                    />                                                         
                </Col>
            </FormGroup>

            <FormGroup row>
                <Col md="1" />
                <Col md="1">                                                         
                    <Label>Others</Label>
                </Col>                                    
                <Col md="1">
                    <Label>Remarks</Label>
                </Col>
                <Col md="9">
                    <Field
                        component={renderSingleTextArea}
                        name="medical_history.others_remarks"                                        
                    />                                                     
                </Col>
            </FormGroup>            
            
            <FieldArray name="patient_delivery" component={renderPatientDeliveries} />

            <FormGroup row>
                <Col md="6">
                  <h5 className="text-center">
                <strong>Menstrual History</strong>
                  </h5>
                  <Field
                    component={renderFormTextField}
                    name="medical_history.mh_menarche"
                    label="Menarche"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.mh_interval"
                    label="Interval"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.mh_duration"
                    label="Duration"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.mh_ammount"
                    label="Amount"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.mh_symptoms"
                    label="Symptoms"
                  />
                </Col>
                <Col md="6">
                  <h5 className="text-center">
                    <strong>Sexual History</strong>
                  </h5>
                  <Field
                    component={renderFormTextField}
                    name="medical_history.sh_coitarche"
                    label="Coitarche"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.sh_nop"
                    label="NOP"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.sh_std"
                    label="STD's"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.sh_vaccination"
                    label="Vaccinations"
                  />
                  <Field
                    component={renderFormTextField}
                    name="medical_history.sh_others"
                    label="Others"
                  />
                </Col>
              </FormGroup>
        </div>   
    );
}
