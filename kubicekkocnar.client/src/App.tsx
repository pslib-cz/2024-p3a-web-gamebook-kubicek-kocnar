import './App.css';
import MapRenderer from './components/map/MapRenderer';

function App() {
    

    return (
        <div className='canvas'>
            <MapRenderer />
            {/* <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents} */}
        </div>
    );
}

export default App;