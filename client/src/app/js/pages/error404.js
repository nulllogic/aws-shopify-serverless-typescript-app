import {
    Layout,
    Page,
    FooterHelp,
    Card,
    Link,
    Button,
    FormLayout,
    TextField,
    AccountConnection,
    ChoiceList,
    SettingToggle,
    AppProvider,
} from '@shopify/polaris';
import React, {Component} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import routes from "../routes";

class Error404 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: '',
            last: '',
            email: '',
            checkboxes: [],
            connected: false,
        };
    }

    render() {
        const breadcrumbs = [{content: 'Example apps'}, {content: 'webpack'}];
        const primaryAction = {content: 'New product'};
        const secondaryActions = [{content: 'Import', icon: 'import'}];

        const choiceListItems = [
            {label: 'I accept the Terms of Service', value: 'false'},
            {label: 'I consent to receiving emails', value: 'false2'},
        ];

        return (

            <Page
                title="Polaris"
                breadcrumbs={breadcrumbs}
                primaryAction={primaryAction}
                secondaryActions={secondaryActions}
            >
                <Layout>
                    <Layout.AnnotatedSection
                        title="Style"
                        description="Customize the style of your checkout"
                    >
                        <Button onClick={() => { history.push('/404') }}>Test navigation</Button>
                        
                    </Layout.AnnotatedSection>

                    {this.renderAccount()}


                    <Layout.Section>
                        <FooterHelp>
                            For more details on Polaris, visit our{' '}
                            <Link url="https://polaris.shopify.com">style guide</Link>.
                        </FooterHelp>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    valueUpdater(field) {
        return (value) => this.setState({[field]: value});
    }

    toggleConnection() {
        this.setState(({connected}) => ({connected: !connected}));
    }

    connectAccountMarkup() {
        return (
            <Layout.AnnotatedSection
                title="Account"
                description="Connect your account to your Shopify store."
            >
            </Layout.AnnotatedSection>
        );
    }

    disconnectAccountMarkup() {
        return (
            <Layout.AnnotatedSection
                title="Account"
                description="Disconnect your account from your Shopify store."
            >
                <AccountConnection
                    connected
                    action={{
                        content: 'Disconnect',
                        onAction: this.toggleConnection.bind(this, this.state),
                    }}
                    accountName="Tom Ford"
                    title={<Link url="http://google.com">Tom Ford</Link>}
                    details="Account id: d587647ae4"
                />
            </Layout.AnnotatedSection>
        );
    }

    renderAccount() {
        return this.state.connected
            ? this.disconnectAccountMarkup()
            : this.connectAccountMarkup();
    }
}

export default Error404;