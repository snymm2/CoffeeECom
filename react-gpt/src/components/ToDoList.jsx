import ToDoListItem from './ToDoListItem';
import { useEffect, useState } from 'react';

function ToDoList() {

    const [toDoItems, setToDoItems] = useState([]);
    const [itemsFilter, setItemsFilter] = useState('all');

    const handleTaskStatusChange = (itemId) => {
        setToDoItems(currentToDoItems => 
            currentToDoItems.map(toDoItem =>
                toDoItem.id === itemId ? { ...toDoItem, completed: !toDoItem.completed} : toDoItem
        ));
    };

    const handleTaskAdd = (event) => {
        event.preventDefault();

        const updatedTask = event.target.task.value.trim();

        if (!updatedTask) {
            return;
        }

        const newToDoItem = {
            id: crypto.randomUUID(),
            task: updatedTask,
            completed: false
        }

        setToDoItems([...toDoItems, newToDoItem]);

        event.target.reset();
    };

    const handleItemDelete = (itemId) => {
        setToDoItems(currentToDoItems => 
            currentToDoItems.filter(toDoItem => 
                toDoItem.id !== itemId))
    };

    const handleItemUpdate = (itemId, newItemTask) => {
        setToDoItems(currentToDoItems => currentToDoItems.map(todoItem => 
            todoItem.id === itemId ? {...todoItem, task: newItemTask} : todoItem
        ));
    }

    const handleFilterUpdate = (event) => {
        setItemsFilter(currentValue => event.target.value);
    }

    return  (
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
                                required />
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
                className='todolist-filter shadow-sm rounded-3 border w-75'>
                    <div className='d-flex justify-content-around'>
                        <input
                            type="radio"
                            id="filterAll"
                            className="btn-check"
                            name="filter"
                            value="all"
                            checked={itemsFilter === 'all'}
                            onChange={ handleFilterUpdate }/>
                        <label 
                            htmlFor="filterAll"
                            className='btn btn-outline-primary'>All</label>

                        <input
                            type="radio"
                            id="filterComplete"
                            className="btn-check"
                            name="filter"
                            value="complete"
                            checked={itemsFilter === 'complete'}
                            onChange={handleFilterUpdate}/>
                        <label 
                            htmlFor="filterComplete"
                            className='btn btn-outline-primary'>Completed</label>

                        <input
                            type="radio"
                            id="filterIncomplete"
                            className="btn-check"
                            name="filter"
                            value="incomplete"
                            checked={itemsFilter === 'incomplete'}
                            onChange={ handleFilterUpdate }/>
                        <label 
                            htmlFor="filterIncomplete"
                            className='btn btn-outline-primary'>Incomplete</label>
                    </div>
            </div>
            {
                toDoItems.length > 0 ? (
                    <div
                        className="todolist-items m-4 p-2 shadow-sm rounded-3 border w-75">
                            {
                                toDoItems.filter((todoItem) => {
                                    if (itemsFilter === "all") {
                                        return true;
                                    }
                                    if (itemsFilter === "complete") {
                                        return todoItem.completed;
                                    }
                                    if (itemsFilter === "incomplete") {
                                        return !todoItem.completed;
                                    }
                                    return false;
                                    }).map((toDoItem) => (
                                        <ToDoListItem
                                            key={toDoItem.id}
                                            toDoInfo={toDoItem}
                                            onCheck={handleTaskStatusChange}
                                            onEdit={handleItemUpdate}
                                            onDelete={handleItemDelete} />
                                ))
                            }
                    </div>
                ) : null
            }

        </div>
    )
}

export default ToDoList;