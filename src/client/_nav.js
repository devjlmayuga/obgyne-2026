export default {
    items: [  
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'cui-dashboard'
        },   
        {
            name: 'Inventory',
            url: '/inventory',
            icon: 'icon-notebook',
            children: [
                {
                    name: 'Inventory List',
                    url: '/inventory/list',
                    icon: '',
                  },
                {
                  name: 'Add New Item',
                  url: '/inventory/add',
                  icon: '',
                },
            ]
        },  
        {
            name: 'Patient',
            url: '/',
            icon: 'icon-people',
            children: [
                {
                    name: 'Search',
                    url: '/patient/search',
                    icon: '',
                  },
                {
                  name: 'Register',
                  url: '/patient/register',
                  icon: '',
                },                
            ]
        }, 
    ],
};