//This is an example code for the camera//
import React from 'react';
//import base64 from 'react-native-base64';
import { Buffer } from 'buffer';

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
} from 'react-native';
//import all the basic components we are going to use.
//import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { RNCamera } from 'react-native-camera';
//import CameraKitCameraScreen we are going to use.
 
export default class App extends React.Component {
    state = { isPermitted: false, res: {} };
  constructor(props) {
    super(props);
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
//  onBottomButtonPressed(event) {
//      console.log('Here', event);
//    const captureImages = JSON.stringify(event.captureImages);
//    if (event.type === 'left') {
//      this.setState({ isPermitted: false });
//    } else {
//      console.log('here');
//      Alert.alert(
//        event.type,
//        captureImages,
//        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
//        { cancelable: false }
//      );
//    }
//  }
    
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
            body: buffer,
                                     params: {
                                     'returnFaceId': 'false',
                                     'returnFaceLandmarks': 'false',
                                     'returnFaceAttributes': '{string}'
                                     }
         }).then(response => {
//                 console.log(JSON.stringify(response.status));
                 console.log(response.status);

                 return response.json();
         });
          this.setState({ res: result[0].faceAttributes.emotion });
          console.log(result[0].faceAttributes.emotion);
      } catch(ex){
          console.error(ex);
          Alert.alert(event.type, ex.message);
      }
      
  }
    
  render() {
    if (this.state.isPermitted) {
      return (
              <View style={cameraStyles.container}>
                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  captureAudio={false}
                  style={cameraStyles.preview}
                  type={RNCamera.Constants.Type.front}
                  flashMode={RNCamera.Constants.FlashMode.auto}
                />
              <Text style={styles.temp}>{this.state.res.anger}</Text>
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'white' }}>
                  <TouchableOpacity onPress={this.takePicture.bind(this)} style={cameraStyles.capture}>
                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                  </TouchableOpacity>
                </View>
              </View>
//        <CameraKitCameraScreen
//              style={{
//                flex: 1,
//                backgroundColor: 'blue'
//              }}
//          // Buttons to perform action done and cancel
//          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
//          onBottomButtonPressed={event => this.onBottomButtonPressed(event)}
//          flashImages={{
//            // Flash button images
//            on: require('./assets/flashon.png'),
//            off: require('./assets/flashoff.png'),
//            auto: require('./assets/flashauto.png'),
//          }}
//          cameraFlipImage={require('./assets/flip.png')}
//          captureButtonImage={require('./assets/capture.png')}
//        />
      );
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.onPress.bind(this)}>
            <Text>Open Camera</Text>
          </TouchableOpacity>
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
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  temp: {
  padding: 30,
  backgroundColor: 'red',
  color: 'blue',
  fontSize: 20,
  },

});

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'blue',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
