// GSheetFunc.js

export function sheetRead() {
    httpDo(
        'YOUR_GOOGLE_SCRIPT_URL?sheetName=ImageManifest',
        'GET',
        function(res) {
            console.log(res);
            // Process the returned data here
        }
    );
}

export function sheetWrite() {
    let data = {
        sheetName: 'ImageManifest',
        UUIDImage: 'some_uuid',
        ImageName: 'sample_image',
        //... other fields ...
    };

    httpDo(
        'YOUR_GOOGLE_SCRIPT_URL',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data
        },
        function(res) {
            console.log(res);
        }
    );
}
