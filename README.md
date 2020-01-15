# EmotionsDecoded

## Inspiration
The estimated rate of Autism Spectrum Disorder among 5-17 year olds in Canada is 1 in 66. One challenge individuals on the Autism Spectrum face is difficulty detecting emotions on peoples faces. We wanted to build a learning tool that will aid in mapping faces to emotions, in real-time and leveraging intelligent facial recognition technology.

(https://autismcanada.org/about-autism/)

## What it does
The mobile app opens your phone camera and allows you to take a photo. After taking a photo, it redirects you to another page which shows you the most likely emotion it has detected on the face captured, as well as the probability of other emotions. It also uses text-to-speech to read out loud the most likely emotion, so that individuals who are not able to read still can use it.

## How we built it
We used Microsoft's Azure Cognitive Service, specifically, its Face API to detect emotions on images. We used the React Native framework to build our mobile application and tie together the User Interface, camera activity, text-to-speech, and Azure's Face API. We also took accessibility into account by creating large, easily visible buttons and text, and text-to-speech.

## Challenges we ran into
None of our team members had developed a mobile app, so there was a learning curve in getting ramped up with the required software. Updating our operating system and installing Xcode took a lot of time. We also struggled at the beginning integrating the camera into the app. We were able to overcome this hurdle and learn more through the help of a mentor.

## Accomplishments that we're proud of
We are proud that we completed a functional app and we are able to demo it to people. We are also proud that we were able to bring to fruition our initial vision of creating a accessible learning tool for people on the Autism Spectrum, especially kids.

## What we learned
We learned that you don't need to be an expert in AI or Machine Learning in order to build intelligent applications that use these latest technologies. We also learned how to quickly develop mobile applications in React Native.

## What's next for Emotions Decoded
We will be publishing the application to the App Store, and we want to also release an Android version of the app. We also want to extend the functionality. For instance, using AI or Machine Learning to suggest an appropriate next action after detecting the emotion.
