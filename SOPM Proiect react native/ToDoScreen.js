import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

const ToDoScreen = ({ navigation, route }) => {
  const initialActiveTab = route.params?.activeTab || 'ToDo';
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editedTaskDetails, setEditedTaskDetails] = useState('');
  const [editedTaskDeadline, setEditedTaskDeadline] = useState('');
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [editedInputDate, setEditedInputDate] = useState('');
  const [editedInputTime, setEditedInputTime] = useState('');

  // Adăugăm starea pentru culoare și definim culorile disponibile
  const [taskColor, setTaskColor] = useState('white'); // Setăm o culoare implicită
  const availableColors = ['#7EBCE6', '#958CF9', '#E6889A', '#E3F492', '#8BED6F', '#FF5656'];

  // Adăugăm culoarea pentru task-ul editat
  const [editedTaskColor, setEditedTaskColor] = useState('white'); // Setăm o culoare implicită

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const Tab = ({ name }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === name && styles.activeTab,
      ]}
      onPress={() => setActiveTab(name)}
    >
      <Text style={[
        styles.tabText,
        activeTab === name && styles.activeTabText,
      ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  const addTask = () => {
    let dateTime = null;

    if (inputDate && inputTime) {
      dateTime = new Date(`${inputDate}T${inputTime}:00.000`);
    }

    const now = new Date();

    const newTask = {
      id: Math.random().toString(),
      title: taskTitle,
      details: taskDetails,
      deadline: dateTime ? dateTime.toISOString() : null,
      completed: false,
      important: activeTab === 'Important',
      category: activeTab,
      color: taskColor, // Folosim culoarea selectată
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    if (dateTime) {
      const notificationTime = new Date(dateTime.getTime() - 15 * 60 * 1000);

      if (notificationTime > now) {
        const timeoutId = setTimeout(() => {
          alert(`Task-ul "${taskTitle}" expiră în 15 minute!`);
        }, notificationTime - now);

        newTask.timeoutId = timeoutId;
      }
    }

    setModalVisible(false);
    setTaskTitle('');
    setTaskDetails('');
    setInputDate('');
    setInputTime('');
    setTaskColor('white'); // Resetăm culoarea după adăugarea task-ului
  };

  const editTask = () => {
    let dateTime = null;

    if (editedInputDate && editedInputTime) {
      dateTime = new Date(`${editedInputDate}T${editedInputTime}:00.000`);
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === editedTaskId) {
        return {
          ...task,
          title: editedTaskText,
          details: editedTaskDetails,
          deadline: dateTime ? dateTime.toISOString() : null,
          color: editedTaskColor, // Folosim culoarea selectată pentru task-ul editat
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    setEditModalVisible(false);
    setEditedTaskText('');
    setEditedTaskDetails('');
    setEditedInputDate('');
    setEditedInputTime('');
    setEditedTaskColor('white'); // Resetăm culoarea după editarea task-ului
  };

  const toggleTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (task.category === 'Closed') {
          if (task.timeoutId) {
            clearTimeout(task.timeoutId);
          }
          return { ...task, completed: false, category: 'ToDo', important: false, timeoutId: null };
        } else {
          return { ...task, completed: true, category: 'Closed' };
        }
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const toggleTaskImportant = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (task.category === 'ToDo') {
          return { ...task, important: true, category: 'Important' };
        } else if (task.category === 'Important') {
          return { ...task, important: false, category: 'ToDo' };
        }
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => {
      if (task.id === taskId && task.timeoutId) {
        clearTimeout(task.timeoutId);
      }
      return task.id !== taskId;
    });

    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab name="ToDo" />
        <Tab name="Important" />
        <Tab name="Closed" />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {activeTab === 'ToDo' && (
        <View style={styles.contentContainer}>
          <FlatList
            data={tasks.filter((task) => task.category === 'ToDo' && !task.completed && task.title.toLowerCase().includes(searchText.toLowerCase()))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const hasDeadline = !!item.deadline;
              const isUpcoming = hasDeadline && new Date(item.deadline) > new Date();
              const isOverdue = hasDeadline && new Date(item.deadline) < new Date();
              return (
                <View style={[
                  styles.taskItem,
                  hasDeadline && isUpcoming && styles.upcomingTask,
                  hasDeadline && isOverdue && styles.overdueTask,
                  { backgroundColor: item.color }, // Folosim culoarea specifică a task-ului
                ]}>
                  <TouchableOpacity
                    style={styles.starButton}
                    onPress={() => toggleTaskImportant(item.id)}
                  >
                    <Text style={{ color: item.important ? 'yellow' : 'gray' }}>★</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleTaskDetails(item.id)}
                    style={styles.taskTitleContainer}
                  >
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    {hasDeadline && (
                      <Text style={[
                        styles.taskDeadline,
                        isUpcoming && styles.upcomingText,
                        isOverdue && styles.overdueText,
                      ]}>
                        {isUpcoming ? 'UPCOMING' : 'OVERDUE'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {expandedTaskId === item.id && (
                    <Text style={styles.taskDetails}>{item.details}</Text>
                  )}
                  <View style={styles.taskButtons}>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setEditedTaskId(item.id);
                        setEditedTaskText(item.title);
                        setEditedTaskDetails(item.details);
                        setEditedTaskDeadline(item.deadline);
                        setEditedTaskColor(item.color); // Setăm culoarea task-ului editat
                      }}
                    >
                      <Text style={styles.emojiButton}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => toggleTaskCompleted(item.id)}
                    >
                      <Text style={styles.emojiButton}>✅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => deleteTask(item.id)}
                    >
                      <Text style={styles.emojiButton}>❌</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'Important' && (
        <View style={styles.contentContainer}>
          <FlatList
            data={tasks.filter((task) => task.important && !task.completed && task.title.toLowerCase().includes(searchText.toLowerCase()))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const hasDeadline = !!item.deadline;
              const isUpcoming = hasDeadline && new Date(item.deadline) > new Date();
              const isOverdue = hasDeadline && new Date(item.deadline) < new Date();
              return (
                <View style={[
                  styles.taskItem,
                  hasDeadline && isUpcoming && styles.upcomingTask,
                  hasDeadline && isOverdue && styles.overdueTask,
                  { backgroundColor: item.color },,
                ]}>
                  <TouchableOpacity
                    style={styles.starButton}
                    onPress={() => toggleTaskImportant(item.id)}
                  >
                    <Text style={{ color: item.important ? 'yellow' : 'gray' }}>★</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleTaskDetails(item.id)}
                    style={styles.taskTitleContainer}
                  >
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    {hasDeadline && (
                      <Text style={[
                        styles.taskDeadline,
                        isUpcoming && styles.upcomingText,
                        isOverdue && styles.overdueText,
                      ]}>
                        {isUpcoming ? 'UPCOMING' : 'OVERDUE'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  {expandedTaskId === item.id && (
                    <Text style={styles.taskDetails}>{item.details}</Text>
                  )}
                  <View style={styles.taskButtons}>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => {
                        setEditModalVisible(true);
                        setEditedTaskId(item.id);
                        setEditedTaskText(item.title);
                        setEditedTaskDetails(item.details);
                        setEditedTaskDeadline(item.deadline);
                        setEditedTaskColor(item.color); // Setăm culoarea task-ului editat
                      }}
                    >
                      <Text style={styles.emojiButton}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => toggleTaskCompleted(item.id)}
                    >
                      <Text style={styles.emojiButton}>✅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.taskButton}
                      onPress={() => deleteTask(item.id)}
                    >
                      <Text style={styles.emojiButton}>❌</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'Closed' && (
        <View style={styles.contentContainer}>
          <FlatList
            data={tasks.filter((task) => task.category === 'Closed' && task.title.toLowerCase().includes(searchText.toLowerCase()))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => toggleTaskImportant(item.id)}
                >
                  <Text style={{ color: item.important ? 'yellow' : 'gray' }}>★</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleTaskDetails(item.id)}
                  style={styles.taskTitleContainer}
                >
                  <Text style={styles.taskTitle}>{item.title}</Text>
                </TouchableOpacity>
                {expandedTaskId === item.id && (
                  <Text style={styles.taskDetails}>{item.details}</Text>
                )}
                <View style={styles.taskButtons}>
                  <TouchableOpacity
                    style={styles.taskButton}
                    onPress={() => toggleTaskCompleted(item.id)}
                  >
                    <Text>Reopen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Task Title"
              placeholderTextColor="black"
              value={taskTitle}
              onChangeText={setTaskTitle}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Task Details"
              placeholderTextColor="black"
              value={taskDetails}
              onChangeText={setTaskDetails}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              placeholderTextColor="black"
              value={inputDate}
              onChangeText={setInputDate}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Ora (HH:MM)"
              placeholderTextColor="black"
              value={inputTime}
              onChangeText={setInputTime}
              style={styles.modalInput}
            />
            <View style={styles.colorPicker}>
              {availableColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    taskColor === color && { borderColor: 'black', borderWidth: 2 },
                  ]}
                  onPress={() => setTaskColor(color)}
                ></TouchableOpacity>
              ))}
            </View>

            <Button title="Add Task" onPress={addTask} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Edit Task Title"
              placeholderTextColor="black"
              value={editedTaskText}
              onChangeText={setEditedTaskText}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Edit Task Details"
              placeholderTextColor="black"
              value={editedTaskDetails}
              onChangeText={setEditedTaskDetails}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              placeholderTextColor="black"
              value={editedInputDate}
              onChangeText={setEditedInputDate}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Ora (HH:MM)"
              placeholderTextColor="black"
              value={editedInputTime}
              onChangeText={setEditedInputTime}
              style={styles.modalInput}
            />
            <View style={styles.colorPicker}>
              {availableColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    editedTaskColor === color && { borderColor: 'black', borderWidth: 2 },
                  ]}
                  onPress={() => setEditedTaskColor(color)}
                ></TouchableOpacity>
              ))}
            </View>

            <Button title="Save" onPress={editTask} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Restul stilurilor și configurațiilor rămân neschimbate

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFB6C1',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF69B4',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  taskButtons: {
    flexDirection: 'row',
  },
  taskButton: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: 'black',
  },
  moveCompletedToClosedButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  moveCompletedToClosedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDeadline: {
    fontSize: 12,
    marginTop: 5,
  },
  overdueTask: {
    borderColor: 'red',  // Culoarea pentru task-uri trecute de deadline
    borderWidth: 1,
  },
  upcomingTask: {
    borderColor: 'green',  // Culoarea pentru task-uri viitoare
    borderWidth: 1,
  },

  emojiButton: {
    fontSize: 23, // sau orice altă dimensiune dorești
  },

  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

});
export default ToDoScreen;


