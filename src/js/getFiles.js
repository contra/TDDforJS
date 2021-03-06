/**
 *
 * @param {string} base
 * @param {Array.<string>} patternStrings
 * @param {number} maxRecursion
 * @param {number=} timesCalled <b>Note: Internal only.</b>
 * @param {Array.<RegExp>=} patterns <b>Note: Internal only.</b>
 * @returns {Array.<string>}
 */
function getFiles(base, patternStrings, maxRecursion, timesCalled, patterns){
   /** @type {Array}*/
   var called = (++timesCalled || 0);
   /** @type {Array}*/
   var filesToReturn = [];
   if(!base){
      return filesToReturn;
   }
   if(called > maxRecursion){
      throw (
         "getFiles - It looks like there's a circular link somewhere in: "+base
      );
   }
   if(!patterns){
      patterns = [];
      patternStrings.forEach(function(v){
         patterns.push(new RegExp(v));
      });
   }

   fs.readdirSync(base).forEach(function(v){
      var file = path.resolve(base, v);
      var stats = fs.statSync(file);
      var moreFiles;
      var i;
      if(stats.isDirectory()){
         moreFiles=getFiles(
            file,
            patternStrings,
            maxRecursion,
            called,
            patterns
         );
         filesToReturn = filesToReturn.concat(moreFiles);
      } else {
         if(!patterns.length){
            filesToReturn.push(file);
         } else {
            for(i=0;i<patterns.length;i++){
               if(patterns[i].test(file)){
                  filesToReturn.push(file);
                  break;
               }
            }
         }
      }
   });

   return filesToReturn;
}