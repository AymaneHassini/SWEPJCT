import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { darkGreen } from './Constants';

const Field = React.forwardRef((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.input, props.style]} // Use the updated styles
      placeholderTextColor={darkGreen}
    />
  );
});

// Define the new styles for the Field component
const styles = StyleSheet.create({
  input: {
    height: 50, // Maintaining the height
    borderRadius: 10, // Rounded corners with a smaller radius for a sleek look
    color: darkGreen, // Text color
    paddingHorizontal: 15, // Increased horizontal padding for better text spacing
    marginVertical: 10, // Vertical margin to space out the fields
    width: '100%', // Full width to match container width
    backgroundColor: '#f9f9f9', // Lighter background color for a modern appearance
    borderWidth: 1, // Adding a subtle border
    borderColor: '#ccc', // Light border color
    fontSize: 16, // Slightly larger font size for better readability
  },
});

export default Field;
