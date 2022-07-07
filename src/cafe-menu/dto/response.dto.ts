class ResponseDto {
    text: string;
    responseType?: string;
    callbackId: string;
    attachments: Array<any>;
}

export { ResponseDto }

// {
//     "text": "NHN IT News!",
//     "attachments": [
//         {
//             "callbackId": "guide-a1b2c3",
//             "text": "애플은 오늘 오전 2시에 WWDC를 통해 아이폰X 출시를 알렸다.",
//             "title": "아이폰 X 출시",
//             "titleLink": "https://dooray.com/",
//             "authorName": "NHN News",
//             "authorLink": "https://dooray.com/",
//             "imageUrl": "http://it.chosun.com/data/photos/cdn/20180423/2850453_09555838720000.jpg",
//             "thumbUrl": "http://www.kinews.net/news/photo/201804/119143_167793_5622.png",
//         },
//         {
//             "fields": [
//                 {
//                     "title": "출시 예정일",
//                     "value": "2018년 겨울",
//                     "short": true
//                 },
//                 {
//                     "title": "예상 가격",
//                     "value": "125만원",
//                     "short": true
//                 }
//             ]
//         },
//         {
//             "fields": [
//                 {
//                     "title": "설명",
//                     "value": "한국 미출시",
//                 }
//             ]
//         },
//         {
//             "fields": [
//                 {
//                     "title": "IOS",
//                     "value": "High Sierra OS",
//                 }
//             ]
//         },
//         {
//             "actions": [
//                 {
//                     "type": "select",
//                     "text": "채널선택",
//                     "name": "guide-sel",
//                     "dataSource": "channels"
//                 }
//             ]
//         },
//         {
//             "actions": [
//                 {
//                     "type": "button",
//                     "text": "공유하기",
//                     "name": "guide-btn",
//                     "value": "btnValue"
//                 },
//                 {
//                     "type": "button",
//                     "text": "다음 뉴스",
//                     "name": "guide-btn",
//                     "value": "btnValue"
//                 },
//             ]
//         }
//     ]
// }