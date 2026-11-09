
interface NewsArticle {
    title: string;
    description?: string;
    url?: string;
    published?: string;
}

interface NewsApiResponse {
    status: string;
    news: NewsArticle[];
}

export async function getNews(): Promise<string> {
    const key = process.env.NEWS_API;

    if (!key) {
        console.error("NEWS_API is missing from .env");
        return "No news today...";
    }

    try {
        const response = await fetch(
            'https://api.currentsapi.services/v1/latest-news?language=en&category=world',
            {
                headers: {
                    'Authorization': `Bearer ${key}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }

        const data: NewsApiResponse = await response.json();

        console.log("News fetched successfully.");

        if (!data.news || data.news.length === 0) {
            return "No news today...";
        }

        const article = data.news[Math.random() * 10];

        console.log("Top headline:", article.title);

        return article.title;

    } catch (error: unknown) {
        console.error("Failed to fetch news:", error);
        return "No news today...";
    }
}
