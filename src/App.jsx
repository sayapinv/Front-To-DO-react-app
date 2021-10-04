import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import edit from './image/edit.svg'
import del from './image/del.svg'
import ok from './image/ok.svg'

const App = () => {

  const [tasks, setTasks] = useState([]);

  const [text, setText] = useState('');

  const [selectedId, setSelectedId] = useState(null);

  const [editedText, setEditedText] = useState(null);



  
  useEffect(async () => {

    await axios.get('http://localhost:8000/allTasks').then(res => {
      setTasks(res.data.data);
      
    })
  })

  const addNewTask = async(text) => {
    
    if(text){
      await axios.post('http://localhost:8000/createTask',{
      text,
      isCheck: false
    }).then(res => {
      setText('');
      setTasks(res.data.data);

    })
    }
    
  }

  const changeCheck = async (check,id) => {

    await axios.patch('http://localhost:8000/updateTask',{
      _id: id,
      isCheck: check
    }).then(res => {
      setTasks(res.data.data);

    })
  }

  const deleteTask = async (id) => {

    await axios.delete(`http://localhost:8000/deleteTask?id=${id}`).then(res => {
      setTasks(res.data.data);
    })
  }
  
  const editTask = (task) => {

    setSelectedId(task._id);
    setEditedText(task.text)
    
  }

  const saveText = async (task) => {

    await axios.patch('http://localhost:8000/updateTask',{
      _id: task._id,
      text: editedText
    }).then(res => {
      setTasks(res.data.data);

    })
    setSelectedId(null);

  }

  
  

  return(
    <div className="test">
      <header>
        <h1>To-do list</h1>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={() => addNewTask(text)}>Add new</button>
      </header>
      <div className="tasks">
        {
          tasks.map((task, index) => 
          
            <div key={`task-${index}`} className="hline">
              {selectedId === task._id ? (

                <div className="line">
                  <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value) } className="editinp"/>
                  <img src={ok} className="image" alt="error" onClick={() => saveText(task)}/>
                </div>

              ) : (

                <div className="line">
                  <input type="checkbox" checked={task.isCheck} onChange={() => changeCheck(!task.isCheck,task._id)} className="checkbox"/>
                  <span className={task.isCheck ? 'checkTrue' : 'checkFalse'} id="textspan">
                    {task.text} 
                  </span>
                  <img src={edit} className="image" alt="error" onClick={() => editTask(task)}/>
                  <img src={del} className="image" alt="error" onClick={() => deleteTask(task._id)}/>
                </div>

              )}

            </div>

          )
        }
      </div>
    </div>
  )
}

export default App;