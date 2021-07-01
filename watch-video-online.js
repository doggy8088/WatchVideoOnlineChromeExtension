chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        var headers = details.responseHeaders;
        let mime = '';
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].name.toLowerCase() == 'content-disposition') {
                let contentDisposition = headers[i].value;
                if (contentDisposition.indexOf('attachment') == 0) {
                    // Get filename from location.pathname by default
                    let filename = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
                    // Overwrite filename if there is an attachment with filename
                    let pos = contentDisposition.indexOf('filename=');
                    if (pos >= 0) {
                        filename = contentDisposition.substr(pos).replace(/"/g, '');
                    }

                    // Detect MIME Type from filename
                    let fileext = filename.substr(filename.lastIndexOf('.'));
                    mime = getMimeType(fileext);
                    if (mime) {
                        // Modify the Content-Disposition header
                        headers[i].value = 'inline';
                    }
                }
                break;
            }
        }
        if (mime) {
            for (var j = 0; j < headers.length; j++) {
                if (headers[j].name.toLowerCase() == 'content-type') {
                    if (headers[j].value == 'application/octet-stream' || headers[j].value == 'application/x-download') {
                        // Modify the Content-Type header if there is MIME Type detected
                        headers[j].value = mime;
                    }
                    break;
                }
            }
        }
        return {
            responseHeaders: headers
        };
    }, {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame'] //,'stylesheet','script','image','object','xmlhttprequest','other']
}, ['blocking', 'responseHeaders']);

function getMimeType(fileext) {
    let mime = '';
    switch (fileext.toLowerCase()) {
        case '.mpg':
        case '.mpeg':
            mime = 'video/mpeg';
            break;
        case '.mp4':
        case '.m4v':
        case '.m4p':
            mime = 'video/mp4';
            break;
        case '.ogv':
        case '.ogg':
            mime = 'video/ogg';
            break;
        case '.mov':
            mime = 'video/quicktime';
            break;
        case '.webm':
            mime = 'video/webm';
            break;
        default:
            break;
    }
    return mime;
}

