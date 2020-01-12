//This is an example code for the camera//
import React from 'react';
//import base64 from 'react-native-base64';
import { Buffer } from 'buffer';
import Tts from 'react-native-tts';
const API_URL = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=emotion';
const API_KEY = '';

//import react in our code.
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import { Icon } from 'react-native-elements';
//import all the basic components we are going to use.
//import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { RNCamera } from 'react-native-camera';
//import CameraKitCameraScreen we are going to use.
const logo = require('./ios/logo.png');

export default class App extends React.Component {
    state = { isPermitted: false, res: {}, showIntroText: true, tookPic: false, maxEmotion: '', maxEmotionNumber: 0};
  constructor(props) {
    super(props);
      Tts.addEventListener("tts-start", event =>      this.setState({ ttsStatus: "started" })    );
      Tts.addEventListener("tts-finish", event =>      this.setState({ ttsStatus: "finished" })    );
      Tts.addEventListener("tts-cancel", event =>      this.setState({ ttsStatus: "cancelled" })    );
      Tts.setIgnoreSilentSwitch("ignore");
  }
  onPress() {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'CameraExample App Camera Permission',
              message: 'CameraExample App needs access to your camera ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            //Calling the WRITE_EXTERNAL_STORAGE permission function
            requestExternalWritePermission();
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      async function requestExternalWritePermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'CameraExample App External Storage Write Permission',
              message:
                'CameraExample App needs access to Storage data in your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If WRITE_EXTERNAL_STORAGE Permission is granted
            //Calling the READ_EXTERNAL_STORAGE permission function
            requestExternalReadPermission();
          } else {
            alert('WRITE_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Write permission err', err);
          console.warn(err);
        }
      }
      async function requestExternalReadPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'CameraExample App Read Storage Read Permission',
              message: 'CameraExample App needs access to your SD Card ',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If READ_EXTERNAL_STORAGE Permission is granted
            //changing the state to re-render and open the camera
            //in place of activity indicator
            that.setState({ isPermitted: true });
          } else {
            alert('READ_EXTERNAL_STORAGE permission denied');
          }
        } catch (err) {
          alert('Read permission err', err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      this.setState({ isPermitted: true });
    }
  }
    
  async takePicture(event) {
      event.persist();
      if(!this.camera) {
          Alert.alert(event.type, "No camera",        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false });
          return;
      }
      
      try {
            
          const options = { quality: 0.5, base64: true, doNotSave: true };
          const data = await this.camera.takePictureAsync(options);
          
          const buffer = Buffer.from(data.base64, 'base64');

          const result = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': API_KEY,
              'Content-Type': 'application/octet-stream'
            },
            body: buffer
         }).then(response => {
            console.log(response.status);
            return response.json();
         });
          result && result[0] && this.setState({ res: result[0].faceAttributes.emotion });
          this.setState( { tookPic: true });
          console.log(this.state.tookPic);
          console.log(result && result[0] && result[0].faceAttributes.emotion);
          
          
          Object.keys(result[0].faceAttributes.emotion).forEach((key) =>
            {
            if (this.state && (result[0].faceAttributes.emotion[key] > this.state.maxEmotionNumber)) {
                                                                this.setState({maxEmotion: key });
                                                                this.setState({maxEmotionNumber : result[0].faceAttributes.emotion[key]});
                            }
            });
      } catch(ex){
          console.error(ex);
          Alert.alert(event.type, ex.message);
      }
      
      Tts.getInitStatus().then(() => {
        Tts.speak('The most likely emotion they are feeling is:' + this.state.maxEmotion);
      });
      Tts.stop();
            
      
  }
    
      
  render() {
    if (this.state.tookPic) {
        return (
            <View style={styles.container}>
              <View style={{height: 50, width: '100%', flexDirection: 'row'}}>
                <Button
                    style={styles.homeButton}
                    onPress={() => this.setState({tookPic: false, isPermitted: false, maxEmotion: '', maxEmotionNumber: 0})}
                    title='Home'/>
                </View>
              
              <View style={{width: '100%', alignItems: 'center' }}>
                <Text style={styles.large}>The most likely emotion they are feeling is: {this.state.maxEmotion}.</Text>
                  <Text style={styles.temp}>Anger: {this.state.res.anger}</Text>
                  <Text style={styles.temp}>Contempt: {this.state.res.contempt}</Text>
                  <Text style={styles.temp}>Disgust: {this.state.res.disgust}</Text>
                  <Text style={styles.temp}>Fear: {this.state.res.fear}</Text>
                  <Text style={styles.temp}>Happiness: {this.state.res.happiness}</Text>
                  <Text style={styles.temp}>Neutral: {this.state.res.neutral}</Text>
                  <Text style={styles.temp}>Sadness: {this.state.res.sadness}</Text>
                  <Text style={styles.temp}>Surprise: {this.state.res.surprise}</Text>
              </View>
              
              </View>
              );
    } else if (this.state.isPermitted) {
      return (
              <View style={cameraStyles.container}>
                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  captureAudio={false}
                  style={cameraStyles.preview}
                  type={RNCamera.Constants.Type.front}
                  flashMode={RNCamera.Constants.FlashMode.on}
                />
              <Text style={styles.temp}>{this.state.res.anger}</Text>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'white' }}>
                  <TouchableOpacity onPress={this.takePicture.bind(this)} style={cameraStyles.capture}>
                    <Text style={styles.snapButton}> SNAP </Text>
                  </TouchableOpacity>
                </View>
              </View>
      );
    } else if (!this.state.tookPic) {
      return (
        <View style={styles.container}>
          {this.state.showIntroText && <Text style={styles.text2}>Welcome to Emotions Decoded!</Text>}
              
          <View style={styles.subtitleContainer}>
              {this.state.showIntroText &&
                <TouchableOpacity
                    style={styles.infoTextButton}
                    onPress={() => this.setState({showIntroText: !this.state.showIntroText})}>
                    {this.state.showIntroText && <Icon name='help' /> }
                    <Text style={styles.infoText}> Learn more about the app </Text>
                </TouchableOpacity>
              }
          </View>
              
          {this.state.showIntroText && <Image style={{width: 350, height: 350 }} source={ logo } /> }
          {this.state.showIntroText && <TouchableOpacity
            style={styles.button}
            onPress={this.onPress.bind(this)}>
            <Text style={styles.text}>Capture Face</Text>
          </TouchableOpacity> }
          {!this.state.showIntroText && <TouchableOpacity
            // style={styles.backButton}
            onPress={() => this.setState({showIntroText: !this.state.showIntroText, isPermitted: false})}>
            {!this.state.showIntroText && <Icon style={{ color: 'white' }} name='undo' /> }
            <View style={{height: 50, width: '100%', flexDirection: 'row'}}>
            <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}>Welcome! I'm Ed and I will be helping you detect emotions on faces! </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}>  </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}> Step 1: Click 'Capture Face' </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}> Step 2: Take Snap! </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}> Step 3: View Results </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}> </Text> }
          {!this.state.showIntroText &&  <Text style={styles.helpText}>You will see a list of emotions and their likelihood. The highest one is the emotion the person is most likely experiencing! </Text> }

        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2af58',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 32,
    backgroundColor: '#f2af58',
    fontFamily: 'Avenir',
  },
  iconStyle: {
    color: 'white',
  },
  backButtonText: {
    color: 'black',
    fontSize: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text2: {
    color: 'white',
    fontSize: 25,
    backgroundColor: '#f2af58',
    paddingBottom: 20,
    fontFamily: 'Avenir',
  },
  infoTextButton: {
    fontSize: 15,
    fontFamily: 'Avenir',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
 infoText: {
   color: 'white',
 },
  button: {
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 20,
    padding: 10,
    width: 250,
    marginTop: 16,
  },
  backButton: {
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
  },
  temp: {
      padding: 30,
      color: 'white',
      fontSize: 20,
  },
  homeButton: {
    color: 'red',
  },
                                 large: {
                                   fontSize: 30,
                                   color: 'grey',
                                 },
  snapButton: {
    fontSize: 50,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 4,
 },
 helpText: {
   color: 'white',
   fontSize: 30, 
   fontFamily: 'Avenir',
   padding: 10,
 }
});

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
//    borderRadius: 5,
    paddingBottom: 65,
    paddingHorizontal: 20,
    alignSelf: 'center',
//    margin: 20,
  },
});
