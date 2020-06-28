import {
    Button,
    EmptyState,
    SkeletonPage,
    SkeletonBodyText,
    SkeletonDisplayText,
    Card,
    Page,
    FooterHelp,
    Frame,
    Heading,
    Layout,
    Link,
    Stack,
    TextContainer
} from "@shopify/polaris";
import * as styles from "../assets/scss/App.scss";
import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Provider, TitleBar, Loading, Toast} from '@shopify/app-bridge-react';
import useShopifyToken from "../utils/hooks/shopify_token";


const Welcome: React.FC = (props): JSX.Element => {
    // const history = History.create(app)
    // history.dispatch(History.Action.PUSH, nextProps.computedMatch.url)
    const history = useHistory();
    // console.log(123);
    // let location = useLocation();

    const primaryAction = {content: 'Foo', url: '/foo'};
    const secondaryActions = [{content: 'Bar', url: '/bar'}];
    const actionGroups = [{title: 'Baz', actions: [{content: 'Baz', url: '/baz'}]}];

    const {loading, token} = useShopifyToken();

    return (
        <>
            {loading ? (
                <Frame>
                    <Loading/>
                    <SkeletonPage primaryAction secondaryActions={2}>
                        <Layout>
                            <Layout.AnnotatedSection
                                title=""
                                description=""
                            >
                                <Card sectioned>
                                    <SkeletonBodyText/>
                                </Card>
                            </Layout.AnnotatedSection>

                            <Layout.AnnotatedSection
                                title=""
                                description=""
                            >
                                <Card sectioned>
                                    <SkeletonBodyText/>
                                </Card>
                            </Layout.AnnotatedSection>

                            <Layout.AnnotatedSection
                                title=""
                                description=""
                            >
                                <Card sectioned>
                                    <TextContainer>
                                        <SkeletonBodyText/>
                                    </TextContainer>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </SkeletonPage>
                </Frame>

            ) : (
                <Frame>
                    <TitleBar
                        title={'Welcome'}
                        primaryAction={{
                            content: 'Sign Out',
                            url: "/",
                            onAction: () => {
                                history.push('/')
                            }
                        }}
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
            )}
        </>
    );
}

export default Welcome
