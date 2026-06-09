import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import ChangePassword from './components/ChangePassword/ChangePassword';
import { Redirect } from 'react-router-dom';

// Inventory Component
import Inventory from './components/Inventory/Inventory';

// Patient Component
import PatientForm from './components/Patient/PatientForm';
import PatientSearch from './components/Patient/PatientSearch';
import PatientNavigationWrapper from './components/Patient/PatientNavigationWrapper';

const routes = [
  { path: '/', exact: true, name: 'Home', component: () => <Redirect to="/dashboard" /> },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {
    path: '/changePassword',
    name: 'Change Password',
    component: ChangePassword
  },
  { path: '/inventory/add', name: 'Add New Item', component: Inventory },
  { path: '/inventory/list', name: 'Inventory', component: Inventory },
  { path: '/inventory', exact: true, name: 'Inventory', component: Inventory },
  { path: '/patient/form', name: 'Patient Form', component: PatientForm },
  { path: '/patient/register', name: 'Registration Form', component: PatientSearch },
  { path: '/patient/search', name: 'Search Patient', component: PatientSearch },
  { path: '/patient', exact: true, name: 'Search Patient', component: PatientSearch },
  {
    path: '/patient/:patientId',
    name: 'Patient Management',
    component: PatientNavigationWrapper
  }
];

export default routes;
