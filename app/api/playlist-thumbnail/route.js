export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");

  if (!playlistId) {
      return Response.json({ error: "Missing playlistId" }, { status: 400 });
  }

  try {
      // Fetch the XML feed for the playlist
      const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`);
      const xmlText = await response.text();

      // Parse the XML to extract the first video's thumbnail URL
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const firstVideoThumbnail = xmlDoc.querySelector("entry media\\:group media\\:thumbnail")?.getAttribute("url");

      if (!firstVideoThumbnail) {
          return Response.json({ error: "No thumbnail found for the first video" }, { status: 404 });
      }

      return Response.json({ thumbnailUrl: firstVideoThumbnail });
  } catch (error) {
      return Response.json({ error: "Failed to fetch or parse the playlist" }, { status: 500 });
  }
}
