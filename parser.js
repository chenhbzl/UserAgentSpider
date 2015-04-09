var cheerio = require('cheerio');
var fs = require('fs');
var rimraf = require('rimraf');
var path = require('path');
var mkdirp = require('mkdirp');


var $ = cheerio.load(fs.readFileSync('./webpages/all.html'));

var $content = $('#liste');


var outRoot = './result';

var platformMap = {}; //the key is the platform name, e.p. mobile、email、pc web
var platformName, brandName, brandMap, versionName, versionMap, agentList;

rimraf.sync(outRoot);
mkdirp.sync(outRoot);

$content.find('h3').each(function(i, elem) {
	// console.log(elem); return false;

	//meet a new platform
	if (elem.next.name === 'h3') {

		// if has met one before, flush to file
		if (platformName) {
			writePlatformFiles(platformName);
		}

		platformName = $(this).text();

		console.log('meet new platform: ' + platformName);

		if (platformMap[platformName]) {
			console.error('this platform name "' + platformName + '" has been met!');
		}

		brandMap = (platformMap[platformName] = {});

	} else {

		brandName = $(this).text();

		console.log('meet  new  brand: ' + brandName);

		versionMap = (brandMap[brandName] = {});

		//find all version of one brand
		$(this).nextUntil('h3', 'h4').each(function() {

			var $this = $(this);

			versionName = $this.text();
			agentList = (versionMap[versionName] = []);

			//find all the full agent string under this version
			$this.next('ul').find('li').each(function() {
				agentList.push($(this).text());
			});

		})
	}

});

// fs.writeFile(path.join(outRoot, './mata.json'), JSON.stringify(platformMap));
fs.writeFile(path.join(outRoot, 'all.json'), JSON.stringify(platformMap));

function writePlatformFiles(platformName) {
	var dir = path.join(outRoot, platformName);
	mkdirp(dir, function() {
		for (var brandName in platformMap[platformName]) {
			var filename = path.join(dir, brandName + '.json');
			fs.writeFile(filename,
				JSON.stringify(platformMap[platformName][brandName]));
		}
	});
}