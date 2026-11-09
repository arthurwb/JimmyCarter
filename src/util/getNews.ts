export async function getNews(): Promise<string> {
    const key = process.env.NEW_API;

    await fetch('https://api.currentsapi.services/v1/latest-news?language=en&category=world', {
    headers: {
        'Authorization': `Bearer ${key}`
    }
    })
    .then(response => response.json())
    .then(data => {
        console.log("news fetched");
        console.log(data);
        return data.news[0].title;
    });

    return "No news today..."
}