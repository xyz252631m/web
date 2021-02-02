
// let token = 'ee9,666,33dd,719e0-be4,048d,3b2a-189c,a98,47bf,d13';
///github.com.cnpmjs.org
//获取仓库基本信息 https://api.github.com/repos/xyz252631m/web
//获取目录https://api.github.com/repos/xyz252631m/web/contents/{path}
// $.ajax({
//     url: "https://api.github.com/repos/xyz252631m/web/contents/mobile/ling/index.html",
//     method: "get",
//     //在请求前设置请求头 在请求头里面设置设置请求头的信息
//     beforeSend: function (request) {
//         request.setRequestHeader("Authorization", token);
//     },
//     headers: {Accept: 'application/vnd.github.v3+json'},
//     data: {
//         token: 'ee966633dd719e0be4048d3b2a189ca9847bfd13'
//     }
// }).success(function (res) {
//     console.log(res)
// })
// $.ajax({
//     url: "https://api.github.com/repos/xyz252631m/web/contents/al/tem.html",
//     type: "post",
//     //在请求前设置请求头 在请求头里面设置设置请求头的信息
//     beforeSend: function (request) {
//         request.setRequestHeader("Authorization", token);
//     },
//     headers: {
//         'Access-Control-Allow-Headers':"*",
//         Accept: 'application/vnd.github.v3+json',
//         // "X-HTTP-Method-Override": "PUT"
//     },
//     // xhrFields: {
//     //     withCredentials: true
//     // },
//     // crossDomain: true,
//     // contentType: false, //必须
//     // processData: false,
//     data: {
//         message:"test",
//         content: encodeURIComponent("<!DOCTYPE html>\n" +
//             "<html lang=\"en\">\n" +
//             "<head>\n" +
//             "    <meta charset=\"UTF-8\">\n" +
//             "    <title>Title</title>\n" +
//             "    <p>111列表示例，canvas 翻页</p>\n" +
//             "</head>\n" +
//             "<body>\n" +
//             "\n" +
//             "</body>\n" +
//             "</html>")
//     }
// }).success(function (res) {
//     console.log(res)
// })

// await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
//     owner: 'octocat',
//     repo: 'hello-world',
//     path: 'path',
//     message: 'message',
//     content: 'content'
// })