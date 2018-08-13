import React, {Component} from 'react';

class Sidebar extends Component {

    state = {
        query: ''
    }

    updateQuery = (e) => { // update the value according to the user's entry
        this.setState({query: e.target.value});
    }    

    render() {

        if (this.state.query.length > 0) { // if user started searching for places
            this.props.selectedPlaces.forEach((place, index) => {
                if (place.name.toLowerCase().includes(this.state.query.toLowerCase())) { // make sure entry is not case sensitive
                    this.props.markers[index].setVisible(true); // show markers on the map for filtered places
                } else {
                    if (this.props.infowindow.anchor === this.props.markers[index]) { // remove the chosen marker from map when query was changed
                        this.props.infowindow.close();
                    }
                    if (this.props.markers[index]) { // hide places which are out of seach query
                        this.props.markers[index].setVisible(false);
                    } else {
                        return;
                    }
                }
            })
        } else {
            this.props.selectedPlaces.forEach((place, index) => { // show all places if user didn't start searching
                if (this.props.markers[index]) {
                    this.props.markers[index].setVisible(true);
                }
            })
        }

        return (
            <div id="sidebar">
                <div id="filterContainer">
                    <input id="filter" role="search" type="text" placeholder="Find place by name" markers={this.props.markers} value={this.state.query} onChange={this.updateQuery}/>      
                </div>
                <ul id="placesList">
                    {this.props.markers.filter(marker => marker.getVisible()).map((marker, index) => 
                        (<li key={index} className="listItem" role="link" tabIndex="0">{marker.title}</li>)
                    )}
                </ul>
            </div>
        );
    }
}

export default Sidebar
