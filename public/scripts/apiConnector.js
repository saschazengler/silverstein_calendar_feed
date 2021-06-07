export default async function api_connector() {
    const response = await fetch('https://ipinfo.io', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 3dd950f5a064a6`,
            'Accept': 'application/json'
        }
    })
    return response.json()
}