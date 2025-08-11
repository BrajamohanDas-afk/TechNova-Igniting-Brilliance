import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {usePermissions} from '../hooks/usePermissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CameraScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  
  const {hasPermission, requestPermission} = usePermissions();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const capturePhoto = async () => {
    try {
      if (camera.current) {
        setIsLoading(true);
        const photo = await camera.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: flashMode,
        });

        // Navigate to detection result with photo
        navigation.navigate('DetectionResult', {
          photoUri: photo.path,
          location: await getCurrentLocation(),
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      console.error('Photo capture error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve) => {
      // Mock location for demo - replace with actual geolocation
      resolve({
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India',
      });
    });
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off');
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-alt" size={64} color="#ccc" />
        <Text style={styles.permissionText}>Camera Permission Required</Text>
        <Text style={styles.permissionSubtext}>
          Please grant camera permission to capture billboard photos
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Camera Overlay */}
      <View style={styles.overlay}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}>
            <Icon 
              name={flashMode === 'on' ? 'flash-on' : 'flash-off'} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        {/* Detection Guide */}
        <View style={styles.guideContainer}>
          <View style={styles.detectionFrame} />
          <Text style={styles.guideText}>
            Position the billboard within the frame
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
              onPress={capturePhoto}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Detection Tips:</Text>
          <Text style={styles.instructionsText}>
            • Ensure the billboard is clearly visible{'\n'}
            • Capture the entire billboard structure{'\n'}
            • Take photo in good lighting{'\n'}
            • Include surrounding context for location verification
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectionFrame: {
    width: 280,
    height: 200,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  guideText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 16,
  },
  instructionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default CameraScreen;
