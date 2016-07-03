// set global variables
var 
  urlArrOut = new Object(),
  doneUrlOut = new Array(),
  urlArrIn = new Array(),
  doneUrlIn = new Array(),
  outLineText = new Array(),
  textOut = "",
  inLineText = "",
  donez = 0,
  accessToken = 'def06aed7b93c3efe2dce5d57c9d3af833931770',
  api = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + accessToken + '&longUrl=',
  regExUrl = new RegExp(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/, 'gi');

// Grab all URLs from Input Text and put into Array urlArrIn
function UrlInToArray() {
  return new Promise(function(resolve, reject){
    var tempArr;

    while ( (tempArr = regExUrl.exec(inLineText) ) !== null ) {
      urlArrIn.push(tempArr[0])
      console.log(urlArrIn.length)
      console.log(donez)
    }

    if (urlArrIn.length === donez) { resolve(urlArrIn); }
    if (urlArrIn.indexOf(undefined) > -1) { reject(urlArrIn); }

  })
  console.log("UrlInToArray done")
}

// Follow URLs and remove query at end ******
//
//
// use $.ajax() ??? here??

// Take intial URL's from array, get equivalent Bitly URL's and place in object to force
// proper order (key / value)
function getBitly() {
  return new Promise(function(resolve, reject){
    let a = urlArrIn

    for (i = 0; i < a.length; i++) {
      $.getJSON(api + encodeURIComponent(a[i]), function(result) {
        if (result.status_code === 200) {
          urlArrOut[result.data.long_url] = result.data.url
          if (Object.keys(urlArrOut).length === donez) { resolve(urlArrOut); }

        } else { 
          throw new Error(result.status_txt)
          reject(urlArrOut)
        }
      })
    }
  })
}

// Replace old URL's with new Bitly URL's
function replaceUrls() {
  return new Promise(function(resolve, reject){
    var outLineText = [],
        k = 0;

    outLineText[0] = inLineText

    while ( (tempArr2 = regExUrl.exec(inLineText) ) !== null ) {
      var oldUrl = tempArr2[0]
      var newUrl = urlArrOut[oldUrl]

      outLineText[k+1] = outLineText[k].replace(oldUrl, newUrl)
      console.log(oldUrl, newUrl)
      console.log(outLineText[k])
      k++
    }

    if ( k === donez ) { resolve( outLineText[k] ); }
    if ( k > donez ) { reject( outLineText[k] ); }
  })
}

// Convert text back into line-break format
function formatOutput(oneLineText) {
  return new Promise(function(resolve, reject){
    var formatted = oneLineText.replace(/\s!###!\s/g, '\n');

    resolve(formatted)
  })
}


$(document).ready(function() {

  $('#input').submit(function (e){
    e.preventDefault();
    
    inText = $('#input-text').val();
    inLineText = inText.replace(/\r?\n|\r/g, ' !###! ');
    console.log("inLineText getting set 222 ");
    donez = inLineText.match(regExUrl).length;

    UrlInToArray().then(
      function(urlArrIn) { 
        return getBitly()
    })
    .then(function(urlArrOut) {
      return replaceUrls()
    })
    .then(function(oneLineText){
      return formatOutput(oneLineText)
    })
    .then(function(outText) {
      $('#output-text').val(outText)
      console.log(outText)
    })
    .catch(function(error) {
      throw new Error('Promise Catch Error: ' + error)
    })


  });

}); //END document.ready