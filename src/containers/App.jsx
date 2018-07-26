import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as webIdsActions from '../actions/webIds_actions';
import * as safeActions from '../actions/safe_actions';

import styles from './global.less';
import Header from '../components/Header/Header';
import Editor from '../components/Editor/Editor';
import List from '../components/List/List';

import IdForm from '../components/IdForm/IdForm';

import { Layout, Row, Col } from 'antd';

const { Content } = Layout;

class App extends React.Component
{
    componentDidMount = () =>
    {
        const { safeAuthorise, safe } = this.props;
        const { idApp } = safe;

        if ( !idApp )
        {
            safeAuthorise();
        }
    }


    render = () =>
    {
        const {
            webIds
            , history
            // , match
            , addWebId
            , getAvailableWebIds
            , getWebId
            , updateWebId
            , safe
        } = this.props;

        return (
            <div style={ {
                maxWidth : '800px',
                display  : 'block',
                margin   : '0 auto'
            } }
            >
                <Row
                    gutter={ {
                        xs : 8, sm : 16, md : 24, lg : 32
                    } }
                    type="flex"
                    justify="center"
                >
                    <Col span={ 24 }>
                        <Layout className={ styles.appContainer }>
                            <Route path="/" component={ Header } />
                            <Content style={ { padding: '50px' } }>

                                <Switch>
                                    <Route
                                        path="/list"
                                        render={ () =>
                                            <List history={ history } webIds={ webIds } getAvailableWebIds={ getAvailableWebIds } idApp={ safe.idApp } /> }
                                    />
                                    <Route
                                        path="/edit/:id"
                                        render={
                                            ( props ) => ( <Editor
                                                webIds={ webIds }
                                                idApp={ safe.idApp }
                                                { ...props }
                                                updateWebId={ updateWebId }
                                                getWebId={ getWebId }
                                            /> )
                                        }
                                    />
                                    <Route
                                        path="/create/new"
                                        render={ props => ( <IdForm
                                            submit={ addWebId }
                                            getAvailableWebIds={ getAvailableWebIds }
                                            idApp={ safe.idApp }
                                            webIds={ webIds }
                                            { ...props }
                                        /> ) }
                                    />
                                    <Route path="/" render={ () => <Redirect to="/list" /> } />
                                </Switch>
                            </Content>
                        </Layout>

                    </Col>
                </Row>

            </div>
        );
    }
}


function mapDispatchToProps( dispatch )
{
    const actions =
    {
        ...safeActions,
        ...webIdsActions
    };
    return bindActionCreators( actions, dispatch );
}

function mapStateToProps( state )
{
    return {
        webIds : state.webIds,
        safe   : state.safe
    };
}
export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
