var CHANNEL_ACCESS_TOKEN = ''; // Channel_access_tokenを登録

function scraping() {
  var url = 'https://nishinonanase.com/s/m04/?ima=4238';
  var response = UrlFetchApp.fetch(url);
  
  var json = response.getContentText();
  
  var link0 = find(json, 'NEWS</div>','</div><div class="list_item">');
  var link = find(link0, '<div class="list_item">','<div class="date">');
  var info = find(link,'<a href="','?ima');
  
  var header = find(link0,'<div class="title">','</div>');
  
  
  var sheet = SpreadsheetApp.getActiveSheet(); 
  var lastRow = sheet.getLastRow();
  var pre_info = sheet.getRange(lastRow,1).getValue();
  
  var post_url = "https://hooks.slack.com/services/"+"必要情報"; //postメソッドのurl
  
  
  if(info != pre_info){
    sheet.getRange(lastRow+1, 1).setValue(info);
  
    var jsondata = {
      "text": header+'\n'+'https://nishinonanase.com'+info,
      "attachments": attachments, //リッチなメッセージを送る用データ
    }
    
    var payload = JSON.stringify(jsondata);
    
    var attachments = JSON.stringify([
      {
        title_link: info,
        text: "上記リンクをクリックすると対象のページやファイルを表示します。" //インデント内に表示されるテキスト
      }
    ]);
    
    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload":payload,
    };
    
    UrlFetchApp.fetch(post_url, options);

  }
  
}

function find(text, from, to) {
  var fromIndex = text.indexOf(from);
  if (fromIndex === -1) return '';
  text = text.substring(fromIndex + from.length);
  var toIndex = text.indexOf(to);
  if (toIndex === -1) return '';
  return text.substring(0, toIndex);
}

