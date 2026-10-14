import Stack from 'react-bootstrap/Stack'
import ToDoListItem from './ToDoListItem';
import { useState } from 'react';

function ToDoList() {

    const [toDoItems, setToDoItems] = useState([
        {
            id: 0,
            task: "Learn Java",
            completed: false
        }
    ]);

    const handleTaskStatusChange = (itemId) => {
        setToDoItems(toDoItems.map(toDoItem =>
            toDoItem.id === itemId ? { ...toDoItem, completed: !toDoItem.completed} : toDoItem
        ));
    };

    const handleTaskAdd = (event) => {
        event.preventDefault();

        const newToDoItem = {
            id: Math.random().toString(36).substring(2),
            task: event.target.task.value,
            completed: false
        }

        setToDoItems([...toDoItems, newToDoItem]);

        event.target.reset();
    };

    const handleItemDelete = (itemId) => {
        setToDoItems(toDoItems.filter(toDoItem => toDoItem.id !== itemId))
    };

    const handleItemUpdate = (itemId, newItemTask) => {
        setToDoItems(toDoItems.map(todoItem => 
            todoItem.id === itemId ? {...todoItem, task: newItemTask} : todoItem
        ));
    }

    return (
        <div className="todolist d-flex flex-column justify-content-between align-items-center w-auto">
            <div
                className="todolist-additem m-4 shadow-sm rounded-3 border w-75 text-center">
                    <form 
                        className="form"
                        onSubmit={ handleTaskAdd }>
                        <div className="input-group">
                            <input 
                                type="text"
                                className="todolist-additem-field form-control border-0"
                                placeholder="Add an Item"
                                name='task'
                                ></input>
                            <button 
                                type="submit"
                                className="btn btn-outline-none fw-bolder">
                                    <img 
                                        src="/Plus_Icon.png"
                                        style={{width: "24px", height: "24px"}}></img>
                                </button>
                        </div>
                    </form>
            </div>
            <div
                className="todolist-items m-4 p-2 shadow-sm rounded-3 border w-75">

                    { toDoItems.map((toDoItem) => (
                        <ToDoListItem 
                            key={toDoItem.id}
                            toDoInfo={toDoItem}
                            handleCheck={ handleTaskStatusChange }
                            handleEdit={ handleItemUpdate }
                            handleDelete={ handleItemDelete }></ToDoListItem>
                    ))}

            </div>
        </div>
    )
}

export default ToDoList;