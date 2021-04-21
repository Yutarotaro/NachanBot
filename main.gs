var CHANNEL_ACCESS_TOKEN = ''; // Channel_access_tokenを登録

function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken= event.replyToken;

    if (typeof replyToken === 'undefined') {
    return; // エラー処理
  }
  var userId = event.source.userId;
  var nickname = getUserProfile(userId);

  if(event.type == 'follow') { 
    
    // ユーザーにbotがフォローされた場合に起きる処理
  }

  if(event.type == 'message') {
    var userMessage = event.message.text;
    // 今回は鸚鵡返しなので届いたメッセージをそのまま返します。
    var replyMessage = userMessage 

    // もし届いたユーザーからのメッセージによって他にやりたい処理
    // (ex: spread sheetへの記入など)がある場合は、ここに入れて下さい。

    var url = 'https://api.line.me/v2/bot/message/reply';
    
    var sheet = SpreadsheetApp.getActiveSheet(); 
    var lastRow = sheet.getLastRow();
    

    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': sheet.getRange(lastRow,1).getValue(),
        }],
      }),
    });
    return ContentService.createTextOutput(
      JSON.stringify({'content': 'post ok'})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

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

