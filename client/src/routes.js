import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import App from './app';
import SelectReportPage from './reports/select-report-page';
import ReportDetailPage from './reports/report-detail-page';

const Routes = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={SelectReportPage}/>
        <Route path="report/:org(/:repo)" component={ReportDetailPage}/>
      </Route>
    </Router>
  );
};

export default Routes;
