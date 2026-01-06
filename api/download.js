export default async function handler(req, res) {
    // Memastikan hanya request POST yang diizinkan
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    // Validasi apakah URL dikirimkan
    if (!url) {
        return res.status(400).json({ error: 'URL TikTok diperlukan' });
    }

    // Mengambil API Key dari Environment Variables Vercel
    const apiKey = process.env.RAPIDAPI_KEY; 

    if (!apiKey) {
        console.error("Konfigurasi Error: TIKTOK_API_KEY tidak ditemukan di Environment Variables.");
        return res.status(500).json({ error: 'Konfigurasi API Key di server belum lengkap.' });
    }

    try {
        // Contoh pemanggilan ke RapidAPI atau provider TikTok Downloader lainnya
        // Sesuaikan URL fetch ini dengan dokumentasi API TikTok yang Anda gunakan
        const apiResponse = await fetch(`https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        const data = await apiResponse.json();

        if (apiResponse.ok && data.code === 0) {
            // Mengirimkan data sukses kembali ke frontend (script.js)
            return res.status(200).json({
                success: true,
                title: data.data.title,
                cover: data.data.cover,
                downloadUrl: data.data.play,      // Kualitas standar
                downloadUrlHd: data.data.hdplay, // Kualitas HD
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