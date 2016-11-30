import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { render } from 'react-dom';
import BootstrapPaginator from 'react-bootstrap-pagination';
import { IndexRoute, Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

class HomePageBody extends Component {
  renderDocument(document) {
    return (
      <li key={document._id}>Document #{document._id}: {document.title}  </li>
    );
  }

  render() {
    if (!this.props.pag.ready()) {
        return (
            <div>Loading...</div>
        );
    }

    return (
      <div>
          <ul>
              {this.props.documents.map(this.renderDocument)}
          </ul>
          <BootstrapPaginator
              pagination={this.props.pag}
              limit={10}
              containerClass="text-left"
              />
      </div>
    );
  }
}

const HomePage = createContainer(({ params }) => {
  return {
    documents: params.pag.getPage()
  };
}, HomePageBody);

class HomePageRoute extends Component {
  constructor(props) {
    super(props);

    this.pagination = new Meteor.Pagination(MyCollection);
  }

  render() {
    return (
      <HomePage pag={this.pagination} params={{pag: this.pagination}} />
    );
  }
}

AppRoutes = (
  <Route path="/" component={HomePageRoute} />
);

ReactRouterSSR.Run(AppRoutes);