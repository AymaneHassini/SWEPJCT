import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

export default function Btn({ bgColor, btnLabel, textColor, Press }) {
  return (
    <TouchableOpacity
      onPress={Press}
      style={[styles.button, { backgroundColor: bgColor }]}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {btnLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10, // Updated borderRadius to match the Field component
    alignItems: 'center',
    width: '100%', // Full width for consistency
    paddingVertical: 15, // Increased padding for a better touch area
    marginVertical: 15, // Increased vertical margin for better spacing
    elevation: 2, // Adding slight elevation for a subtle shadow (Android)
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  text: {
    fontSize: 20, // Adjusted font size for better readability
    fontWeight: 'bold',
  },
});
