
import Home from './components/Home'
import LocationChart from './components/LocationChart'
import usePageStore from './store/pageStore';

function App() {

  const currentPage = usePageStore((state) => state.currentPage);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4 flex-col gap-2">
        {currentPage === "home" ? <Home/> : <LocationChart shortUrl='j0lW9-'/>}
      </div>
    </>
  )
}

export default App
