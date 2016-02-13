$(function() {
	/*function setbg(color) {
		document.getElementById("styled").style.background=color
	}*/

	var isNested = false;
	var isJson = false;
	function CSVToArray(strData, strDelimiter) {
	    // Check to see if the delimiter is defined. If not,
	    // console.log("---->",strData, strDelimiter);
	    // then default to comma.
	    strDelimiter = (strDelimiter || ",");
	    // Create a regular expression to parse the CSV values.
	    var objPattern = new RegExp((
	    // Delimiters.
	    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	    // Quoted fields.
	    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	    // Standard fields.
	    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
	    // Create an array to hold our data. Give the array
	    // a default empty first row.
	    var arrData = [[]];
	    // Create an array to hold our individual pattern
	    // matching groups.
	    var arrMatches = null;
	    // Keep looping over the regular expression matches
	    // until we can no longer find a match.
	    console.log("---->",objPattern.exec(strData));
	    while (arrMatches = objPattern.exec(strData)) {
	        // Get the delimiter that was found.
	        var strMatchedDelimiter = arrMatches[1];
	        console.log('arrMatches',strMatchedDelimiter);
	        // Check to see if the given delimiter has a length
	        // (is not the start of string) and if it matches
	        // field delimiter. If id does not, then we know
	        // that this delimiter is a row delimiter.
	        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
	            // Since we have reached a new row of data,
	            // add an empty row to our data array.
	            arrData.push([]);
	        }
	        // Now that we have our delimiter out of the way,
	        // let's check to see which kind of value we
	        // captured (quoted or unquoted).
	        if (arrMatches[2]) {
	            // We found a quoted value. When we capture
	            // this value, unescape any double quotes.
	            var strMatchedValue = arrMatches[2].replace(
	            new RegExp("\"\"", "g"), "\"");
	        } else {
	            // We found a non-quoted value.
	            var strMatchedValue = arrMatches[3];
	        }
	        // Now that we have our value string, let's add
	        // it to the data array.
	        arrData[arrData.length - 1].push(strMatchedValue);
	    }
	    // Return the parsed data.
	    console.log('arrData',arrData);
	    return (arrData);
	}

	function CSV2JSON(csv) {
	    var array = CSVToArray(csv);
	    var objArray = [];
	    for (var i = 1; i < array.length; i++) {
	        objArray[i - 1] = {};
	        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
	            var key = array[0][k];
	            objArray[i - 1][key] = array[i][k]
	        }
	    }

	    var json = JSON.stringify(objArray);
	    var str = json.replace(/},/g, "},\r\n");

	    return str;
	}
	function inital(){
		console.log("here i am");
	    var data = $("#styled").val();
	    console.log('csv',data);
	    if (!isJson) {
			var data = CSVjs(data);
	    }
	    if(typeof data !== "undefined" && data.length && isNested) {
	    	var data = nested(data);
	    }
	    $("#json").val(data);
	}
	inital();
	$("#styled").bind("change keyup paste", function() {
		inital();
	})
	$("input[name='json']").click(function(){
		console.log("inside",this.value);
		if(this.value == 'nested') {
			isNested = true;
		} else {
			isNested = false;
		}
		inital();
	});

	$("input[name='input']").click(function(){
		console.log("inside",this.value);
		if(this.value == 'csv') {
			isJson = false;
		} else {
			isJson = true;
		}
		inital();
	});

	function CSVjs(strData, strDelimiter) {
		strDelimiter = (strDelimiter || ',');
		var array = [];
		var strAr = strData.split('\n');
		var head = strAr[0].split(',');
		for(var i=1;i<strAr.length;i++) {
			var js = {};
			var taxo = strAr[i].split(",");
			for(var j in taxo) {
				js[head[j]] = taxo[j];
			}
			array.push(js);
		}
		var array = JSON.stringify(array,null,4);
		return array;
	};

	function nested(data) {
		var res = {};
	    var allJSON = JSON.parse(data);
	    for (var i in allJSON) {
	    	// console.log('====>',allJSON[i]);
	        //var loopObjects = Object.keys(allJSON[i]);
	        var taxonomyjs =res;
	        for(var j in allJSON[i]) {
	            var item = allJSON[i][j];
	            if(typeof taxonomyjs[item] === "undefined" && item !== ""){
	                taxonomyjs = taxonomyjs[item] = {};
	            } else {
	                if (Object.keys(taxonomyjs).length>1) {
	                    taxonomyjs = taxonomyjs[item]
	                } else {
	                    taxonomyjs = taxonomyjs[Object.keys(taxonomyjs)]
	                };
	            }

	        };
	    }
    	console.log('responses',res);
    	return JSON.stringify(res, null, 10);
	};
});