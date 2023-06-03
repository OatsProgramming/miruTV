export default async function getRecents(): Promise<EnimeRecent | void> {
    try {
      const res = await fetch('http://localhost:3000/api/enime/recent')
  
      if (!res.ok) {
        const result = await res.text()
        console.error(result)
      }
  
      return res.json()
    } catch (err) {
      console.error(err)
    }
  }