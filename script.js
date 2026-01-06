// script.js
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const resultContainer = document.getElementById('resultContainer');

    window.pasteFromClipboard = async () => {
        try { const text = await navigator.clipboard.readText(); videoUrlInput.value = text; } catch (err) { console.error('Gagal membaca clipboard:', err); }
    };

    downloadBtn.addEventListener('click', async () => {
        const url = videoUrlInput.value.trim();
        if (!url) { videoUrlInput.classList.add('border-red-500'); setTimeout(() => videoUrlInput.classList.remove('border-red-500'), 2000); return; }
        
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Processing...`;

        try {
            const response = await fetch('/api/download', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url }),
            });
            const data = await response.json();

            if (data.success) {
                resultContainer.classList.remove('hidden');
                resultContainer.innerHTML = `
                    <div class="w-full bg-surface-light dark:bg-surface-dark rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-gray-800 overflow-hidden">
                        <div class="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30 px-6 py-4 flex items-center gap-3"><div class="bg-green-100 dark:bg-green-800 rounded-full p-1"><span class="material-icons-round text-green-600 dark:text-green-400 text-lg block">check</span></div><span class="text-green-700 dark:text-green-400 font-medium">Video ditemukan! Siap untuk diunduh.</span></div>
                        <div class="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div class="flex-shrink-0 w-full md:w-48 aspect-[9/16] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden relative shadow-md group"><div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-80"></div><img alt="Video Thumbnail" class="w-full h-full object-cover mix-blend-overlay opacity-50" src="${data.cover || 'https://via.placeholder.com/150'}"/><div class="absolute inset-0 flex items-center justify-center"><span class="material-icons-round text-white text-5xl drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform duration-300">play_circle</span></div><div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">${data.duration || '00:00'}</div></div>
                            <div class="flex-grow w-full space-y-6">
                                <div><h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${data.title || 'Video Title'}</h3><p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><span class="material-icons-round text-sm">person</span> @${data.author?.unique_id || 'username'} <span class="mx-1">•</span> ${data.play_count || '0'} Views</p></div>
                                <div class="grid gap-4">
                                    <a href="${data.downloadUrl}" target="_blank" download class="group relative flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200">
                                        <div class="flex items-center gap-4"><div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><span class="material-icons-round">sd</span></div><div class="text-left"><div class="font-semibold text-gray-900 dark:text-white">Download (Kualitas Standar)</div><div class="text-xs text-gray-500 dark:text-gray-400">MP4 • Without Watermark • ~${(data.size / 1000000).toFixed(2)}MB</div></div></div><span class="material-icons-round text-gray-400 group-hover:text-primary transition-colors">download</span>
                                    </a>
                                    <a href="${data.downloadUrlHd}" target="_blank" download class="group relative flex items-center justify-between p-4 rounded-xl border-2 border-primary/20 dark:border-primary/30 hover:border-primary dark:hover:border-primary bg-primary/5 dark:bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/10 transition-all duration-200">
                                        <div class="absolute -top-3 -right-3"><span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">Best</span></div>
                                        <div class="flex items-center gap-4"><div class="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><span class="material-icons-round">hd</span></div><div class="text-left"><div class="font-semibold text-gray-900 dark:text-white">Download (Kualitas HD)</div><div class="text-xs text-gray-500 dark:text-gray-400">MP4 • Full Resolution • ~${(data.hd_size / 1000000).toFixed(2)}MB</div></div></div><span class="material-icons-round text-primary">download</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
            } else {
                resultContainer.classList.remove('hidden');
                resultContainer.innerHTML = `<div class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 text-red-700 dark:text-red-400 font-medium text-center">${data.error}</div>`;
            }
        } catch (error) {
            resultContainer.classList.remove('hidden');
            resultContainer.innerHTML = `<div class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 text-red-700 dark:text-red-400 font-medium text-center">Terjadi kesalahan jaringan. Coba lagi nanti.</div>`;
            console.error('Error:', error);
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `<span>Dapatkan Link</span><span class="material-icons-round">arrow_forward</span>`;
        }
    });
});