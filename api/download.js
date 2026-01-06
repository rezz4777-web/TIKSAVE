export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL TikTok diperlukan' });
    }

    const apiKey = process.env.RAPIDAPI_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: 'Konfigurasi API Key di server belum lengkap.' });
    }

    try {
        // PERUBAHAN DISINI: Menggunakan endpoint /v1/posts untuk download via URL
        const apiResponse = await fetch(`https://tiktok-video-no-watermark2.p.rapidapi.com/v1/posts?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        const data = await apiResponse.json();

        // API ini mengembalikan data di dalam object "data" jika sukses (code 0)
        if (apiResponse.ok && data.code === 0 && data.data) {
            return res.status(200).json({
                success: true,
                title: data.data.title || 'TikTok Video',
                cover: data.data.cover,
                downloadUrl: data.data.play,      
                downloadUrlHd: data.data.hdplay, 
                author: data.data.author,
                size: data.data.size,
                hd_size: data.data.hd_size
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                error: data.msg || 'Gagal mengambil data video. Pastikan URL benar.' 
            });
        }

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ success: false, error: 'Terjadi kesalahan pada server.' });
    }
}