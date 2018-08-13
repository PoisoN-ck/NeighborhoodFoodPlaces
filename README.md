# Project Description

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The app shows the user 20 places (markers) within 1,000 metres around his current location connected with food (bars, cafes, restaurants etc). The most important thing is that user has to share current location with the browser in order to start using the app. Otherwise, nothing will be shown.

Two main components of the app are:

* Map
* List

Everything is connected to Map component, which means that when List is interacted, the info will be displayed on the Map as well.

Each place has a marker on the map and the list item in the places list. Clicking on either map marker or list item will open the infowindow pop up with the additional information about the place like name, address, photo etc (if available).

Also, there is a Search option. When used, markers and list items will be shown according to the user's query. As a default (if Search query is empty) all markers are shown. If nothing can be found with tge query, no markers or items in the list will be shown.

# Project Dependencies

* [google-maps-react](https://github.com/fullstackreact/google-maps-react) to use Google Maps API

# Installing a Dependency

The generated project includes React and ReactDOM as dependencies. It also includes a set of scripts used by Create React App as a development dependency. You may install other dependencies (for example, React Router) with `npm`:

* npm install --save react-router

# API used

For full project functionality two API's were used:

* Google Maps API
* Foursquare API

# To start the project

In console type `npm start` which runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


# Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.