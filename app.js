import React, { useEffect, useState } from 'react';
import { Dimensions, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {

  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const [recordingDetails, setRecordingDetails] = useState({ recordSecs: 0, recordTime: '00:00:00' })

  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]);
        if (grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else setHasPermission(false);
      } catch (err) {
        console.warn(err);
        setHasPermission(false);
      }
    }
  }

  useEffect(() => {
    getPermissions();
  }, [])

  const startRecording = async () => {
    setRecording(!isRecording)
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordingDetails({ recordSecs: e.currentPosition, recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)) });
      console.log(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
    });
    console.log(result, recordingDetails, 'start')
  }

  const stopRecording = async () => {
    setRecording(!isRecording);
    audioRecorderPlayer.removeRecordBackListener();
    const result = await audioRecorderPlayer.stopRecorder();
    setRecordingDetails({ recordSecs: 0,recordTime: '00:00:00' });
    console.log(result, recordingDetails, 'stop')
  }

  return (
    <View style={{ flex: 1, justifyContent:'center',alignItems:'center' }}>
      <Text>{recordingDetails.recordTime}</Text>
      <View style={styles.container}>
        {hasPermission ? <TouchableOpacity activeOpacity={1} style={styles.recordButton} onPress={() => isRecording ? stopRecording() : startRecording()}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{isRecording ? 'Stop' : 'Record'}</Text>
        </TouchableOpacity> : <Text>No Permission</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { position: 'absolute', flex:1, paddingVertical: 10, width: Dimensions.get('window').width, alignItems:'center', bottom: 0 },
  recordButton: { width: 150, paddingVertical: 10, alignItems: 'center', backgroundColor: 'red', borderRadius: 6 }
})

export default App;