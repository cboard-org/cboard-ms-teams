import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Route, Switch, Redirect } from "react-router-dom";
import classNames from 'classnames';
import * as microsoftTeams from "@microsoft/teams-js";

import Activate from '../Account/Activate';
import ChangePassword from '../Account/ChangePassword';
import OAuthLogin from '../Account/OAuthLogin';
import AuthScreen, { RedirectIfLogged } from '../AuthScreen';
import BoardContainer from '../Board';
import PremiumRequiredModal from '../PremiumFeature/PremiumRequiredModal';
import Notifications from '../Notifications';
import NotFound from '../NotFound';
import Settings from '../Settings';
import WelcomeScreen from '../WelcomeScreen';
import Analytics from '../Analytics';
import AppTabConfig from '../AppTabConfig';
import './App.css';

export class App extends Component {
  static propTypes = {
    /**
     * App language direction
     */
    dir: PropTypes.string.isRequired,
    /**
     * If 'true', user first visit
     */
    isFirstVisit: PropTypes.bool,
    /**
     * If 'true', user is logged in
     */
    isLogged: PropTypes.bool,
    /**
     * If 'true', user is downloading a new lang
     */
    isDownloadingLang: PropTypes.bool,
    /**
     * App language
     */
    lang: PropTypes.string.isRequired,
    /**
     * If 'true', dark mode is enabled
     */
    dark: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { initialized: false };
  }

  componentDidMount() {
    if (!this.state.initialized) {
      //if (this.inTeams()) {
      console.log("App.js: initializing client SDK");
      microsoftTeams.app
        .initialize()
        .then(() => {
          console.log("App.js: initializing client SDK initialized");
          microsoftTeams.app.notifyAppLoaded();
          microsoftTeams.app.notifySuccess();
          this.setState({ initialized: true });
        })
        .catch((error) => console.error(error));
      //} else {
      //  this.setState({ initialized: true });
      //}
    }
  }

  inTeams = () => {
    const url = new URL(window.location);
    const params = url.searchParams;
    return !!params.get("inTeams");
  };

  render() {
    const {
      lang,
      dir,
      isFirstVisit,
      isLogged,
      dark,
      isDownloadingLang
    } = this.props;
    console.log(window.location.href);

    return (
      <div className={classNames('App', { 'is-dark': dark })}>
        <Helmet>
          <html lang={lang} dir={dir} />
        </Helmet>

        <Notifications />
        <Switch>
          <RedirectIfLogged
            component={AuthScreen}
            isLogged={isLogged}
            path="/login-signup"
            to="/"
          />
          <Route path="/settings" component={Settings} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/activate/:url" component={Activate} />
          <Route path="/reset/:userid/:url" component={ChangePassword} />
          <Route path="/login/:type/callback" component={OAuthLogin} />
          <Route path="/board/:id" component={BoardContainer} />
          <Route exact path="/config" component={AppTabConfig} />
          <Route exact path="/tab" component={BoardContainer} />
          {isDownloadingLang && (
            <Route exact path={'/'}>
              <Redirect to={'/settings/language'} />
            </Route>
          )}
          <Route
            exact
            path="/"
            component={
              isFirstVisit && !isLogged ? WelcomeScreen : BoardContainer
            }
          />
          <Route component={NotFound} />
        </Switch>
        <PremiumRequiredModal />
      </div>
    );
  }
}

export default App;
