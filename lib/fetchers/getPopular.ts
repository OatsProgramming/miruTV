export default async function getPopular(): Promise<EnimePopular | void> {
    try {
      const res = await fetch('http://localhost:3000/api/enime/popular')
  
      if (!res.ok) {
        const result = await res.text()
        console.error(result)
      }
  
      return res.json()
    } catch (err) {
      console.error(err)
    }
  }