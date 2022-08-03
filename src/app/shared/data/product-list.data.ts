export const ProductList = Object.freeze([
    {
        "cfn": "CFN1",
        "description": "Product 1",
        "geo": "OEU",
        "size": "3mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN2",
        "description": "Product 2",
        "geo": "OEU",
        "size": "5mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN3",
        "description": "Product 3",
        "geo": "OEU",
        "size": "10mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN4",
        "description": "Product 4",
        "geo": "OEU",
        "size": "13mm",
        "type": "Type2",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN5",
        "description": "Product 5",
        "geo": "OEU",
        "size": "17mm",
        "type": "Type2",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN6",
        "description": "Product 6",
        "geo": "OEU",
        "size": "19mm",
        "type": "Type2",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN7",
        "description": "Product 7",
        "geo": "OEU",
        "size": "23mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN8",
        "description": "Product 8",
        "geo": "OEU",
        "size": "33mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN9",
        "description": "Product 9",
        "geo": "OEU",
        "size": "45mm",
        "type": "Type1",
        "typeName": "Product Family 1",
        "family": "Product Family 1"
    },
    {
        "cfn": "CFN10",
        "description": "Product 10",
        "geo": "EU",
        "size": "50mm",
        "type": "Type2",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    },	
    {
        "cfn": "CFN11",
        "description": "Product 11",
        "geo": "EU",
        "size": "60mm",
        "type": "Type1",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    },
    {
        "cfn": "CFN12",
        "description": "Product 12",
        "geo": "EU",
        "size": "70mm",
        "type": "Type2",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    },
    {
        "cfn": "CFN13",
        "description": "Product 13",
        "geo": "EU",
        "size": "100mm",
        "type": "Type2",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    },	
    {
        "cfn": "CFN14",
        "description": "Product 14",
        "geo": "EU",
        "size": "200mm",
        "type": "Type2",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    },
    {
        "cfn": "CFN15",
        "description": "Product 15",
        "geo": "EU",
        "size": "500mm",
        "type": "Type2",
        "typeName": "Product Family 2",
        "family": "Product Family 2"
    }
])

export const getProductGeographies = () => {
    return Array.from(new Set(ProductList.map(prod => prod.geo)))
}

export const getProductFamilies = () => {
    return Array.from(new Set(ProductList.map(prod => prod.family)))
}

export const getProductTypes = () => {
    return Array.from(new Set(ProductList.map(prod => prod.typeName)))
}

export const getProductSizes = () => {
    return Array.from(new Set(ProductList.map(prod => prod.size)))
}

export const getCfnsFromFamiliesGeo = (arrFam: String[], arrGeo: String[], arrSiz: String[]) => {
    let cfnsF = [], cfnsG = [], cfnsS = [];

    if(!!arrFam) {
        for(let family of arrFam) {
            cfnsF = cfnsF.concat(ProductList.filter(p => family === p.family));
        }
    } else {
        cfnsF = [...ProductList];
    }

    for(let geo of arrGeo) {
        cfnsG = cfnsG.concat(...cfnsF.filter(p => geo === p.geo));
    }

    for(let size of arrSiz) {
        cfnsS = cfnsS.concat(...cfnsG.filter(p => size === p.size));
    }

    return cfnsS.map(prod => prod.cfn);
}

export const getSingleGeoByCfn = (cfn: string) => {
    return ProductList.filter(item => item.cfn === cfn)[0] || null;
}