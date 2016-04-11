import json
from pprint import pprint
from getDataHummingBird import getImageLink

episodeLink = {}
customPlot = {}
jsonData = {}

with open('because-moe/bcmoe.json') as data_file:    
    bcmoeJson = json.load(data_file)

for val in bcmoeJson:	
	epLink = val['sites']
	image = getImageLink(val['name'])
	#image = 'null'
	plot  = 'null'
	jsonData[val['name']] = {'episodeLink': epLink, 'customImage': image, 'customPlot': plot}
	
with open('customAnimeData.json', 'w') as outfile:
    json.dump(jsonData, outfile, sort_keys = True, indent = 4)