import React from 'react';
import '../css/index.css';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App';
import Login from './login';
import Accueil from './Accueil';
import createUser from './createUser';
import Board from './board';
import '../css/master.css';
import App1 from './App1';
import EditProfile from './editProfil';
import ForgotPassword from './forgotPassword';
import ResetPassword from './ResetPassword';
import userProfile from './userProfile';
import search from './search';
import logout from './logout';
import home from './home';
import Erreur404 from './erreur404';
import Notification from './notification';
import Chat from './chat';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
		<IndexRoute component={Accueil} />
		<Route path="login" component={Login}/>
		<Route path="createUser" component={createUser} />
		<Route path="forgotpassword" component={ForgotPassword} />
		<Route path="resetpassword" component={ResetPassword} />
	</Route>
	<Route path="matcha" component={App1}>
		<Route path="board" component={home} />
		<Route path="edit" component={EditProfile} />
		<Route path="profile/:username" component={userProfile} />
		<Route path="profile" component={userProfile} />
		<Route path="search" component={search} />
		<Route path="logout" component={logout} />
		<Route path="suggest" component={Board} />
		<Route path='notification' component={Notification}/>
		<Route path='chat' component={Chat}/>
	</Route>
	<Route path="*" component={Erreur404} />
  </Router>
), document.getElementById('root'))
