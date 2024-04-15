// let scheme = 'baiduboxapp://v1/easybrowse/open?url=https%3A%2F%2Factivity.baidu.com%2Fincentive%2FincentiveHome%3Fchannel%3Dhuanliang%26productid%3D9%26idfrom%3Dksyqhy%26taskInfo%3D%257B%2522id%2522%253A%2522983%2522%252C%2522type%2522%253A7%252C%2522rule%2522%253A%257B%2522stay%2522%253A1%257D%252C%2522guide%2522%253A%257B%2522uiType%2522%253A-1%257D%252C%2522sdkParams%2522%253A%257B%2522token%2522%253A%2522!(token)%2522%252C%2522outActID%2522%253A%25226%2522%257D%252C%2522outside%2522%253A2%257D&newbrowser=1&forbidautorotate=1&type=immerse&needlog=1&logargs=%7B%22source%22%3A%221028505w%22%2C%22channel%22%3A%221028505z%22%2C%22from%22%3A%22ceug%22%2C%22page%22%3A%22ceug%22%2C%22type%22%3A%22ceug%22%2C%22value%22%3A%22ceug%22%7D&backlocation=1&bannerswitch=1&params=%7B%22showtoolbar%22%3A%221%22%7D&append=1&zoomswitch=0&append_di=1';
// let url = 'https://activity.baidu.com/mbox/4a84ab9a67/matrixInvokePage';

// let ksToken = '真实的快手token';

// // 第一步，快手token编码两次之后替换scheme中的!(token)

// scheme = scheme.replace('!(token)', encodeURIComponent(encodeURIComponent(ksToken)));

// console.log(scheme); // 此时scheme就是直接调起百度的scheme

// // 第二步，将scheme拼接到url中
// url = url + '?scheme' + '=' + encodeURIComponent(scheme);

// console.log(url); // 此时url就是下载中间页url


  
class Math {
    @log
    add(a, b) {
      return a + b;
    }
  }
   
  function log(target, name, descriptor) {
    var oldValue = descriptor.value;
   
    descriptor.value = function() {
      console.log(`Calling ${name} with`, arguments);
      return oldValue.apply(this, arguments);
    };
   
    return descriptor;
  }
   
  const math = new Math();
  // passed parameters should get logged now
  math.add(2, 4);