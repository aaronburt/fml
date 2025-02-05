document.addEventListener('DOMContentLoaded', function () {
    const uniqueFilename = getUniqueFilenameFromPath();
    const desiredFilename = getDesiredFilenameFromQuery();
    setupPreview(uniqueFilename, desiredFilename);
    setupDownloadLink(uniqueFilename, desiredFilename);
});

function getUniqueFilenameFromPath() {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1] || null;
}

function getDesiredFilenameFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('file');
}

function setupPreview(uniqueFilename, desiredFilename) {
    const mediaPreview = document.getElementById('mediaPreview');
    if (!uniqueFilename) {
        mediaPreview.textContent = 'No preview available.';
        return;
    }
    const fileExtension = uniqueFilename.split('.').pop().toLowerCase();
    const fileUrl = `/files/${encodeURIComponent(uniqueFilename)}`;
    let mediaElement;

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const audioExtensions = ['mp3', 'wav', 'ogg'];

    if (imageExtensions.includes(fileExtension)) {
        mediaElement = document.createElement('img');
        mediaElement.src = fileUrl;
        mediaElement.alt = desiredFilename;
    } else if (videoExtensions.includes(fileExtension)) {
        const video = document.createElement('video');
        const mimeType = getVideoMimeType(fileExtension);
        const canPlay = video.canPlayType(mimeType);
        if (canPlay === 'probably' || canPlay === 'maybe') {
            video.src = fileUrl;
            video.controls = true;
            video.preload = 'none'
            mediaElement = video;
        } else {
            mediaPreview.textContent = 'This video format is not supported by your browser.';
            return;
        }
    } else if (audioExtensions.includes(fileExtension)) {
        mediaElement = document.createElement('audio');
        mediaElement.src = fileUrl;
        mediaElement.controls = true;
    } else {
        mediaPreview.textContent = 'No preview available for this file type.';
        return;
    }
    mediaPreview.appendChild(mediaElement);
}

function getVideoMimeType(extension) {
    const mimeTypes = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg'
    };
    return mimeTypes[extension] || '';
}

function setupDownloadLink(uniqueFilename, desiredFilename) {
    const filenameElement = document.getElementById('filename');
    const downloadButton = document.getElementById('downloadBtn');
    if (uniqueFilename && desiredFilename) {
        filenameElement.textContent = desiredFilename;
        downloadButton.href = `/files/${encodeURIComponent(uniqueFilename)}`;
        downloadButton.download = desiredFilename;
    } else {
        filenameElement.textContent = 'Invalid file information.';
    }
}