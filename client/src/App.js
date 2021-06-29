import './App.css';
import { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import SignIn from './components/signIn';

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path={ROUTES.SIGN_IN} component = {SignIn} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
