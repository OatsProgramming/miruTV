export default async function enimeFetcher(route: EnimeRoute): Promise<any> {
    try {
      const routeArr = Object.values(route)
      const joinedRoute = routeArr.join('/')
      const res = await fetch(`http://localhost:3000/api/enime/${joinedRoute}`)
  
      if (!res.ok) {
        const result = await res.text()
        console.error(result)
        return
      }
      return res.json()
    } catch (err) {
      console.error(err)
    }
  }