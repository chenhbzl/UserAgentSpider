var request = require('request');
var fs = require('fs');


var counter = 1;

function downloadFromUrl (srcUrl, targetFilePath) {
	var taskName = 'task' + (counter++);
	
	console.log(taskName + ': create task ' + taskName + 
		' write to ' + targetFilePath + ' from ' + srcUrl);

	request(srcUrl)
		.on('end', function () {
			console.log(taskName + ': finish!');
		})
	.pipe(

		fs.createWriteStream(targetFile)
		.on('finish', function () {
			console.log(taskName + ': finsh writing');
		})
		.on('drain', function () {
			console.log(taskName + ': writing');
		})
		.on('pipe', function () {
			console.log(taskName + ': begin write');
		})
		.on('error', function () {
			console.log(taskName + ': writing error');
		})
	);
}

var srcHtmlUrl = 'http://www.useragentstring.com/pages/All/';
var targetFile = './webpages/all.html';

downloadFromUrl(srcHtmlUrl, targetFile);