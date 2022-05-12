import React from 'react';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import {
  Container, connectToHarmowareVis, HarmoVisLayers, MovesLayer, MovesInput
} from 'harmoware-vis';

const mapTable = [
  {name:"Google Maps", url:"https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},
  {name:"Google Roads", url:"https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"},
  {name:"Google Terrain", url:"https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}"},
  {name:"Google Satellite Hybrid", url:"https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"},
  {name:"Google Satellite", url:"https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"},
  {name:"Google Streets", url:"https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"},
 ]

class App extends Container {
  constructor(props) {
    super(props);
    this.state = {
      mapindex: 0
    }
  }

  getMapSelected(e) {
    this.setState({mapindex:+e.target.value})
  }

  render() {
    const { actions, clickedObject, inputFileName, viewport,
      routePaths, movesbase, movedData } = this.props;
    const { movesFileName } = inputFileName;
    const optionVisible = false;

    return (
      <div>
        <div className="harmovis_controller">
          <ul className="flex_list">
            <li className="flex_row">
              <div className="harmovis_input_button_column">
              <label htmlFor="MovesInput">
                Operation data<MovesInput actions={actions} id="MovesInput" />
              </label>
              <div>{movesFileName}</div>
              </div>
            </li>
            <li className="flex_row">
              <div className="form-select" title='Select Map'>
                <select value={this.state.mapindex} onChange={this.getMapSelected.bind(this)} >
                {mapTable.map((x,i)=><option value={i} key={i}>{x.name}</option>)}
                </select>
              </div>
            </li>
          </ul>
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport} actions={actions}
            visible={false}
            layers={[
              new TileLayer({
                data: mapTable[this.state.mapindex].url,
                renderSubLayers: props => {
                  const {
                    bbox: {west, south, east, north}
                  } = props.tile;
            
                  return new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                  });
                }
              }),
              new MovesLayer({ routePaths, movesbase, movedData,
                clickedObject, actions, optionVisible }),
            ]}
          />
          <div className="harmovis_footer">© Google</div>
        </div>
      </div>
    );
  }
}
export default connectToHarmowareVis(App);
