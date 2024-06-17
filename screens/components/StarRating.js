import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const StarRating = ({ numericRating, textRating }) => {
  const renderStars = () => {
    const stars = [];
    const totalStars = 5;
    for (let i = 1; i <= totalStars; i++) {
      if (i <= numericRating) {
        stars.push(
          <Ionicons
            key={i}
            name="ios-star"
            size={24}
            color="#FFD700"
            style={styles.star}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="ios-star-outline"
            size={24}
            color="#FFD700"
            style={styles.star}
          />
        );
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <Text style={styles.textRating}>{textRating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  star: {
    marginRight: 2,
  },
  textRating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StarRating;
