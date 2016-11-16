import React from 'react';
import axios from 'axios';
import '../css/search.css';
import '../node_modules/react-input-range/dist/react-input-range.css';
import InputRange from 'react-input-range';
import SearchDisplay from './components/SearchDisplay';

class Search extends React.Component {
	_mounted = false;

	state = {
	      valuesAge: {
	        min: 18,
	        max: 99,
	      },
		  valuesPop: {
			  min: 0,
			  max: 100,
		  },
		  valuesLoc: {
			  min: 0,
			  max: 10000,
		  },
		  valuesTags: {
			  min: 0,
			  max: 100,
		  },
		  users: null,
		  newUsers: null,
		  loggedUser: null,
	    };

	ageChange(component, values) {
		this.setState({ valuesAge: values});
		let newArray = [];
		if (this.state.users.length !== this.state.newUsers.length) {
			newArray = this.state.users.filter((element) => {
				return (element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
			});
		} else {
			newArray = this.state.newUsers.filter((element) => {
				return (element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
			});
		}
		this.setState({ newUsers: newArray });
	}

  popCountChange(component, values) {
	  this.setState({ valuesPop: values});
	  let newArray = [];
	  if (this.state.users.length !== this.state.newUsers.length) {
		  newArray = this.state.users.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
		  });
	  } else {
		  newArray = this.state.newUsers.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
		  });
	  }
	  this.setState({ newUsers: newArray });
  }

  locationChange(component, values) {
	  this.setState({ valuesLoc: values});
	  let newArray = [];
	  if (this.state.users.length !== this.state.newUsers.length) {
		  newArray = this.state.users.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
				 	element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
		  });
	  } else {
		  newArray = this.state.newUsers.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
		  });
	  }
	  this.setState({ newUsers: newArray });
  }

  tagsChange(component, values) {
	  this.setState({ valuesTags: values});
	  let newArray = [];
	  if (this.state.users.length !== this.state.newUsers.length) {
		  newArray = this.state.users.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
				 	element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
				 	element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);
		  });
	  } else {
		  newArray = this.state.newUsers.filter((element) => {
			  return (element.popCount >= this.state.valuesPop.min && element.popCount <= this.state.valuesPop.max &&
			  		element.age >= this.state.valuesAge.min && element.age <= this.state.valuesAge.max &&
					element.distance >= this.state.valuesLoc.min && element.distance <= this.state.valuesLoc.max &&
					element.commonTags.length >= this.state.valuesTags.min && element.commonTags.length <= this.state.valuesTags.max);		  });
	  }
	  this.setState({ newUsers: newArray });
  }

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	};

	componentWillMount() {
		axios({
			method: 'post',
			url: 'http://localhost:8080/fullsearch',
			headers: {
				logToken: localStorage.getItem('logToken'),
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			if (data) {
				this.setState({ users: data.listUser, newUsers: data.listUser, loggedUser: data.loggedUser });
			}
		});
	};

	render() {
		return (
			<div>
				<div className="searchInput">
				<span>Age</span>
				<InputRange
					maxValue={140}
        			minValue={18}
        			value={this.state.valuesAge}
        			onChange={this.ageChange.bind(this)}
					/>
					<span>Popularity</span>
		  		<InputRange
					maxValue={100}
        			minValue={0}
        			value={this.state.valuesPop}
        			onChange={this.popCountChange.bind(this)}
					/>
					<span>Localisation</span>
				<InputRange
					maxValue={10000}
        			minValue={0}
        			value={this.state.valuesLoc}
        			onChange={this.locationChange.bind(this)}
					/>
					<span>Common Tags</span>
		 		<InputRange
					maxValue={100}
        			minValue={0}
        			value={this.state.valuesTags}
        			onChange={this.tagsChange.bind(this)}
					/>
					</div>
				<div className="searchResult">
				<SearchDisplay data={this.state.newUsers} data1={this.state.loggedUser}/>
				</div>
			</div>
		)
	}
};

export default Search;
