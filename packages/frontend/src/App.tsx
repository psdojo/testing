import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
function App() {
  function handleSubmit(e) {
    e.preventDefault()
    const url = e.target.inputUrl.value
    axios.post('http://localhost:3000/', { url }).then((response) => { console.log(response) }).catch((error) => { console.log(error) })
    console.log(url)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Input
          type="text"
          placeholder="Enter website url"
          name="inputUrl"
        />
        <Button type="submit" >Generate</Button>
      </div>
    </form>
  )
}
export default App
