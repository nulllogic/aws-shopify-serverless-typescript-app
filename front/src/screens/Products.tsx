import {Button, Card, FooterHelp, Frame, Heading, Layout, Link, Page, Stack, TextContainer} from "@shopify/polaris";
import * as styles from "../assets/scss/App.scss";
import React from "react";
import {useHistory} from "react-router-dom";
import {Provider, TitleBar, Loading, Toast} from '@shopify/app-bridge-react';
import useShopifyToken from "../utils/hooks/shopify_token";

const Products: React.FC = (props): JSX.Element => {
    const history = useHistory();

    const { loading, token } = useShopifyToken();

    return (

        <Frame>

            <TitleBar
                title={'Products'}
            />
            <Page breadcrumbs={[{
                content: 'HomePage', onAction: () => {
                    history.push('/')
                }
            }]}
                  title={'Products'}
                  titleHidden={false} fullWidth={false}>
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
                        title="Contents"
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

export default Products
