// GSheetFunc.js

export function sheetRead() {
    httpDo(
        'https://script.google.com/macros/s/AKfycbx-AtbBX8omLZjE2sJKdJVWe9gh-hY6xW2gRfq4wLnNoK3bmEhGgp4N8jHPpCET3IiLBQ/exec',
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
        'https://script.google.com/macros/s/AKfycbx-AtbBX8omLZjE2sJKdJVWe9gh-hY6xW2gRfq4wLnNoK3bmEhGgp4N8jHPpCET3IiLBQ/exec',
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
