import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import SavedSearch from './SavedSearch';
import { deleteSearch } from '../../actions/SaveSearch';
import { fetchNews } from '../../actions/News';

class LoadSavedSearches extends Component {
  constructor() {
    super();
    this.state = {
      filterSearches: false,
      savedSearches: [],
      start: 0,
      end: 6
    }
  }

  componentDidMount() {
    this.getSavedSearchList();
  }

  pageForward = () => {
    this.setState({
      ...this.state,
      start: this.state.start+6,
      end: this.state.end+6
    })
  }

  pageBackward = () => {
    this.setState({
      ...this.state,
      start: this.state.start-6,
      end: this.state.end-6
    })
  }

  deleteSearch = (event) => {
    event.preventDefault();
    this.props.deleteSearch(event.target.name);
  }

  loadSavedSearch = (event) => {
    event.preventDefault();
    const targetSearch = this.props.userInfo.user.searches.filter(search => {
      return search.id == event.target.name
    })[0]
    const searchTerms = {
      q: targetSearch.q,
      startDate: targetSearch.start_date,
      endDate: targetSearch.end_date,
    }
    this.props.fetchNews(searchTerms);
  }

  // connects directly to backend to fetch updated list of searches
  // per code review challenge requirement (to bypass Redux store)
  getSavedSearchList = () => {
    const token = "bearer " + localStorage.getItem("jwt");
    fetch(`http://localhost:3000/api/searches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data => {
      const searchList = data.sort((a, b) => b.votes - a.votes)
      this.setState({
        ...this.state,
        savedSearches: searchList
      })
    })
  }

  triggerUpdate = () => {
    this.getSavedSearchList();
  }

  filterSearches = () => {
    this.setState({
      filterSearches: true
    })
  }

  render() {
    // console.log("this.state.savedSearches: ", this.state.savedSearches)
    // console.log("After slice:", this.state.savedSearches.slice(this.state.start, this.state.end))
    const savedSearchList = this.state.savedSearches.slice(this.state.start, this.state.end).map(search => {
      return <SavedSearch
                key={search.id}
                id={search.id}
                query={search.q}
                startDate={search.start_date}
                endDate={search.end_date}
                votes={search.votes}
                deleteSearch={this.deleteSearch}
                loadSavedSearch={this.loadSavedSearch}
                triggerUpdate={this.triggerUpdate} />
    })
    // console.log("const savedSearchList: ", savedSearchList)

    const backButton = this.state.start > 0 ? <button onClick={this.pageBackward}>&larr; back</button> : null

    const forwardButton = this.state.end < this.props.userInfo.user.searches.length ? <button onClick={this.pageForward}>next &rarr;</button> : null

    const filterButton = <button onClick={this.filterSearches}>Filter 20+</button>

    const filteredSearchList = this.state.savedSearches.filter(search => search.votes > 20).map(search => {
      return <SavedSearch
                key={search.id}
                id={search.id}
                query={search.q}
                startDate={search.start_date}
                endDate={search.end_date}
                votes={search.votes}
                deleteSearch={this.deleteSearch}
                loadSavedSearch={this.loadSavedSearch}
                triggerUpdate={this.triggerUpdate} />
    })

    return (
      <div className="options-section">
        <fieldset>
          <legend>Load Saved Search</legend>
          {this.state.filterSearches ? filteredSearchList : savedSearchList}
          <p className="nav">
            {backButton}
            {forwardButton}
            {filterButton}
          </p>
        </fieldset>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProps, { fetchNews, deleteSearch })(LoadSavedSearches);
