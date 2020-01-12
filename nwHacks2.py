import requests
import json
import csv 
#import speech 

# set to your own subscription key value
subscription_key = '172668a7e96a495ab1f38ca5c57bceb4'
assert subscription_key

# replace <My Endpoint String> with the string from your endpoint URL
face_api_url = ' https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'

image_url = 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'

headers = {'Ocp-Apim-Subscription-Key': subscription_key}

params = {
    'returnFaceId': 'false',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'smile,emotion',
}

response = requests.post(face_api_url, params=params,
                         headers=headers, json={"url": image_url})
#print(json.dumps(response.json(),indent=1))

with open('attributes.json', 'w') as json_file:
    json.dump(response.json(), json_file,indent=4)

emotions=[ 'anger', 'contempt', 'fear', 'disgust', 'happiness','neutral', 'sadness', 'surprise']
with open('attributes.json') as json_file:
    data = json.load(json_file)
    print("smile :",data[0].get('faceAttributes').get('smile'))
    for i in emotions:
        print(i,":",data[0].get('faceAttributes').get('emotion').get(i)*100)
        #speech.say('Hi','en_EN')
    speech_data=data[0].get('faceAttributes').get('emotion')
#speech.say('Hi','en_EN')