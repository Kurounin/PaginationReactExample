import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { render } from 'react-dom';
import BootstrapPaginator from 'react-bootstrap-pagination';
import { Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

class InfoPage extends Component {
  render() {
    return (
      <div>
        <h2>Learn Meteor!</h2>
        <ul>
          <li><a href="https://www.meteor.com/try" target="_blank">Do the Tutorial</a></li>
          <li><a href="http://guide.meteor.com" target="_blank">Follow the Guide</a></li>
          <li><a href="https://docs.meteor.com" target="_blank">Read the Docs</a></li>
          <li><a href="https://forums.meteor.com" target="_blank">Discussions</a></li>
        </ul>
      </div>
    );
  }
}

class HomePageBody extends Component {
  renderDocument(document) {
    return (
      <li key={document._id}>Document #{document._id}: {document.title}  </li>
    );
  }

  render() {
    if (!this.props.ready) {
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
    ready: params.pag.ready(),
    documents: params.pag.getPage()
  };
}, HomePageBody);

class HomePageRoute extends Component {
  constructor(props) {
    super(props);

    this.pagination = new Meteor.Pagination(MyCollection, {
      filters: {
        idx: {$gt: 9}
      },
      sort: {
        title: 1
      },
      debug: true
    });
    this.state = {currentTemplate: "home"};
  }

  handleTabClick(name) {
    this.setState({currentTemplate: name.toLowerCase()});
  }

  renderTab(name) {
    let tabClass = "";

    if (this.state.currentTemplate === name.toLowerCase()) {
      tabClass += "active";
    }

    return (
      <li role="presentation" onClick={this.handleTabClick.bind(this, name)} className={tabClass}><a href="#">{name}</a></li>
    );
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          {this.renderTab('Home')}
          {this.renderTab('Info')}
        </ul>
        {this.state.currentTemplate === "home" ? <HomePage pag={this.pagination} params={{pag: this.pagination}} /> : <InfoPage />}
      </div>
    );
  }
}

AppRoutes = (
  <Route path="/" component={HomePageRoute} />
);

ReactRouterSSR.Run(AppRoutes);