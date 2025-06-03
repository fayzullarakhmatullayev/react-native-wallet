import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, world!</Text>
      <View style={styles.separator}></View>
      <Link style={styles.button} href="/about">
        About
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc'
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 5,
    textAlign: 'center'
  }
});
