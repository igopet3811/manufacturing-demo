export const svgString2Image = (svgString, width, height, f, callback) => {
  const format = f ? f : 'png';
  const imgsrc = 'data:image/svg+xml;base64,' + btoa( unescape( encodeURIComponent( svgString ) ) );
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  const image = new Image();
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob(blob => {
      const filesize = Math.round( blob['length'] / 1024 ) + ' KB';
      if (callback) { 
        callback( blob, filesize );
      }
    });
};

  image.src = imgsrc;
};

export const getSVGString = (svgNode) => {
  svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
  const cssStyleText = getCSSStyles( svgNode );
  appendCSS( cssStyleText, svgNode );

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

  return svgString;
};

const getCSSStyles = (parentElement) => {
    const selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push( '#' + parentElement.id );
    for (let c = 0; c < parentElement.classList.length; c++) {
            if ( !contains('.' + parentElement.classList[c], selectorTextArr) ) {
                selectorTextArr.push( '.' + parentElement.classList[c] );
            }
    }

    // Add Children element Ids and Classes to the list
    const nodes = parentElement.getElementsByTagName('*');
    for (let i = 0; i < nodes.length; i++) {
        const id = nodes[i].id;
        if ( !contains('#' + id, selectorTextArr) ) {
            selectorTextArr.push( '#' + id );
        }

        const classes = nodes[i].classList;
        for (let c = 0; c < classes.length; c++) {
            if ( !contains('.' + classes[c], selectorTextArr) ) {
                selectorTextArr.push( '.' + classes[c] );
        }
            }
    }

    // Extract CSS Rules
    let extractedCSSText = '';
    for (let i = 0; i < document.styleSheets.length; i++) {
        const s = document.styleSheets[i];

        try {
            if (!s['cssRules']) { continue; }
        } catch ( e ) {
                if (e.name !== 'SecurityError') { throw e; } // for Firefox
                continue;
            }

        const cssRules = s['cssRules'];
        for (let r = 0; r < cssRules.length; r++) {
            if ( contains( cssRules[r].selectorText, selectorTextArr ) ) {
                extractedCSSText += cssRules[r].cssText;
            }
        }
    }


    return extractedCSSText;

    function contains(str, arr) {
        return arr.indexOf( str ) === -1 ? false : true;
    }

};

const appendCSS = (cssText, element) => {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.innerHTML = cssText;
    const refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore( styleElement, refNode );
};
