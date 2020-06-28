import React, {useState, useEffect, useRef, useCallback} from "react";
import {BrowserRouter as Router} from 'react-router-dom'

import Routes from './routes';

import {
    AppProvider,
    Layout,
    Frame,
    Card,
    FormLayout,
    TextField,
    Page,
    FooterHelp,
    Link,
    Stack,
    TextContainer,
    Heading,
    Subheading,
    Badge,
    Button,
    ContextualSaveBar,
    ActionList,
    TopBar,
    Navigation,
    SkeletonPage,
    Modal
} from "@shopify/polaris";

import {apiRequest} from './utils/api'

import {Provider, Toast} from '@shopify/app-bridge-react';

import createApp from "@shopify/app-bridge";
import {TitleBar} from "@shopify/app-bridge/actions";

import '@shopify/polaris/styles.css';
import * as styles from "./assets/scss/App.scss";

/** Utils */
import {getParameterByName, checkIfTokenIsValid} from './utils'
import {USER_AUTH_KEY} from './utils/local-storage'
import {redirect} from "@shopify/app-bridge/client/redirect";

/* Hooks */
import useShopifyToken from "./utils/hooks/shopify_token";

const _i18n = {
    Polaris: {
        ResourceList: {
            sortingLabel: 'Sort by',
            defaultItemSingular: 'item',
            defaultItemPlural: 'items',
            showing: 'Showing {itemsCount} {resource}',
            Item: {
                viewItem: 'View details for {itemName}',
            },
        },
        Common: {
            checkbox: 'checkbox',
        },
    },
};


const App: React.FC = (props): JSX.Element => {

    const [toast, setToast] = useState(true);

    let _config = {
        apiKey: '',
        shopOrigin: '',
        forceRedirect: false
    }

    if (!process.env.development) {

        _config = {
            apiKey: 'fea684e54dd7cf15a3f779e14e605469', // Change API here
            shopOrigin: 'demo-d1.myshopify.com', // Change your SHOP ID here
            forceRedirect: true
        };

    } else {

        _config = {
            apiKey: 'fea684e54dd7cf15a3f779e14e605469', // Change API key here
            shopOrigin: '56ae37956d03.ngrok.io', // Change local Ngrok URL here
            forceRedirect: false
        }

    }

    return (
        <Provider config={_config}>
            <Toast content="Hello world!" onDismiss={() => {
                setToast(false)
            }}/>
            <AppProvider i18n={_i18n}>
                <div style={{minHeight: '500px'}}>
                    <Router>
                        <Routes/>
                    </Router>
                </div>
            </AppProvider>
        </Provider>
    );
}

export default App;