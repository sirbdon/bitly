// set global variables
var 
  urlArrOut = new Object(),
  doneUrlOut = new Array(),
  urlArrIn = new Array(),
  doneUrlIn = new Array(),
  outLineText = new Array(),
  urlImages = new Object(),
  uploadUrls = new Object(),
  imgCounter = ['[One] ','[Two] ','[Three] '],
  textOut = "",
  inLineText = "",
  donez = 0,
  outLen = 0, 
  accessToken = 'def06aed7b93c3efe2dce5d57c9d3af833931770',
  api = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + accessToken + '&longUrl=',
  expandApi = 'https://api-ssl.bitly.com/v3/expand?access_token=' + accessToken + '&shortUrl=',
  regExUrl = new RegExp(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/, 'gi'),
  imgDfd = new $.Deferred();

$('#upload').click(function(e) {
  e.preventDefault;
  $('#topUrl').trigger('preview');
  var img = $('.selector-wrapper ul.images img')[0].src;
  if ( img ) { upload(img, function(image) { console.log(image) }) }
})


function upload(file, public_id, callback) {
  var dfd = new $.Deferred();

  $.cloudinary.config({ cloud_name: 'derfniizj', api_key: '876798113873355'});

  $.post('https://api.cloudinary.com/v1_1/derfniizj/image/upload', { 
    file: file,
    public_id: public_id,
    upload_preset: 'goa4ecqd',
    tags: ['social-enhance', 'PP']
  })
  .done(function(data) {
    // uploadSuccess ++;
    dfd.resolve({
      id: data.public_id,
      version: data.version,
      format: data.format,
      url: data.url
    });
  })
  .fail(function(data) {
    dfd.reject({
      error: data.responseText,
      errorStatus: data.statusText
    });
    alert('upload failed!')
    console.log(data);
    console.log(data.responseText);
    console.log(data.statusText);
    console.log(data.readyState);
  });

  return dfd.promise();
};

function imgCallback(obj){
  var dfd = new $.Deferred();

  let url = obj.url;
  let images = Array.from(obj.images);
  let key = ia + url.slice(-7); // Bitly URL
  urlImages[key] = [];

  for (i = 0; i < images.length; i++) {
    urlImages[key].push(images[i]);
    if (Object.keys(urlImages).length === images.length) dfd.resolve();
  }
  // imgDfd.resolve(urlImages[key]);
  return dfd.promise();
}


$('#topUrl').preview({
  key: '46c5dd3181b848ab9fdc5deb80f88dfb',
  // bind: false,
  error: function(obj){
    alert('The URL you entered was not processed.');
  },
  success: function(obj){
    // pushImgUrls(obj, callback);
    console.log("success");
    imgCallback();
  }
  // _callback: imgCallback
  // render: render
});

$('#testing').submit(function(e) {
  $(this).addInputs($('#topUrl').data('preview'));
  return true;
})

// Grab all URLs from Input Text and put into Array urlArrIn
function UrlInToArray() {
  var dfd = new $.Deferred();

  donez = inLineText.match(regExUrl) ? inLineText.match(regExUrl).length : null;
  let promise = arrayPush();
  promise.done(function() { dfd.resolve() })

  return dfd.promise();
}

function arrayPush(){
  var dfd = new $.Deferred();
  return dfd.promise();

  var tempArr;
  while ( (tempArr = regExUrl.exec(inLineText) ) !== null ) {
    urlArrIn.push(tempArr[0]);
    console.log(urlArrIn.length)
    console.log(done)
  }
  dfd.resolve();
}

function getBitly() {
  let a = urlArrIn;

  for (i = 0; i < a.length; i++) {
    (function(i){
      let dfd = new $.Deferred;
      $.getJSON(api + encodeURIComponent(a[i]), function(result) {
        if (result.status_code === 200) {
          urlArrOut[i] = result.data.url;
          if (Object.keys(urlArrOut).length === a.length) dfd.resolve();
        } else { 
          throw new Error(result.status_txt);
          dfd.reject();
        }
      });
    })(i);
  }
  return dfd.promise();
}

function getUrlImgs() {
  var dfd = new $.Deferred();
  // return dfd.promise();

  urlArrOut.map(function(url) {
    imgDfd = $.Deferred();
    document.getElementById('topUrl').value = url;
    
    return imgDfd.promise();
  })
  dfd.resolve();
}


function triggerPreview() {
  $('#topUrl').trigger('preview');
}

function uploadTime() {
  var dfd = new $.Deferred();

  $.each(urlImages, function(keyA, urlArr) {
    let public_id = keyA;
    uploadUrls[keyA] = [];

    $.each(urlArr, function(keyB, url) {
      (keyB < 3) ? true : false; 

      upload(url, public_id + '/' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7))
      .done( function(data) {
        uploadUrls[keyA].push(data.url);
        console.log("upload: " + public_id + ' ' + url);
      })
    })
    if (Object.keys(uploadUrls).length === 3) dfd.resolve();
  })

  return dfd.promise();
}

function sendText() {
  var dfd = new $.Deferred();
  console.log("SENDING TEXT");
  var i = 0;
  outLineText.push(inLineText);

  while ( (tempArr2 = regExUrl.exec(inLineText) ) !== null ) {
    var 
      oldy  = tempArr2[0],
      newy  = urlArrOut[i],
      imgy  = urlImages[Object.keys(urlImages)[i]],
      links = '';

      for (k = 0; k < imgy.length; k++) {
        links += ' ['+imgCounter[i]+']('+imgy[k]+') '
      }

    if (typeof newy === 'string') {
      outLineText[i+1] = outLineText[i].replace(oldy, newy);
      outLineText[i+1] += '\nImages: ';
      outLineText[i+1] += links;
    
      console.log(oldy, newy, imgy);
      i ++;
    }
  }
  if ( i === donez ) {
    var outText = outLineText[done].replace(/\s!###!\s/g, '\n');
    $('#output-text').val(outText);
  }
}

startThisShitBru = function() {
  $.when(UrlInToArray()).done(function() { console.log("UrlInToArray") } )
  .done(getBitly).done(function() { console.log("getBitly") } )
  .done(getUrlImgs).then(function() { console.log("getUrlImgs") } )
  .then(uploadTime).then(function() { console.log("uploadTime") } )
  .then(sendText).then(function() { console.log("sendText") } )
  .then(function() {
    console.log("requests completed");
  }).fail(function() {
    console.log("something went wrong!");
  })
}

$(document).ready(function() {

  cloudinary.setCloudName('derfniizj');
  var cloudinary_cors = "http://" + document.referrer + "/cloudinary_cors.html";

  $('#input').submit(function (e){
    e.preventDefault();
    
    inText = $('#input-text').val();
    inLineText = inText.replace(/\r?\n|\r/g, ' !###! ');
    console.log("inLineText getting set 222 ");

    startThisShitBru();
      //   dfd.resolve(inText.replace(/\r?\n|\r/g, ' !###! '));
    // })();
    // .then(startThisShitBru);
  });

}); //END document.ready



