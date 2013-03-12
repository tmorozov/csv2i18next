Script csv2locales.js.js will convert CSV files to JSON resources for i18next library.

Requres: 
1) node.js
2) input files should be CSV in UTF-8 format
	see examples in input_csv directory
3) csv modeule for node.js
	Use for installation: 
	npm install csv
4) yamljs modeule for node.js
	Use for installation: 
	npm install yamljs
4) configure modeule for node.js
	Use for installation: 
	npm install configure


Configuration file:
It defines input and output directories
See example config.json

Running:
node csv2locales.js [--config <config file>]
If the --config switch is not included as a command line parameter, "config.json" in the current working directory will be used

Example:
node csv2locales.js --config config.json 




