import React from 'react';
import get from 'lodash/get';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps"

import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";

class WrappedMapComponent extends React.Component {
    componentWillMount() {
        const refs = {}

        this.setState({
            refs,
            bounds: null,
            center: {
                lat: 41.9, lng: -87.624
            },
            markers: [],
            onMapMounted: ref => {
                refs.map = ref;
            },
            onBoundsChanged: () => {
                this.setState({
                    bounds: refs.map.getBounds(),
                    center: refs.map.getCenter(),
                })
            },
            onSearchBoxMounted: ref => {
                refs.searchBox = ref;
            },
            onPlacesChanged: () => {
                const places = refs.searchBox.getPlaces();
                console.log(places);
                // eslint-disable-next-line no-undef
                const bounds = new google.maps.LatLngBounds();

                places.forEach(place => {
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                    } else {
                        bounds.extend(place.geometry.location)
                    }
                });
                const nextMarkers = places.map(place => ({
                    position: place.geometry.location,
                }));
                const nextCenter = get(nextMarkers, '0.position', this.state.center);

                this.setState({
                    center: nextCenter,
                    markers: nextMarkers,
                });
                // refs.map.fitBounds(bounds);
            },
        })
    }

    componentDidUpdate() {
        const { markers } = this.state

        if (markers && markers[0]) {
            const { lat, lng } = markers[0].position
            this.props.setLatLong(lat(), lng())
        }
        // setLatLong()
    }

    render() {
        const {
            onMapMounted,
            onBoundsChanged,
            onSearchBoxMounted,
            bounds,
            center,
            onPlacesChanged,
            markers,
        } = this.state


        console.log(this.state.refs.searchBox && this.state.refs.searchBox.getPlaces('London'))

        return (
            <GoogleMap
            ref={onMapMounted}
            defaultZoom={15}
            center={center}
            onBoundsChanged={onBoundsChanged}
        >
            <SearchBox
                ref={onSearchBoxMounted}
                bounds={bounds}
                // eslint-disable-next-line no-undef
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={onPlacesChanged}
            >
                <input
                    type="text"
                    placeholder="Enter your search term"
                    // onChange={e => this.setState({ searchValue: e.target.value})}
                    // value={this.state.searchValue}
                    style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `240px`,
                        height: `32px`,
                        marginTop: `27px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                    }}
                />
            </SearchBox>
            {markers.map((marker, index) =>
                <Marker key={index} position={marker.position} draggle />
            )}
        </GoogleMap>
        );
    }
}

const MapComponent = withScriptjs(withGoogleMap(WrappedMapComponent));

MapComponent.defaultProps = {
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div className="maps-loading" />,
    containerElement: <div className="maps-container" />,
    mapElement: <div className="maps-element" />,
}

export default MapComponent;