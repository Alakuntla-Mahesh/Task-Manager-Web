import { Component } from 'react';
import Todos from './components/Todos';
import './App.css';

class App extends Component {
  state = {
    task: '',
    status: false,
    errorMessage: '',
    listOfToDos: [],
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const response = await fetch('https://task-mananger-backend.onrender.com/');
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);
        this.setState({ listOfToDos: data });
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  deleteTaskFunction = async (id) => {
    try {
      const response = await fetch(`https://task-mananger-backend.onrender.com/task/${id}`, {
        method: 'DELETE',
      });
      console.log(response)

      if (response.ok) {
        await this.getData()
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }


  enterTaskFunction = (event) => {
    this.setState({
      task: event.target.value
    });
  }

  addingTaskFunction = async () => {
    const { task, status } = this.state;

    if (task !== '') {
      const response = await fetch('https://task-mananger-backend.onrender.com/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, status })
      });


      if (response.ok) {
        this.setState({ task: '', status: false });
        this.getData();

      } else {
        console.error('Failed to add task');
      }
    }
  }

  updateToDostatus = async (id) => {
    const newStatus = true
    try {
      const response = await fetch(`https://task-mananger-backend.onrender.com/task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        this.getData();
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }

  }


  render() {
    const { task, listOfToDos, errorMessage } = this.state;

    return (
      <div>
        <h1>Task Manager</h1>
        <h3>Organize your day, one task at a time.</h3>
        <p>click on incomplete button to complete the task</p>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div>
          <input
            type="text"
            placeholder="Enter your task"
            onChange={this.enterTaskFunction}
            value={task}
          />
          <button type="button" onClick={this.addingTaskFunction}>
            Add
          </button>
        </div>
        <ul>
          {listOfToDos.length > 0 ? (
            listOfToDos.map((each) => (
              <Todos
                key={each.id}
                todoItem={each}
                deleteToDo={this.deleteTaskFunction}
                updateToDostatus={this.updateToDostatus}
              />
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
