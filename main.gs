/*
chatwork Webhook から TO メッセージ情報を受け取る
*/
function doPost(e) {
  // API_TOKEN を設定する
  var api_token = PropertiesService.getScriptProperties().getProperty('CW_API_TOKEN');
  // TO メッセージを集めるチャットルームIDを設定する
  var postRoomId = PropertiesService.getScriptProperties().getProperty('CW_ROOM_ID');

  var json = JSON.parse(e.postData.contents);
  var message = json.webhook_event.body;
  var roomId = json.webhook_event.room_id;
  var fromAccountId = json.webhook_event.from_account_id;
  var messageId = json.webhook_event.message_id;
  var sendTime = json.webhook_event.send_time;

  if (roomId == postRoomId) {
    // 投稿専用チャットルームからのイベントは無視する
    return;
  }

  // 情報を整形して投稿する
  var client = createClient_(api_token);
  client.sendMessage(
    {
      room_id: postRoomId,
      body: Utilities.formatString("[qt][qtmeta aid=%s time=%s]%s[/qt]\nhttps://www.chatwork.com/#!rid%s-%s", fromAccountId, sendTime, message, roomId, messageId),
    }
  );
}

function createClient_(api_token)
{
  return ChatWorkClient.factory(
    {
      'token': api_token,
    }
  );
}