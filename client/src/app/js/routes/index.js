import React, {Component} from 'react';

import {Route, Switch, Redirect} from 'react-router-dom';
import Welcome from '../pages/welcome';
import About from '../pages/about';
import Error404 from '../pages/error404';

export default (
    <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/about" component={About} />
        <Route path="/404" component={Error404} />
        <Redirect from='*' to='/404' />
    </Switch>
)
