import { useState, useEffect } from "react";
import { MaterialSymbol } from "react-material-symbols";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
        setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
}, []);

return windowDimensions;
}

export default function ScreenNotification()
{
    const { height, width } = useWindowDimensions();

    return (<>
        {height > width && <div className="screen_notification">
            <p>Landscape view only</p>
            <p className="screen_notification__icon"><MaterialSymbol icon="screen_rotation"/></p>
            <p>Please rotate your device</p>
        </div>}
        {(height < 250 || width < 250) && <div className="screen_notification screen_notification--small">
            <p>Screen too small</p>
            <p className="screen_notification__icon screen_notification__icon--small"><MaterialSymbol icon="stop_screen_share"/></p>
            <p>Please resize your browser window</p>
        </div>}

    </>)
}