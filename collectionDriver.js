var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

//find all objects for a collection
CollectionDriver.prototype.findAll = function(collectionName, condition, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        the_collection.find(condition).toArray(function(error, results) { //B
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
//count all objects for a collection
CollectionDriver.prototype.count = function(collectionName, condition, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            the_collection.find(condition).count(function(error, results) { //B
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};
//find all objects with limit offset for a collection
CollectionDriver.prototype.findAllWithLimitOffset = function(collectionName, condition,limitSkip, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if( error ) callback(error)
        else {
            the_collection.find(condition).limit( limitSkip.limit ).sort( { created_at: -1 }).toArray(function(error, results) { //B
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

//find a specific object
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        obj.created_at = new Date(); //B
        the_collection.insert(obj, function() { //C
          callback(null, obj);
        });
      }
    });
};

//update a specific object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
	        obj._id = ObjectID(entityId); //A convert to a real obj id
	        obj.updated_at = new Date(); //B
            the_collection.save(obj, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}

//update a specific object
CollectionDriver.prototype.updateAll = function(collectionName, condition, newvalue, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            the_collection.update(condition, newvalue, {multi:true},function(error,doc) { //C
              if (error) callback(error)
              else callback(null, doc);
            });
        }
    });
}

//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error)
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//delete a specific object
CollectionDriver.prototype.deleteAll = function(collectionName, condition, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error)
        else {
            the_collection.remove(condition, function(error,doc) { //B
              if (error) callback(error)
              else callback(null, doc);
            });
        }
    });
}
exports.CollectionDriver = CollectionDriver;