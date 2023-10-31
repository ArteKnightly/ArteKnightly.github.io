// Base Table Class
class BaseTable {
    constructor(sheetName, endpoint) {
        this.sheetName = sheetName;
        this.endpoint = endpoint || 'https://script.google.com/macros/s/AKfycbyYSyrmkTUfZjkfIzgRW8MD5VYHfE9eIjxfVqr-kRHemfklIEUmQ2xL0ngofDfjRRSjgw/exec';

    }

    read() {
        httpDo(
            `${this.endpoint}?sheetName=${this.sheetName}`,
            'GET',
            function(res) {
                console.log(res);
                // Process the returned data here
            }
        );
    }

    write(data) {
        data.sheetName = this.sheetName; // Add sheetName to the data object
        httpDo(
            this.endpoint,
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
}

// Specific Table Class for ImageManifest
class ImageManifestTable extends BaseTable {
    constructor() {
        super('ImageManifest');
    }

    write(UUIDImage, ImageName, createdBy, creationDate, addedDate) {
        const data = {
            UUIDImage,
            ImageName,
            createdBy,
            creationDate,
            addedDate
        };
        super.write(data);
    }
}

// Specific Table Class for ImageRatings
class ImageRatingsTable extends BaseTable {
    constructor() {
        super('ImageRatings');
    }

    write(UUIDImage, UUIDQuestion, Score) {
        const data = {
            UUIDImage,
            UUIDQuestion,
            Score
        };
        super.write(data);
    }
}

// Specific Table Class for CritiqueQuestions
class CritiqueQuestionsTable extends BaseTable {
    constructor() {
        super('CritiqueQuestions');
    }

    write(UUIDQuestion, stringQuestion, questionRating, avgReturnRating, numOfNA, isObsolete, totalOccurancesToDate, answerType) {
        const data = {
            UUIDQuestion,
            stringQuestion,
            questionRating,
            avgReturnRating,
            numOfNA,
            isObsolete,
            totalOccurancesToDate,
            answerType
        };
        super.write(data);
    }
}

// Specific Table Class for Attendance
class AttendanceTable extends BaseTable {
    constructor() {
        super('Attendance');
    }

    write(UUIDKnight, date, confirmed) {
        const data = {
            UUIDKnight,
            date,
            confirmed
        };
        super.write(data);
    }
}

// Usage
// You can create instances of these table classes and use their methods.
const imageManifest = new ImageManifestTable();
const imageRatings = new ImageRatingsTable();
const critiqueQuestions = new CritiqueQuestionsTable();
const attendance = new AttendanceTable();

// Example: Writing data to the ImageManifest table
//imageManifest.write('some_uuid', 'sample_image', 'creator_name', '2023-10-28', '2023-10-28');
