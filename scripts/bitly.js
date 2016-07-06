// set global variables
var 
  urlArrOut = new Object(),
  bitArrOut = new Object(),
  doneUrlOut = new Array(),
  urlArrIn = new Array(),
  doneUrlIn = new Array(),
  outLineText = new Array(),
  textOut = "",
  inLineText = "",
  donez = 0,
  accessToken = 'def06aed7b93c3efe2dce5d57c9d3af833931770',
  api = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + accessToken + '&longUrl=',
  regExUrl = new RegExp(/(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/, 'gi'),
  regExRef = new RegExp(/(\?ref=[a-z]*)*(\#[a-z\.]*)*/, 'gi');

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

function finalUrls() {
  return new Promise(function(resolve, reject){
    let a = urlArrIn

    for (i = 0; i < a.length; i++) {
      $.post('redirect.php', { reUrl: urlArrIn[i] }, null, 'json')
        .done(function(data) {
          urlArrOut[data.firstUrl] = data.finalUrl
          if (Object.keys(urlArrOut).length === donez) { resolve(urlArrOut); }
        })
        .fail(function(data) {
          reject(data)
        })
    }
  })
}

function removeUrlRef() {
  return new Promise(function(resolve, reject){
    let obj = urlArrOut
    let inc = 0;

    for (let val in obj) {
      if ( obj.hasOwnProperty(val) ) {
        let newVal = obj[val].replace(regExRef, '')
        urlArrOut[val] = newVal
        inc++
      }
      if (inc === donez) { resolve(urlArrOut); } // NO ERROR HANDLED
    }
  })
}

// Take intial URL's from array, get equivalent Bitly URL's and place in object to force
// proper order (key / value)
function getBitly() {
  return new Promise(function(resolve, reject){
    let obj = urlArrOut

    for (let val in obj) {
      $.getJSON(api + encodeURIComponent(obj[val]), function(result) {
        if (result.status_code === 200) {
          bitArrOut[val] = result.data.url
          if (Object.keys(bitArrOut).length === donez) { resolve(bitArrOut); }
        } else { 
          throw new Error(result.status_txt)
          reject(bitArrOut)
        }
      })
    }
  })
}

// Replace old URL's with new Bitly URL's
function replaceUrls() {
  return new Promise(function(resolve, reject){
    var outLineText = [], // Set OUT text, that will be in single LINE format, to array
        k = 0; // counter

    outLineText[0] = inLineText // We need to Array.replace one URL at a time, so we'll need to use output of the replace as input for next replace

    while ( (tempArr2 = regExUrl.exec(inLineText) ) !== null ) {
      var oldUrl = tempArr2[0]
      var newUrl = bitArrOut[oldUrl] // Make sure right old URL is being replaced! (order matters)

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
    var formatted = oneLineText.replace(/\s!###!\s\s!###!\s/g, '\r\n');

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

    // Start it up, use promises
    UrlInToArray()
    .then(function(urlArrIn) {
        return finalUrls()
    })
    .then(function(urlArrOut) {
        return removeUrlRef()
    })
    .then(function(urlArrOut) { 
      return getBitly()
    })
    .then(function(bitArrOut) {
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