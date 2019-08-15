import React,{Component} from 'react';
import ReactFileReader from 'react-file-reader';
import swal from 'sweetalert';

export class Task extends Component{
        constructor(props) {
                super(props);
                this.state = {
                      tasks: [],
                      form: {
                              work_item: '',
                              due_date: '',
                              no_of_resources: '',
                              status: ''
                      },
                      showForm: false,
                      updateId: null
                };
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        componentDidMount = () => {
                if(localStorage.getItem('tasks')) {
                        const tas = JSON.parse(localStorage.getItem('tasks'));
                        this.setState({ tasks: tas});
                }
                        
        };

        refreshGrid = () => {
                if(localStorage.getItem('tasks')) {
                        const tas = JSON.parse(localStorage.getItem('tasks'));
                        this.setState({ tasks: tas});
                }else{
                        const tas = [];
                        this.setState({ tasks: tas });
                }

                this.setState({showForm: false, updateId: null, form: {
                        work_item: '',
                        due_date: '',
                        no_of_resources: '',
                        status: ''
                }})
        }

        handleSubmit(event) {
                event.preventDefault();
                const data = this.state.form;
                let tasksData = [];
                if(localStorage.getItem('tasks')) {
                        tasksData = JSON.parse(localStorage.getItem('tasks'));
                }
                if(this.state.updateId) {
                        tasksData[this.state.updateId] = data;
                } else {
                        tasksData.push(data);
                }
                
                localStorage.setItem('tasks', JSON.stringify(tasksData));
                swal("Success!", "Data Saved Succesfully!", "success");
                this.refreshGrid();
        }

        handleChange = (event) => {
                const input = event.target;
                const value = input.value;
                let get_form  = this.state.form;
                get_form[input.name] = value;
                this.setState({ form:get_form });
        };

        formRender = () => {
                return (
                        <div className='row justify-content-center'>
                                <form onSubmit={this.handleSubmit}>
                                        <h2 className='text-center'>Form</h2>
                                        <input className='form-control mb-2' value={this.state.form.work_item} onChange={this.handleChange} name="work_item" type="text" placeholder='work item' required/>
                                        <input className='form-control mb-2' value={this.state.form.due_date} onChange={this.handleChange} name="due_date" type="date" placeholder='due date' required/>
                                        <input className='form-control mb-2' value={this.state.form.no_of_resources} onChange={this.handleChange} name="no_of_resources" type="number" placeholder='no of resources' required/>
                                        {/* <input className='form-control mb-2' value={this.state.form.status} onChange={this.handleChange} name="status" type="text" placeholder='status' required/> */}
                                        <select className='form-control mb-2' value={this.state.form.status} onChange={this.handleChange} name="status" required>
                                                <option value=''>Select Status</option>
                                                <option value='Open'>Open</option>
                                                <option value='In Progress'>In Progress</option>
                                                <option value='Closed'>Closed</option>
                                        </select>
                                        <button className='btn btn-primary'>Save</button>
                                </form>
                        </div>
                );
        }
        handleShowForm = () => {
                this.setState({updateId: null, showForm: !(this.state.showForm)});
                this.setState({form: {
                        work_item: '',
                        due_date: '',
                        no_of_resources: '',
                        status: ''
                }})
        }
        renderTable = () => {
                return (
                        <table className='table'>
                                <thead>
                                        <tr>
                                                <th>Work Item</th><th>Due Date</th><th>No Of Resources</th><th>Status</th><th>Actions</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {this.renderBody()}
                                </tbody>
                        </table>
                );
        }

        renderBody = () => {
                 return this.state.tasks.map((v, i) => {
                        return <tr key={i}><td>{v.work_item}</td><td>{v.due_date}</td>
                                <td>{v.no_of_resources}</td><td>{v.status}</td>
                                <td>
                                <button className='btn btn-primary' value={i} onClick={this.editTask}>Edit</button> &nbsp;
                                <button className='btn btn-danger' value={i} onClick={this.deleteTask}>Delete</button>
                                </td></tr>
                });
        }

        deleteTask = (event) => {
                let key = event.target.value;
                const items = this.state.tasks;
                items.splice(key,1);
                localStorage.setItem('tasks', JSON.stringify(items));
                swal("Success!", "Data Deleted Succesfully!", "success");
                this.refreshGrid();
        }
        editTask = (event) => {
                let key = event.target.value;
                const items = this.state.tasks;
                this.setState({showForm: true, form: {...items[key]}, updateId: key})

        }
        handleFiles = async files => {
                var reader = new FileReader();
                let csvRecords = [];
                reader.onload = function(e) {
                        let tasksData = [];
                        if(localStorage.getItem('tasks'))
                                tasksData = JSON.parse(localStorage.getItem('tasks'));

                        let csvData = reader.result;
                        let csvRecordsArray = csvData.split(/\r\n|\n/);
                        
                        for(let i=1;i<csvRecordsArray.length;i++) {
                                const rowdata = csvRecordsArray[i].match(/("[^"]*")|[^,]+/g);
                                console.log(rowdata)
                                if(rowdata) {
                                        const newRowObj = {work_item: rowdata[0], due_date: rowdata[1], no_of_resources: rowdata[2], status: rowdata[3]};
                                        csvRecords.push(newRowObj);
                                }
                                
                        }
                        if(csvRecords.length>0) {
                                localStorage.setItem('tasks', JSON.stringify([...tasksData,...csvRecords]));
                                swal("Success!", "Data Uploaded Succesfully!", "success");
                        }
                        return true;
                }
                await reader.readAsText(files[0]);
                //this.refreshGrid();
                window.location.reload();                
        }
        render() {
                return (
                        <div>
                                <div className = 'row'>
                                        <button className='btn btn-warning' onClick={this.handleShowForm}>Toogle Add</button> &nbsp;
                                        <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                                                <button className='btn btn-success'>Upload</button>
                                        </ReactFileReader>
                                </div>
                                {this.state.showForm ? this.formRender() : ''} 
                                <div>
                                        {this.state.tasks.length ? this.renderTable() : <div className='alert alert-danger'>No Data Found.</div>}
                                </div>
                        </div>
                );
        }
}