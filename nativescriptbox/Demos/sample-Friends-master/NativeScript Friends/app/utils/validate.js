exports.validate = function(value, constraints, errorMessage){
    var result = true;
    
    if(typeof(value) === 'undefined' && value === ""){
        alert("Test" + errorMessage);
        return false;
    }
    
    
    for(var index = 0; index < constraints.length; index++){
        var constraint = constraints[index];
        
        if(typeof(constraint) === 'function'){
            if(!constraint(value)){
                alert(errorMessage);
                result = false;
                break;
            }
        }
    }
    
    return result;
}

exports.minLengthConstraint = function(value){
    return value.length > 2;
}

exports.validEmailConstraint = function(value) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(value);
}