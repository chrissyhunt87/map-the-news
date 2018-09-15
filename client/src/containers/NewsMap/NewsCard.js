import React from 'react';
import { Component } from 'react';
import Headline from '../../components/NewsItems/Headline';
import HeadlineList from '../../components/NewsItems/HeadlineList';
import { connect } from 'react-redux';
import { setActiveNewsSource } from '../../actions/Application';

class NewsCard extends Component {

  handleHeadlineClick = (event) => {
    event.preventDefault();
    this.props.setActiveNewsSource(event.target.name);
  }

  render () {
    console.log("inside NewsCard, props: ", this.props)
    console.log("inside NewsCard, state: ", this.state)
    const fullClass = `news-item ${this.props.source}`
    return (
      <div className={fullClass}>
        <Headline newsInfo={this.props.newsInfo[0]} handleHeadlineClick={this.handleHeadlineClick} source={this.props.source} />
      </div>
    )
  }
}

export default connect(null, { setActiveNewsSource })(NewsCard);
