import './index.css'

const Todos = props => {
    const { todoItem, deleteToDo, updateToDostatus } = props
    const { id, status, task } = todoItem
    const value = status ? "complete" : "incomplete"
    const classNameofTaskBtn = status ? "complete" : "incomplete"
    const deleteToDoFunction = () => {
        deleteToDo(id)
    }
    const updateToDostatusFunction = () => {
        updateToDostatus(id)
    }
    return (
        <li>
            <p>{task}</p>
            <button type="button" onClick={updateToDostatusFunction} className={classNameofTaskBtn}>{value}</button>
            <button type="button" onClick={deleteToDoFunction}>Del</button>
        </li>
    )
}

export default Todos