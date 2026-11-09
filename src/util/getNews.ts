export function getNews(): string {
    const key = process.env.NEW_API;

    fetch('https://api.currentsapi.services/v1/latest-news?language=en&category=world', {
    headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
    }
    })
    .then(response => response.json())
    .then(data => {
        return data.news[0].title;
    });

    return "No news today..."
}