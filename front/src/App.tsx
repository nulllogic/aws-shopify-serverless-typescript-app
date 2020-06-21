import React, {useState, useRef, useCallback} from "react";
import {
    AppProvider,
    Layout,
    Frame,
    Card,
    FormLayout,
    TextField,
    Page,
    Toast,
    ContextualSaveBar,
    ActionList,
    TopBar,
    Navigation,
    SkeletonPage,
    Modal
} from "@shopify/polaris";
import {Provider, Loading} from "@shopify/app-bridge-react";
import '@shopify/polaris/styles.css';
import * as styles from "./assets/scss/App.scss";

import {getParameterByName} from './utils'

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

const _config = {
    apiKey: getParameterByName('token', window.location.href),
    shopOrigin: getParameterByName('shop', window.location.href),
    forceRedirect: true
};

const App: React.FC = (props): JSX.Element => {


    return (
        <div style={{height: '500px'}}>
            <AppProvider i18n={_i18n}>
                <Provider config={_config}>
                    <div style={{height: '500px'}}>
                        <Frame>
                            <Loading/>
                            <div className={styles.container}>
                                <Layout>
                                    <Layout.AnnotatedSection
                                        title="Store details"
                                        description="Shopify and your customers will use this information to contact you."
                                    >
                                        <Card sectioned>
                                            <FormLayout>
                                                <TextField label="Store name" onChange={() => {
                                                }}/>
                                                <TextField type="email" label="Account email" onChange={() => {
                                                }}/>
                                            </FormLayout>
                                        </Card>
                                    </Layout.AnnotatedSection>
                                </Layout>
                            </div>
                        </Frame>
                    </div>
                </Provider>
            </AppProvider>
        </div>
    );
}

export default App