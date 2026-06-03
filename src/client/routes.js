import Dashboard from './components/Dashboard/Dashboard';
import ChangePassword from './components/ChangePassword/ChangePassword';

// Inventory Component
import Inventory from './components/Inventory/Inventory';
import InventoryAddItem from './components/Inventory/AddItem';

// Patient Component
import PatientForm from './components/Patient/PatientForm';
import PatientSearch from './components/Patient/PatientSearch';
import PatientRegistrationForm from './components/Patient/PatientRegistrationForm';
import PatientNavigationWrapper from './components/Patient/PatientNavigationWrapper';

const routes = [
  { path: '/', exact: true, name: 'Home' },
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
