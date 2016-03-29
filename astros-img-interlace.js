'use strict';

var path    = require('path'),
    fs      = require('fs'),
    images  = require('image-magic');


module.exports = new astro.Middleware({
    fileType: 'img',
    status  : 'release'
}, function(asset, next) {
    var isInterlace = asset.prjCfg.interlace || this.config.interlace;
    if(isInterlace){
        next(asset);return;
    }

    let cache = path.join(asset.prjCfg.imgCache, '_interlace');
    
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