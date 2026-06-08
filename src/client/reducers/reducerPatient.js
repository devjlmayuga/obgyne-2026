import _ from 'lodash';

import {
  TODAYS_PATIENT_LIST,
  PATIENT_CONFINEMENT_LIST,
  PATIENT_LIST,
  FETCH_PATIENT_INFO,
  FETCH_MEDICAL_HISTORY,
  FETCH_PATIENT_DELIVERY,
  PATIENT_SCHED,
  SELECTED_CHECKUP_FORM
} from '../actions/actionPatients';
import {
  CHECKUP_HISTORY,
  PATIENT_CHECKUP_LIST
} from '../actions/actionCheckup';

const initialState = {
  todaysPatientList: [],
  patientInformation: {},
  medicalHistory: {},
  patientDelivery: [],
  checkupHistory: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TODAYS_PATIENT_LIST:
      return {
        ...state,
        todaysPatientList: action.payload
      };
    case PATIENT_CONFINEMENT_LIST:
      return {
        ...state,
        confinementList: action.payload
      };
    case PATIENT_LIST:
      const patientList = _.isArray(action.payload)
        ? _.orderBy(action.payload, 'patient_name', 'asc')
        : {
            ...action.payload,
            data: _.orderBy(action.payload && action.payload.data, 'patient_name', 'asc')
          };
      return {
        ...state,
        patientList
      };
    case FETCH_PATIENT_INFO:
      return {
        ...state,
        patientInformation: action.payload
      };
    case FETCH_MEDICAL_HISTORY:
      return {
        ...state,
        medicalHistory: action.payload
      };
    case FETCH_PATIENT_DELIVERY:
      let patientDelivery = action.payload;
      patientDelivery = patientDelivery.sort((a, b) => {
        return parseInt(a.year) - parseInt(b.year);
      });

      return {
        ...state,
        patientDelivery: patientDelivery
      };
    case CHECKUP_HISTORY:
      return {
        ...state,
        checkupHistory: action.payload
      };
    case PATIENT_CHECKUP_LIST:
      const checkupPayload = _.isArray(action.payload)
        ? { data: action.payload }
        : action.payload || { data: [] };
      const existingCheckupList = action.append ? state.patientCheckupList || [] : [];
      const checkupList = _.orderBy(
        _.uniqBy(
          [...existingCheckupList, ...(checkupPayload.data || [])],
          'schedule_checkup_id'
        ),
        'schedule_checkup_id',
        'desc'
      );
      return {
        ...state,
        patientCheckupList: checkupList,
        patientCheckupMeta: {
          total: checkupPayload.total || checkupList.length,
          page: checkupPayload.page || 1,
          limit: checkupPayload.limit || 10,
          hasMore: checkupPayload.hasMore || false
        }
      };
    case PATIENT_SCHED:
      return {
        ...state,
        patientTodaySched: action.payload
      };
    case SELECTED_CHECKUP_FORM:
      return {
        ...state,
        selectedCheckupForm: action.payload
      };
    default:
      return state;
  }
}
