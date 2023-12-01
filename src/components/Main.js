import React, { useState } from 'react'
import data from './info.json'
import editImg from "./images/edit.png"
import deleteImg from "./images/delete.png"
const initial=data;

const Main = () => {

    const itemsPerPage = 10;

    const [jsonData, setJsonData] = useState(initial);
    const [editableId, setEditableId] = useState(null);
    const [editedData, setEditedData] = useState({ name: '', email: '',role: ''});
    const [term, setTerm] = useState('');
    const [currPage, setcurrPage] = useState(1);
    const [rows, setRows] = useState([]);
    const [all, setAll] = useState(false);

    const deleteItemById = (id) => {
        setJsonData(prevData => prevData.filter(item => item.id !== id));
      };
    
      const startEditing = (id, name, email, role) => {
        setEditableId(id);
        setEditedData({ name, email, role });
      };
    
      const cancelEditing = () => {
        setEditableId(null);
        setEditedData({ name: '', email: '',role:'' });
      };
    
      const saveEditing = (id) => {
        setJsonData(prevData =>
          prevData.map(item =>
            item.id === id
              ? { ...item, name: editedData.name, email: editedData.email, role:editedData.role }
              : item
          )
        );
        setEditableId(null);
        setEditedData({ name: '', email: '',role:'' });
      };
    
      const handleSearch = (e) => {
        setTerm(e.target.value);
        setcurrPage(1); // Reset to first page when searching
      };
    
      const handleRowSelection = (id) => {
        setRows(prevrows => {
          if (prevrows.includes(id)) {
            // Deselect the row if it's already selected
            return prevrows.filter(rowId => rowId !== id);
          } else {
            // Select the row if it's not selected
            return [...prevrows, id];
          }
        });
      };
    
      const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          setcurrPage(newPage);
        }
      };
    
      const deleterows = () => {
        setJsonData(prevData => prevData.filter(item => !rows.includes(item.id)));
        setRows([]);
        setAll(false);
      };
    
      const filteredData = jsonData.filter(item =>
        Object.values(item).some(prop =>
          typeof prop === 'string' && prop.toLowerCase().includes(term.toLowerCase())
        )
      );
    
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
      const visibleData = filteredData.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage);
    
      const handleall = () => {
        setAll(!all);
        setRows(all ? [] : visibleData.map(item => item.id));
      };

    return (
        <>
            
            <div style={{width:"90%", margin:"auto",display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
            <div style={{marginBottom:"1rem"}}>
            <h1>Admin Dashboard</h1>
            <input
                type="text"
                placeholder="Search"
                value={term}
                onChange={handleSearch}
                style={{padding:"10px"}}
            />
            </div>
            <table id="userTable">
            <thead>
                <tr>
                    <th style={{width:"20px"}}>
                    <input
                        type="checkbox"
                        checked={all}
                        onChange={handleall}
                    />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                    
                </tr>
            </thead>
            <tbody>
                
            
                {visibleData.map(user=>(
                    <tr key={user.id}
              style={{ backgroundColor: rows.includes(user.id) ? '#ddd' : 'inherit' }}
            >
                        <td style={{width:"20px"}}>
                            <input
                            type="checkbox"
                            checked={rows.includes(user.id)}
                            onChange={() => handleRowSelection(user.id)}
                            />
                        </td>
                        <td>
                        {editableId === user.id ? (
                            <input
                            type="text"
                            value={editedData.name}
                            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            />
                        ) : (
                            user.name
                        )}
                        </td>
                        <td>
                        {editableId === user.id ? (
                            <input
                            type="text"
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            />
                        ) : (
                            user.email
                        )}
                        </td>
                        <td>
                        {editableId === user.id ? (
                            <input
                            type="text"
                            value={editedData.role}
                            onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                            />
                        ) : (
                            user.role
                        )}</td>
                        <td>
                        {editableId === user.id ? (
                            <>
                            <button style={{marginRight:"1rem"}} class="save btn" onClick={() => saveEditing(user.id)}>Save</button>
                            <button class="cancel btn" onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                            <button style={{marginRight:"1rem"}} class="edit" onClick={() => startEditing(user.id, user.name, user.email, user.role)}>
                                <img src={editImg} alt="edit icon" style={{width:"20px",height:"20px"}}></img>
                            </button>
                            <button class="delete" onClick={() => deleteItemById(user.id)}>
                                <img src={deleteImg} alt="edit icon" style={{width:"20px",height:"20px"}}></img>
                            </button>
                            </>
                        )}
                        </td>
                        
                    </tr>
                ))}
            
            </tbody>
        </table>
        <div style={{marginTop:"1rem"}}>
        {rows.length > 0 &&
          <button onClick={deleterows} disabled={rows.length === 0} class="btn">
            Delete Selected
          </button>
        }
        </div>

        </div>                   

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button style={{marginRight:"1rem"}} class="first-page btn" onClick={() => handlePageChange(1)}>First Page</button>
        <button style={{marginRight:"1rem"}} class="previous-page btn" onClick={() => handlePageChange(currPage - 1)}>Previous Page</button>
        <div style={{ overflowX: 'auto', display: 'flex' }}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              class="btn"
              onClick={() => handlePageChange(index + 1)}
              style={{ margin: '0 5px', backgroundColor: currPage === index + 1 ? '#ddd' : 'white' }}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button style={{marginLeft:"1rem"}} class="next-page btn" onClick={() => handlePageChange(currPage + 1)}>Next Page</button>
        <button style={{marginLeft:"1rem"}} class="last-page btn" onClick={() => handlePageChange(totalPages)}>Last Page</button>
      </div>
    
        </>
    )
}

export default Main