
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

const categories = {
    entertainments: 2,
    world: 1,
    opinion: 1,
    food: 2,
    game: 5,
    science: 3,
    programming: 2,
    academia: 1
};

export async function getNews(): Promise<string> {
    const key = process.env.NEWS_API;

    if (!key) {
        console.error("NEWS_API is missing from .env");
        return "No news today...";
    }

    try {
        const entries = Object.entries(categories);
        const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
        
        let random = Math.random() * totalWeight;
        
        const randomItem = entries.find(([, weight]) => (random -= weight) < 0)?.[0];
        const response = await fetch(
            `https://api.currentsapi.services/v1/latest-news?language=en&category=${randomItem}`,
            {
                headers: {
                    'Authorization': `Bearer ${key}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`News API error: ${response.status} | From category: ${randomItem}`);
        }

        const data: NewsApiResponse = await response.json();

        console.log("News fetched successfully.");

        if (!data.news || data.news.length === 0) {
            return "No news today...";
        }

        const article = data.news[Math.floor(Math.random() * 10)];

        console.log("Top headline:", article.title);

        return article.title;

    } catch (error: unknown) {
        console.error("Failed to fetch news:", error);
        return "No news today...";
    }
}
