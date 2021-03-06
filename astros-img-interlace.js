'use strict';

var path    = require('path'),
    fs      = require('fs'),
    images  = require('image-magic');


module.exports = new astro.Middleware({
    fileType: 'img',
    status  : 'release'
}, function(asset, next) {
    var isInterlace = asset.prjCfg.interlace || this.config.interlace;
    if(isInterlace === false || asset.extname == '.gif'){
        next(asset);return;
    }

    let cache = path.join(asset.prjCfg.imgCache, '_interlace');
    if(!fs.existsSync(cache)){
        require('file-plus').createFileSync(cache);
    }
    
    images.interlace(asset.filePath, cache, function(error){

        if(!error){
            fs.readFile(cache, function(error, data){
                if(!error){
                    asset.data = data;
                }else{
                    console.error('astros-img-interlace', 
                        'readfile error', 'file:', asset.filePath);
                }
                next(asset);
            });
            return;
        }
        next(asset);

    });

});