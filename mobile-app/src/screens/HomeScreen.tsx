import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {Header, Card, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [stats, setStats] = useState({
    totalReports: 247,
    resolved: 189,
    pending: 58,
    userPoints: 1250,
  });

  const quickActions = [
    {
      id: 1,
      title: 'Quick Report',
      subtitle: 'Capture & Report',
      icon: 'camera-alt',
      color: '#FF5722',
      action: () => navigation.navigate('Camera'),
    },
    {
      id: 2,
      title: 'View Reports',
      subtitle: 'Your submissions',
      icon: 'assignment',
      color: '#4CAF50',
      action: () => navigation.navigate('Reports'),
    },
    {
      id: 3,
      title: 'Billboard Map',
      subtitle: 'City overview',
      icon: 'map',
      color: '#2196F3',
      action: () => navigation.navigate('Map'),
    },
    {
      id: 4,
      title: 'Leaderboard',
      subtitle: 'Top reporters',
      icon: 'leaderboard',
      color: '#9C27B0',
      action: () => Alert.alert('Coming Soon', 'Leaderboard feature will be available soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{
          text: 'Billboard Detector',
          style: {color: '#fff', fontSize: 20, fontWeight: 'bold'},
        }}
        rightComponent={{
          icon: 'notifications',
          color: '#fff',
          onPress: () => Alert.alert('Notifications', 'No new notifications'),
        }}
        backgroundColor="#2196F3"
      />
      
      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <Card containerStyle={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Help make our city safer by reporting unauthorized billboards
          </Text>
        </Card>

        {/* Stats Section */}
        <Card containerStyle={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalReports}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: '#4CAF50'}]}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: '#FF9800'}]}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {color: '#9C27B0'}]}>{stats.userPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card containerStyle={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionItem, {backgroundColor: action.color}]}
                onPress={action.action}>
                <Icon name={action.icon} size={32} color="#fff" />
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card containerStyle={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <Icon name="security" size={20} color="#666" />
            <Text style={styles.privacyTitle}>Privacy Protected</Text>
          </View>
          <Text style={styles.privacyText}>
            Your reports help improve city safety. We protect your privacy and don't store personal information from photos.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statsCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 64) / 2,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
  privacyCard: {
    borderRadius: 12,
    marginBottom: 32,
    backgroundColor: '#e3f2fd',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen;
