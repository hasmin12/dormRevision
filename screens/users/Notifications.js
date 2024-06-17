import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { fetchNotifications } from '../../redux/actions/notificationAction';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'; 
import url from '../../assets/common/url';

export default Notifications = () => {
  const user = useSelector((state) => state.auth.user);
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  console.log(user)

 
  return (
    <FlatList
      style={styles.root}
      data={notifications}
      ItemSeparatorComponent={() => {
        return <View style={styles.separator} />
      }}
      keyExtractor={item => {
        return item.id
      }}
      renderItem={item => {
        const Notification = item.item
        let attachment = <View />

        let mainContentStyle
        if (Notification.attachment) {
          mainContentStyle = styles.mainContent
          attachment = <Image style={styles.attachment} source={{ uri: `${url}${Notification.attachment}` }} />
        }

        const timeAgo = moment(Notification.createdAt).fromNow();

        return (
          <TouchableOpacity style={styles.container}>
            <Image source={{ uri: `${url}${Notification.senderImage}` }} style={styles.avatar} />
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <View style={styles.text}>
                  <Text style={styles.name}>{Notification.senderName}</Text>
                  <Text numberOfLines={2} ellipsizeMode="tail">{Notification.message}</Text> 
                </View>
                <Text style={styles.timeAgo}>{timeAgo}</Text> 
              </View>
              {attachment}
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'flex-start',
    height: 100, 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 60, 
  },
  text: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  timeAgo: {
    fontSize: 12,
    color: '#696969',
  },
  name: {
    fontSize: 16,
    color: '#1E90FF',
    marginBottom: 5, 
  },
});
