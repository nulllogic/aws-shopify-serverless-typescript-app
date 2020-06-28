import {Button, Card, Page, FooterHelp, Frame, Heading, Layout, Link, Stack, TextContainer} from "@shopify/polaris";
import * as styles from "../assets/scss/App.scss";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Provider, TitleBar, Loading, Toast} from '@shopify/app-bridge-react';

const Install: React.FC = (props): JSX.Element => {
    // const history = History.create(app)
    // history.dispatch(History.Action.PUSH, nextProps.computedMatch.url)
    const history = useHistory();
    // console.log(123);
    // let location = useLocation();

    const primaryAction = {content: 'Foo', url: '/foo'};
    const secondaryActions = [{content: 'Bar', url: '/bar'}];
    const actionGroups = [{title: 'Baz', actions: [{content: 'Baz', url: '/baz'}]}];

    return (

        <Frame>
            <TitleBar
                title={'Welcome'}
            />
            <Page title={'Welcome'}
                  titleHidden={true} fullWidth={false}>
                <Layout>
                    <Layout.AnnotatedSection
                        title="Products"
                        description=""
                    >
                        <Card sectioned>
                            <TextContainer>
                                <Heading>Install the Shopify POS App</Heading>
                                <p>
                                    Shopify POS is the easiest way to sell your products in person.
                                    Available
                                    for iPad, iPhone, and Android.
                                </p>
                                <Stack>
                                    <Stack.Item>
                                        <Button onClick={() => {
                                            history.push('/products')
                                        }}>Products</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Variants</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Collections</Button>
                                    </Stack.Item>
                                </Stack>
                            </TextContainer>
                        </Card>
                    </Layout.AnnotatedSection>

                    <Layout.AnnotatedSection
                        title="Orders"
                        description=""
                    >
                        <Card sectioned>
                            <TextContainer>
                                <Heading>Install the Shopify POS App</Heading>
                                <p>
                                    Shopify POS is the easiest way to sell your products in person.
                                    Available
                                    for iPad, iPhone, and Android.
                                </p>
                                <Stack>
                                    <Stack.Item>
                                        <Button>Products</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Variants</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Collections</Button>
                                    </Stack.Item>
                                </Stack>
                            </TextContainer>
                        </Card>
                    </Layout.AnnotatedSection>

                    <Layout.AnnotatedSection
                        title="Pages"
                        description=""
                    >
                        <Card sectioned>
                            <TextContainer>
                                <Heading>Install the Shopify POS App</Heading>
                                <p>
                                    Shopify POS is the easiest way to sell your products in person.
                                    Available
                                    for iPad, iPhone, and Android.
                                </p>
                                <Stack>
                                    <Stack.Item>
                                        <Button>Products</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Variants</Button>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button>Collections</Button>
                                    </Stack.Item>
                                </Stack>
                            </TextContainer>
                        </Card>
                    </Layout.AnnotatedSection>
                </Layout>
            </Page>
        </Frame>
    );
}

export default Install
