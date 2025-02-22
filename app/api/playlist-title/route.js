export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
        return Response.json({ error: "Missing playlistId" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`);
        const html = await response.text();

        // Extract title using regex
        const match = html.match(/<title>(.*?) - YouTube<\/title>/);
        const title = match ? match[1] : "Unknown Playlist";

        return Response.json({ title });
    } catch (error) {
        return Response.json({ error: "Failed to fetch playlist title" }, { status: 500 });
    }
}
