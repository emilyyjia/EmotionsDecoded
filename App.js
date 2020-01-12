//This is an example code for the camera//
import React from 'react';
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
import { CameraKitCameraScreen } from 'react-native-camera-kit';
//import CameraKitCameraScreen we are going to use.
import { logo } from './ios/logo.png';

export default class App extends React.Component {
  state = { isPermitted: false, showIntroText: true };
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
  onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages);
    if (event.type === 'left') {
      this.setState({ isPermitted: false });
    } else {
      Alert.alert(
        event.type,
        captureImages,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }
  render() {
    if (this.state.isPermitted) {
      return (
        <CameraKitCameraScreen
          // Buttons to perform action done and cancel
          actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          onBottomButtonPressed={event => this.onBottomButtonPressed(event)}
          flashImages={{
            // Flash button images
            on: require('./assets/flashon.png'),
            off: require('./assets/flashoff.png'),
            auto: require('./assets/flashauto.png'),
          }}
          cameraFlipImage={require('./assets/flip.png')}
          captureButtonImage={require('./assets/capture.png')}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {this.state.showIntroText && <Text style={styles.text2}>Welcome to Emotions Decoded!</Text>}
          {this.state.showIntroText && <Icon name='help' /> }
          {this.state.showIntroText && <Button style={styles.infoText} onPress={() => this.setState({showIntroText: !this.state.showIntroText})} title='Learn more about the app'/> }
          {this.state.showIntroText && <Image style={{width: 250, height: 250, backgroundColor: 'red'}} source={ logo } /> }
          {this.state.showIntroText && <TouchableOpacity
            style={styles.button}
            onPress={this.onPress.bind(this)}>
            <Text style={styles.text}>Capture Face</Text>
          </TouchableOpacity> }
          {!this.state.showIntroText && <Icon name='close' /> }
          {!this.state.showIntroText && <Button style={styles.infoText} onPress={() => this.setState({showIntroText: !this.state.showIntroText})} title='Back to app'/> }
          {!this.state.showIntroText &&  <Text> hi </Text> }
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
  text: {
    color: 'white',
    fontSize: 32,
    backgroundColor: '#f2af58',
    fontFamily: 'Avenir',
  },
  text2: {
    color: 'white',
    fontSize: 25,
    backgroundColor: '#f2af58',
    paddingBottom: 20,
    fontFamily: 'Avenir',
  },
  infoText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Avenir',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
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
});
