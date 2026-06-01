import React, { Component, Suspense } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import moment from 'moment';
import {
    AppBreadcrumb,  
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';

// sidebar nav config
import navigation from '../../_nav';
import routes from '../../routes';

import { userLogout } from '../../actions/actionUserLogin';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

    static propTypes = {        
        authToken: PropTypes.string,
        userLogout: PropTypes.func,
    }

    constructor(props) {
        super(props);        
    }

    componentWillMount() {        
        const { authToken, exp } = this.props;       
        if(!authToken){
            this.props.history.push('/login');
        } 
        const now = new Date();       
        var isSessionExpired = moment(now).isAfter(exp);        
        if(isSessionExpired) {
            this.props.userLogout();
            this.props.history.push('/login');
        }
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render(){
        return (
            <div className="app">
                <AppHeader fixed>
                    <Suspense  fallback={this.loading()}>
                        <DefaultHeader onLogout={e=>this.signOut(e)}/>
                    </Suspense>
                </AppHeader>
                <div className="app-body">
                    <AppSidebar fixed display="lg">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <Suspense>
                        <AppSidebarNav navConfig={navigation} {...this.props} />
                        </Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer />
                    </AppSidebar>
                    <main className="main">
                        <AppBreadcrumb appRoutes={routes}/>
                        <Container fluid>
                        <Suspense fallback={this.loading()}>
                            <Switch>
                            {routes.map((route, idx) => {
                                return route.component ? (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={props => (
                                    <route.component {...props} />
                                    )} />
                                ) : (null);
                            })}                                                   
                            </Switch>
                        </Suspense>
                        </Container>
                    </main>
                </div>                
            </div>
        );
    }

}

export function mapStateToProps(state) {
    return {      
        authToken: state.userIdentity.data.authToken,
        exp: state.userIdentity.data.exp,
    };
}

export default connect(mapStateToProps, { userLogout })(withRouter(DefaultLayout));
