// Routes.tsx
import React from 'react';
import {Switch, Route} from 'react-router-dom'

import {withRouter, RouteComponentProps, useLocation} from "react-router-dom";

import {Context} from "@shopify/app-bridge-react";
import {Redirect, History} from "@shopify/app-bridge/actions";

import {useClientRouting, useRoutePropagation} from '@shopify/app-bridge-react';

import Welcome from '../screens/Welcome'
import Products from '../screens/Products'
import Install from '../screens/Install'

const Routes: React.FC = (props: RouteComponentProps): JSX.Element => {
    let location = useLocation();
    const {history} = props;

    useClientRouting(history);
    useRoutePropagation(location);

    return (
        <Switch>

            <Route exact path="/" component={Welcome}/>
            <Route exact path="/products" component={Products}/>

            <Route exact path="/install" component={Install}/>

        </Switch>

    );
}

export default withRouter(Routes);
