import React from 'react';
import {Link} from 'react-router';
import {Grid, Row, Col, Overlay, ListGroup, ListGroupItem, Popover} from 'react-bootstrap';
import {Typeahead} from 'react-typeahead';
import fuzzy from 'fuzzy';

const TypeaheadList = ({options, selectionIndex}) => {
  // TODO: https://react-bootstrap.github.io/components.html#custom-overlays

  function renderOptions(options) {
    function linkTo(option) {
      return option.repo ? `/report/${option.org}/${option.repo}` : `/report/${option.org}`;
    }

    return options.map(option => {
      return <li key={`${option.org}/${option.repo}`}>
        <Link to={linkTo(option)}>
          {option.org} / {option.repo}
          <span className="text-muted pull-right">&nbsp;&nbsp;<small>moments ago</small></span>
        </Link>
      </li>
    })
  }

  return (
    <div className="dropdown open">
      <ul className="dropdown-menu">
        <li className="dropdown-header">Organizations</li>
        {renderOptions(options.filter(o => !o.repo))}
        <li className="dropdown-header">Repositories</li>
        {renderOptions(options.filter(o => o.repo))}
        <li role="separator" className="divider"></li>
        <li><a href="#">Search GitHub</a></li>
      </ul>
    </div>
  );
};

export default class SelectReportPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {reports: []};
  }

  componentDidMount() {
    // TODO: fetch on keypress
    fetch('api/stats')
      .then(res => {
        if (res.status >= 400) {
          throw new Error(`Status >= 400`);
        }
        return res.json();
      })
      .then(res => {
        this.setState({reports: res.orgs.concat(res.repos)});
      })
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <Typeahead
              options={this.state.reports}
              maxVisible={10}
              customListComponent={TypeaheadList}
              filterOption={this._filterOption}
            />
          </Col>
        </Row>
      </Grid>
    );
  }

  _filterOption(inputValue, option) {
    return fuzzy.test(inputValue, option.org) || option.repo && fuzzy.test(inputValue, option.repo);
  }

}
