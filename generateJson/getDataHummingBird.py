import sys
import requests
import json

def getImageLink(animeTitle):

	url = 'http://hummingbird.me/api/v1/search/anime?query='+animeTitle
	#data = '{"query":{"bool":{"must":[{"text":{"record.document":"SOME_JOURNAL"}},{"text":{"record.articleTitle":"farmers"}}],"must_not":[],"should":[]}},"from":0,"size":50,"sort":[],"facets":{}}'
	
	response = requests.get(url, timeout=10)

	if(response.ok):
		jsonData = response.json()
		for entry in jsonData:
			if(entry['title'] == animeTitle) or (entry['alternate_title'] == animeTitle ): # == to avoid movie or ova
				animeInfo = entry
				print(animeTitle) # print to see progress on console
				return animeInfo['cover_image']
		
	else:
		return 'null'

	

	