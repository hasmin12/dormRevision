import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { fetchAnnouncements } from '../../redux/actions/residentAction';
import { useDispatch } from 'react-redux';

const AnnouncementDetails = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { announcement } = route.params;
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchComments = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getComments?announcement_id=${announcement.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(response.data.comments); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Comments:', error.response); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    try {
      if (!newComment) {
        console.log('New comment is empty');
        return; // If newComment is empty, do nothing
      }

      const token = await getAuthToken();

      const formData = new FormData();
      formData.append('content', newComment);
      formData.append('announcement_id', announcement.id);

      const response = await axios.post(`${baseURL}/addComment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error('Error adding Announcement:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} extraScrollHeight={100}>
      <View>
              <Text style={styles.header}>{announcement.title}</Text>
      <Text style={styles.postedBy}>Posted by: {announcement.postedBy}</Text>
      <Text style={styles.postedDate}>Posted on: {announcement.updated_at}</Text>
      {announcement.img_path && (
        <Image
          source={{ uri: `http://192.168.100.18:8000${announcement.img_path}` }}
          style={styles.announcementImage}
          onError={(error) => console.error('Image load error:', error)}
        />
      )}
      </View>

      <Text style={styles.announcementContent}>{announcement.content}</Text>
      <Text style={styles.commentsHeader}>Comments:</Text>
      <ScrollView style={{ maxHeight: 250 }}> 
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentText}>{comment.content}</Text>
            <Text style={styles.commentBy}>- {comment.username}</Text>
          </View>
        ))}
              <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add your comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Add Comment" onPress={handleAddComment} />
      </View>

      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  postedBy: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  postedDate: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  announcementImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 18,
    marginBottom: 16,
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
  },
  commentBy: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  addCommentContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
});

export default AnnouncementDetails;
