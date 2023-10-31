function doPost(e) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = e.parameter.sheetName;
    var sheet = ss.getSheetByName(sheetName);
  
    if (!sheet) {
      return ContentService.createTextOutput("Error: Sheet name not found.");
    }
  
    var rowData = [];
  
    switch (sheetName) {
      case 'ImageManifest':
        rowData = [e.parameter.UUIDImage, e.parameter.ImageName, e.parameter.createdBy, e.parameter.creationDate, e.parameter.addedDate];
        break;
      case 'ImageRatings':
        rowData = [e.parameter.UUIDImage, e.parameter.UUIDQuestion, e.parameter.Score];
        break;
      case 'CritiqueQuestions':
        rowData = [e.parameter.UUIDQuestion, e.parameter.stringQuestion, e.parameter.questionRating, e.parameter.avgReturnRating, e.parameter.numOfNA, e.parameter.isObsolete, e.parameter.totalOccurancesToDate, e.parameter.answerType];
        break;
      case 'Attendance':
        rowData = [e.parameter.UUIDKnight, e.parameter.date, e.parameter.confirmed];
        break;
      default:
        return ContentService.createTextOutput("Error: Invalid sheet name.");
    }
  
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput("Data saved to sheet: " + sheetName);
  }
  
  function doGet(e) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = e.parameter.sheetName;
    var sheet = ss.getSheetByName(sheetName);
  
    if (!sheet) {
      return ContentService.createTextOutput("Error: Sheet name not found.").setMimeType(ContentService.MimeType.TEXT);
    }
  
    var data = sheet.getDataRange().getValues();
    var jsonData = [];
  
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
  
      switch (sheetName) {
        case 'ImageManifest':
          obj = {
            UUIDImage: row[0],
            ImageName: row[1],
            createdBy: row[2],
            creationDate: row[3],
            addedDate: row[4]
          };
          break;
        case 'ImageRatings':
          obj = {
            UUIDImage: row[0],
            UUIDQuestion: row[1],
            Score: row[2]
          };
          break;
        case 'CritiqueQuestions':
          obj = {
            UUIDQuestion: row[0],
            stringQuestion: row[1],
            questionRating: row[2],
            avgReturnRating: row[3],
            numOfNA: row[4],
            isObsolete: row[5],
            totalOccurancesToDate: row[6],
            answerType: row[7]
          };
          break;
        case 'Attendance':
          obj = {
            UUIDKnight: row[0],
            date: row[1],
            confirmed: row[2]
          };
          break;
        default:
          return ContentService.createTextOutput("Error: Invalid sheet name.").setMimeType(ContentService.MimeType.TEXT);
      }
  
      jsonData.push(obj);
    }
  
    return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
  }
  
  function doDelete(e) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheetName = e.parameter.sheetName;
      var sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
          return ContentService.createTextOutput("Error: Sheet name not found.");
      }
      
      var range = sheet.getDataRange();
      var values = range.getValues();
      
      for (var i = 0; i < values.length; i++) {
          if (values[i][0] == e.parameter.UUID) {
              sheet.deleteRow(i + 1);
              return ContentService.createTextOutput("Data deleted from sheet: " + sheetName);
          }
      }
      return ContentService.createTextOutput("UUID not found.");
  }
  
  function doUpdate(e) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheetName = e.parameter.sheetName;
      var sheet = ss.getSheetByName(sheetName);
      
      if (!sheet) {
          return ContentService.createTextOutput("Error: Sheet name not found.");
      }
      
      var range = sheet.getDataRange();
      var values = range.getValues();
      
      for (var i = 0; i < values.length; i++) {
          if (values[i][0] == e.parameter.UUID) {
              for (var key in e.parameter) {
                  if (key != "UUID" && key != "sheetName") {
                      var colIndex = getColumnIndex(sheetName, key);
                      if (colIndex !== -1) {
                          values[i][colIndex] = e.parameter[key];
                      }
                  }
              }
              range.setValues(values);
              return ContentService.createTextOutput("Data updated in sheet: " + sheetName);
          }
      }
      return ContentService.createTextOutput("UUID not found.");
  }
  
  function getColumnIndex(sheetName, columnName) {
      var columns = {
          'ImageManifest': ['UUIDImage', 'ImageName', 'createdBy', 'creationDate', 'addedDate'],
          // ... add other sheet columns here ...
      };
      return columns[sheetName].indexOf(columnName);
  }
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
