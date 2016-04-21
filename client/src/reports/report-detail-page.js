import React from 'react';
import {Grid, Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap';

const TopCommenters = function({commenters}) {
  return (
    <ListGroup>
      {commenters.map(commenter => {
        return (
          <ListGroupItem>
            <a href={`https://github.com/${commenter.user}`}>{commenter.user}</a>
            <span className="text-muted pull-right">{commenter.comments} comments</span>
          </ListGroupItem>
        )
      })}
    </ListGroup>
  );
};

export default class ReportDetailPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {topIssueCommenters: [], topPullCommenters: []};
  }

  componentDidMount() {
    var {org, repo} = this.props.params;
    var url = repo ? `/api/stats/${org}/${repo}` : `/api/stats/${org}`;

    fetch(url)
      .then(res => {
        if (res.status >= 400) {
          throw new Error(`Status >= 400`);
        }
        return res.json();
      })
      .then(res => {
        this.setState(res);
      })
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={6}>
            <h3>Users with most issue comments</h3>
            <TopCommenters commenters={this.state.topIssueCommenters} />
          </Col>
          <Col md={6}>
            <h3>Users with most pull-request comments</h3>
            <TopCommenters commenters={this.state.topPullCommenters} />
          </Col>
        </Row>
      </Grid>
    );
  }

}
