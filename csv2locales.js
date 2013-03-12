// run with node.js
// will load all files from input directory, 
// convert them as csv2json,
// and put results in output directory

function csv2jsonDirectoryConverter(cfg) {
	var path = require('path');
	var fs = require('fs');
	// we should install csv module for node!
	var csv = require('csv');
	// we should install yamljsyamljs module for node!
	var yamljs = require('yamljs');

	var inputFiles = [];
	var resource = {};
	var languages = [];
	var csvDir = cfg.inputCsvDirectory || 'input_csv';
	var jsonDir = cfg.outputJsonDirectory || 'output_json';
	var ymlDir = cfg.outputYmlDirectory || 'output_yml';

	
	function processCsvRecord(recordArr, index) {
		// ignor empty
		if (!recordArr[0]) {
			return;
		}
		
		if (!languages.length) {
			languages = recordArr.slice(1);
			for(var i=0; i<languages.length; i++) {
				if (!resource[languages[i]] || !resource[languages[i]]['translation']){
					resource[languages[i]] = {
						translation : {}
					};
				}
			}
			return;
		}
		
		var keysArr = recordArr[0].split('.');
		var currentValue;
		var prevValue;
		var lastKey;
		for(var i=0; i<languages.length; i++) {
			if (!recordArr[i+1]) {
				continue;
			}
			
			currentValue = resource[languages[i]]['translation'];
			for(var j=0; j<keysArr.length; j++) {
				prevValue = currentValue;
				lastKey = keysArr[j];
				if (! prevValue[lastKey] ) {
					prevValue[lastKey] = {};
				}
				currentValue = prevValue[lastKey];
			}
			
			prevValue[lastKey] = recordArr[i+1];
		}
	}

	function saveFile(dir, fileName, data) {
		fs.writeFile(path.join(dir, fileName), data, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log(fileName+" file was saved!");
			}
		});		
	}

	function saveLanguage(langName, langObj) {
		saveFile(jsonDir, langName+'.json', JSON.stringify(langObj['translation'], null, " "));

		var tmpObj = {};
		tmpObj[langName] = langObj['translation'];
		saveFile(ymlDir, langName+'.yml', '---\n'+yamljs.stringify(tmpObj, 4));
	}
	
	function saveResults() {
		var lang = {};
		for(lang in resource) {
			saveLanguage(lang, resource[lang]);
		}
	}
	
	function processNextFile() {
		var fileName = "";
		if (!inputFiles.length) {
			//console.log(JSON.stringify(resource, null, " "));
			console.log("all converted");
			saveResults();
			return;
		}
		fileName = inputFiles.pop();
		loadFile(path.join(csvDir, fileName));
	}
	
	function loadFile(fileName) {
		// reset languages for each file
		languages = [];
	
		csv()
			.from.stream(fs.createReadStream(fileName))
			.on('record', processCsvRecord)
			.on('end', function(count){
				processNextFile();
			})
			.on('error', function(error){
				console.log(error.message);
			});	
	}	
	
	function processFiles(err, files) {
		if (err) {
			throw err;
		}
		inputFiles = files;
		processNextFile();
	}

	function readDir() {
		fs.readdir(csvDir, processFiles);
	}

	return {
		start: function() {
			if (!csvDir || !jsonDir) {
				console.log("Error: directories not specified");
				return;
			}
			readDir();
		}
	};
}

// start up:
// we should install configure module for node!
var config = require("configure");
var converter = csv2jsonDirectoryConverter(config);
converter.start();
