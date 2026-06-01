import React from 'react';

import DefaultLayout from './components/DefaultLayout';

const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));
const ChangePassword = React.lazy(() =>
  import('./components/ChangePassword/ChangePassword')
);

// Inventory Component
const Inventory = React.lazy(() => import('./components/Inventory/Inventory'));
const InventoryAddItem = React.lazy(() =>
  import('./components/Inventory/AddItem')
);

// Patient Component
const PatientForm = React.lazy(() =>
  import('./components/Patient/PatientForm')
);
const PatientSearch = React.lazy(() =>
  import('./components/Patient/PatientSearch')
);
const PatientRegistrationForm = React.lazy(() =>
  import('./components/Patient/PatientRegistrationForm')
);
const PatientNavigationWrapper = React.lazy(() =>
  import('./components/Patient/PatientNavigationWrapper')
);

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {
    path: '/changePassword',
    name: 'Change Password',
    component: ChangePassword
  },
  { path: '/inventory/add', name: 'Add New Item', component: InventoryAddItem },
  { path: '/inventory/list', name: 'Inventory', component: Inventory },
  { path: '/patient/form', name: 'Patient Form', component: PatientForm },
  {
    path: '/patient/register',
    name: 'Registration Form',
    component: PatientRegistrationForm
  },
  { path: '/patient/search', name: 'Search Patient', component: PatientSearch },
  {
    path: '/patient/:patientId',
    name: 'Patient Management',
    component: PatientNavigationWrapper
  }
];

export default routes;
