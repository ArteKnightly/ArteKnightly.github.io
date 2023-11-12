//// Google Script Functions for Spreadsheet operations
//function doPost(e) {
//    var ss = SpreadsheetApp.getActiveSpreadsheet();
//    var sheetName = e.parameter.sheetName;
//    var sheet = ss.getSheetByName(sheetName);
  
//    if (!sheet) {
//      return ContentService.createTextOutput("Error: Sheet name not found.");
//    }
  
//    var rowData = [];
      
//    var data = sheet.getDataRange().getValues();
//    var jsonData = [];
  
//    for (var i = 1; i < data.length; i++) {
//      var row = data[i];
//      var obj = {};
  
//      switch (sheetName) {
//        case 'ImageManifest':
//          obj = {
//            UUIDImage: row[0],
//            ImageName: row[1],
//            createdBy: row[2],
//            creationDate: row[3],
//            addedDate: row[4]
//          };
//          break;
//        case 'ImageRatings':
//          obj = {
//            UUIDImage: row[0],
//            UUIDQuestion: row[1],
//            Score: row[2]
//          };
//          break;
//        case 'CritiqueQuestions':
//          obj = {
//            UUIDQuestion: row[0],
//            stringQuestion: row[1],
//            questionRating: row[2],
//            avgReturnRating: row[3],
//            numOfNA: row[4],
//            isObsolete: row[5],
//            totalOccurancesToDate: row[6],
//            answerType: row[7]
//          };
//          break;
//        case 'Attendance':
//          obj = {
//            UUIDKnight: row[0],
//            date: row[1],
//            confirmed: row[2]
//          };
//          break;
//        default:
//          return ContentService.createTextOutput("Error: Invalid sheet name.").setMimeType(ContentService.MimeType.TEXT);
//      }
  
//      jsonData.push(obj);
//    }
       
//   sheet.appendRow(rowData);
//        return ContentService.createTextOutput("Data saved to sheet: " + sheetName);
//    return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
//  }
  
//  function doDelete(e) {
//      var ss = SpreadsheetApp.getActiveSpreadsheet();
//      var sheetName = e.parameter.sheetName;
//      var sheet = ss.getSheetByName(sheetName);
      
//      if (!sheet) {
//          return ContentService.createTextOutput("Error: Sheet name not found.");
//      }
      
//      var range = sheet.getDataRange();
//      var values = range.getValues();
      
//      for (var i = 0; i < values.length; i++) {
//          if (values[i][0] == e.parameter.UUID) {
//              sheet.deleteRow(i + 1);
//              return ContentService.createTextOutput("Data deleted from sheet: " + sheetName);
//          }
//      }
//      return ContentService.createTextOutput("UUID not found.");
//  }
  
//  function doUpdate(e) {
//      var ss = SpreadsheetApp.getActiveSpreadsheet();
//      var sheetName = e.parameter.sheetName;
//      var sheet = ss.getSheetByName(sheetName);
      
//      if (!sheet) {
//          return ContentService.createTextOutput("Error: Sheet name not found.");
//      }
      
//      var range = sheet.getDataRange();
//      var values = range.getValues();
      
//      for (var i = 0; i < values.length; i++) {
//          if (values[i][0] == e.parameter.UUID) {
//              for (var key in e.parameter) {
//                  if (key != "UUID" && key != "sheetName") {
//                      var colIndex = getColumnIndex(sheetName, key);
//                      if (colIndex !== -1) {
//                          values[i][colIndex] = e.parameter[key];
//                      }
//                  }
//              }
//              range.setValues(values);
//              return ContentService.createTextOutput("Data updated in sheet: " + sheetName);
//          }
//      }
//      return ContentService.createTextOutput("UUID not found.");
//  }
  
//  function getColumnIndex(sheetName, columnName) {
//      var columns = {
//          'ImageManifest': ['UUIDImage', 'ImageName', 'createdBy', 'creationDate', 'addedDate'],
//          // ... add other sheet columns here ...
//      };
//      return columns[sheetName].indexOf(columnName);
//  }
  
//// Base Table Class
//class BaseTable {
//    constructor(sheetName) {
//        this.sheetName = sheetName;
//        this.endpoint = 'https://script.google.com/macros/s/AKfycbxxa8RURp4aoztTa7_rocl2bN0WMESd9cFOvOnXH9c2F6PfN0T21xK0HDCXs4WKZoVcfg/exec'; // Replace with your script's URL
//    }

//    async httpDo(url, method, data) {
//        let options = {
//            method: method,
//            headers: {
//                'Content-Type': 'application/x-www-form-urlencoded',
//            },
//        };

//        if (data) {
//            options.body = new URLSearchParams(data).toString();
//        }

//        const response = await fetch(url, options);
//        const text = await response.text();
//        console.log(text);
//        return text;
//    }

//    async read() {
//        return await this.httpDo(`${this.endpoint}?sheetName=${this.sheetName}`, 'GET', null);
//    }

//    async write(dataObj) {
//        dataObj.sheetName = this.sheetName; // Add sheetName to the data object
//        return await this.httpDo(this.endpoint, 'POST', dataObj);
//    }
//}

//// Specific Table Class for ImageManifest
//class ImageManifestTable extends BaseTable {
//    constructor() {
//        super('ImageManifest');
//    }

//    async write(UUIDImage, ImageName, createdBy, creationDate, addedDate) {
//        const data = {
//            UUIDImage,
//            ImageName,
//            createdBy,
//            creationDate,
//            addedDate
//        };
//        return await super.write(data);
//    }
//}

//// Specific Table Class for ImageRatings
//class ImageRatingsTable extends BaseTable {
//    constructor() {
//        super('ImageRatings');
//    }

//    async write(UUIDImage, UUIDQuestion, Score) {
//        const data = {
//            UUIDImage,
//            UUIDQuestion,
//            Score
//        };
//        return await super.write(data);
//    }
//}

//// Specific Table Class for CritiqueQuestions
//class CritiqueQuestionsTable extends BaseTable {
//    constructor() {
//        super('CritiqueQuestions');
//    }

//    async write(UUIDQuestion, stringQuestion, questionRating, avgReturnRating, numOfNA, isObsolete, totalOccurancesToDate, answerType) {
//        const data = {
//            UUIDQuestion,
//            stringQuestion,
//            questionRating,
//            avgReturnRating,
//            numOfNA,
//            isObsolete,
//            totalOccurancesToDate,
//            answerType
//        };
//        return await super.write(data);
//    }
//}

//// Specific Table Class for Attendance
//class AttendanceTable extends BaseTable {
//    constructor() {
//        super('Attendance');
//    }

//    async write(UUIDKnight, date, confirmed) {
//        const data = {
//            UUIDKnight,
//            date,
//            confirmed
//        };
//        return await super.write(data);
//    }
//}

//// Usage
//// You can create instances of these table classes and use their methods.
//const imageManifest = new ImageManifestTable();
//const imageRatings = new ImageRatingsTable();
//const critiqueQuestions = new CritiqueQuestionsTable();
//const attendance = new AttendanceTable();

//// Example: Writing data to the ImageManifest table
//// imageManifest.write('some_uuid', 'sample_image', 'creator_name', '2023-10-28', '2023-10-28');