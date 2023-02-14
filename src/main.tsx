import ReactDOM from 'react-dom/client'
import {create} from 'zustand';

type WeatherState = {
  processState: 'LOADING' | 'ERROR' | 'READY' | 'INIT'
  getResults: () => Promise<void>
  data: any[] | undefined
}
const useWeatherStore = create<WeatherState>((set) => ({
  processState: 'INIT',
  data: undefined,
  getResults: async () => {
    set({
      processState: 'LOADING'
    })
    try {
      let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01');
      set({
        data: await response.json(),
        processState: 'READY'
      })
    } catch {
      set({
        processState: 'ERROR'
      })
    }
    finally {
      set({processState: 'READY'})
    }
  }
}));

// @ts-ignore
window.__hiddenNinjaFunction = () => {
  useWeatherStore.getState().getResults()
}

function LoadingState() {
  const processState = useWeatherStore(state => state.processState)
  return <div>
    {processState}
  </div>
}

function App() {
  const weatherState = useWeatherStore();

  console.count('render');

  if (weatherState.processState === 'LOADING') {
    return <div>loading</div>
  } else if (weatherState.processState === 'INIT') {
    return <div onClick={weatherState.getResults}>LOAD DATA</div>
  } else if (weatherState.processState === 'ERROR') {
    return <div onClick={weatherState.getResults}>ERROR</div>
  }
  return <div>
    <LoadingState />
    {JSON.stringify(weatherState.data)}
  </div>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />,
)
