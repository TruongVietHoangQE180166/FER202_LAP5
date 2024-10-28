import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://student-api-nestjs.onrender.com/Students';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  async function handleAddStudent() {
    if (!name || !code) return alert('Please enter complete information.');

    try {
      const newStudent = { name, studentCode: code, isActive: true };
      const response = await axios.post(API_URL, newStudent);
      if (response.data.success) {
        setStudents([response.data.data, ...students]);
        setName('');
        setCode('');
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  }

  async function handleDeleteStudent(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        setStudents(students.filter(student => student._id !== id));
        setSelectedStudents(selectedStudents.filter(sId => sId !== id));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  // Update student status in API
  async function toggleStatus(id) {
    const student = students.find(student => student._id === id);
    if (!student) return;

    try {
      const updatedStudent = { ...student, isActive: !student.isActive };
      const response = await axios.put(`${API_URL}/${id}`, updatedStudent);
      if (response.data.success) {
        setStudents(students.map(s => (s._id === id ? response.data.data : s)));
      }
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  }

  function handleSelectStudent(id, isChecked) {
    if (isChecked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter(sId => sId !== id));
      setSelectAll(false);
    }
  }

  function handleSelectAll(isChecked) {
    setSelectAll(isChecked);
    if (isChecked) {
      const allStudentIds = students.map(student => student._id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  }

  // Delete all students via API
  async function handleClearAll() {
    try {
      // Loop through selected students and delete each via API
      for (const studentId of selectedStudents) {
        await axios.delete(`${API_URL}/${studentId}`);
      }
  
      // Update the state to remove deleted students
      setStudents(students.filter(student => !selectedStudents.includes(student._id)));
      setSelectedStudents([]); // Clear selected students
      setSelectAll(false); // Uncheck "Select All"
    } catch (error) {
      console.error('Error while clearing selected students:', error);
    }
  }
  

  useEffect(() => {
    setSelectAll(selectedStudents.length === students.length && students.length > 0);
  }, [selectedStudents, students]);

  return (
    <div className="container mt-5">
      <h3>Student Management</h3>

      <Form className="mb-3">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Student Code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="dark" onClick={handleAddStudent}>
              Add
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th colSpan={7}>
              <Row className="align-items-center">
                <Col xs="auto">
                  <Form.Check
                    type="checkbox"
                    checked={selectAll}
                    onChange={e => handleSelectAll(e.target.checked)}
                    label={`Selected Students: ${selectedStudents.length}`}
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="dark" onClick={handleClearAll}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Student Name</th>
            <th>Student Code</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={e =>
                    handleSelectStudent(student._id, e.target.checked)
                  }
                />
              </td>
              <td>
                <Link to={`/student/${student._id}`} style={{ color: 'black', fontWeight: '500' }}>
                  {student.name}
                </Link>
              </td>
              <td>{student.studentCode}</td>
              <td>
                <Badge
                  bg={student.isActive ? 'info' : 'danger'}
                  onClick={() => toggleStatus(student._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {student.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteStudent(student._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StudentManagement;





/*
import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentManagement() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Trương Việt Hoàng', code: 'QE180166', birth: '06/02/2004', CCCD: '052204001335', active: true },
    { id: 2, name: 'Nguyễn Gia Luật', code: 'QE180079', birth: '05/01/2004', CCCD: '052204001336', active: false },
    { id: 3, name: 'Lê Thị Minh', code: 'QE180045', birth: '07/07/2004', CCCD: '052204001337', active: true },
    { id: 4, name: 'Phạm Tuấn Anh', code: 'QE180112', birth: '02/09/2004', CCCD: '052204001338', active: false },
  ]);
  //state for add
  const [name, setName] = useState('');
  const [code, setCode] = useState('');// note for ract
  const [birth, setBirth] = useState('');
  const [CCCD, setCCCD] = useState('');
  //state for select all
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // State for modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  //state for search 
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchBirth, setSearchBirth] = useState('');
  const [searchCCCD, setSearchCCCD] = useState('');


  // Thêm sinh viên mới
  function handleAddStudent() {
    if (name && code && birth && CCCD) {
      const newStudent = {
        id: Date.now(),
        name,
        code,
        birth,
        CCCD,
        active: true,
      };
      setStudents([newStudent, ...students]);
      setName('');
      setCode('');
      setBirth('');
      setCCCD('');
      setSelectAll(false);
    }
  }

  // Xóa sinh viên
  function handleDeleteStudent(id) {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    setSelectedStudents(selectedStudents.filter(sId => sId !== id));
  }
  // search sinh vien 
  function handleSearch() {
    const filteredStudents = students.filter(student =>
      (searchName === '' || student.name.includes(searchName)) &&
      (searchCode === '' || student.code.includes(searchCode)) &&
      (searchBirth === '' || student.birth.includes(searchBirth)) &&
      (searchCCCD === '' || student.CCCD.includes(searchCCCD))
    );
    setStudents(filteredStudents);
  }

  // Thay đổi trạng thái Active
  function toggleStatus(id) {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, active: !student.active } : student
    );
    setStudents(updatedStudents);
  }

  // Mở modal thêm sinh viên
  function handleOpenAddModal() {
    setShowAddModal(true);
  }

  // Đóng modal thêm sinh viên
  function handleCloseAddModal() {
    setShowAddModal(false);
  }

  // Mở modal chỉnh sửa sinh viên
  function handleEditStudent(student) {
    setEditStudent(student);
    setShowEditModal(true);
  }

  // Đóng modal chỉnh sửa sinh viên
  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  // Update student information
  function handleUpdateStudent() {
    const updatedStudents = students.map(student =>
      student.id === editStudent.id ? editStudent : student
    );
    setStudents(updatedStudents);
    setShowEditModal(false);
  }
  // Cập nhật số lượng sinh viên được chọn
  function handleSelectStudent(id, isChecked) {
    if (isChecked) {
      setSelectedStudents([...selectedStudents, id]);
    } else {
      setSelectedStudents(selectedStudents.filter(sId => sId !== id));
      setSelectAll(false); // Bỏ chọn "Select All" nếu bất kỳ sinh viên nào bị bỏ chọn
    }
  }
  // Chọn / Bỏ chọn tất cả sinh viên
  function handleSelectAll(isChecked) {
    setSelectAll(isChecked);
    if (isChecked) {
      const allStudentIds = students.map(student => student.id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  }
  // funtion for clear all 
  function handleClearAll() {
    setStudents([]); // Xóa toàn bộ danh sách sinh viên
    setSelectedStudents([]); // Đảm bảo danh sách sinh viên đã chọn cũng được xóa
    setSelectAll(false); // Bỏ chọn trạng thái "Select All" nếu có
  }
  
  // Đồng bộ trạng thái Select All với danh sách đã chọn
  useEffect(() => {
    setSelectAll(selectedStudents.length === students.length && students.length > 0);
  }, [selectedStudents, students]);
  return (
    <div className="container mt-5">
      <h3>StudentManagement</h3>
      <Button variant="dark" onClick={handleOpenAddModal} className="mb-3">
        Add Student
      </Button>{' '}
      <Form className="mb-3">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by Code"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by Birth Date"
              value={searchBirth}
              onChange={e => setSearchBirth(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by CCCD"
              value={searchCCCD}
              onChange={e => setSearchCCCD(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="dark" onClick={handleSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
  <thead>
    <tr>
      <th colSpan={7}>
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              checked={selectAll}
              onChange={e => handleSelectAll(e.target.checked)}
              label={`Selected Students: ${selectedStudents.length}`}
            />
          </Col>
          <Col xs="auto">
            <Button variant="dark" onClick={handleClearAll}>
              Clear All
            </Button>
          </Col>
        </Row>
      </th>
    </tr>
    <tr>
      <th></th>
      <th>Student Name</th>
      <th>Student Code</th>
      <th>Birth</th>
      <th>CCCD</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {students.map(student => (
      <tr key={student.id}>
        <td>
          <Form.Check
            type="checkbox"
            checked={selectedStudents.includes(student.id)}
            onChange={e =>
              handleSelectStudent(student.id, e.target.checked)
            }
          />
        </td>
        <td>{student.name}</td>
        <td>{student.code}</td>
        <td>{student.birth}</td>
        <td>{student.CCCD}</td>
        <td>
          <Badge
            bg={student.active ? 'info' : 'danger'}
            style={{ cursor: 'pointer' }}
            onClick={() => toggleStatus(student.id)}
          >
            {student.active ? 'Active' : 'Inactive'}
          </Badge>
        </td>
        <td>
          <Button variant="info" onClick={() => handleEditStudent(student)}>
            Edit
          </Button>{' '}
          <Button
            variant="danger"
            onClick={() => handleDeleteStudent(student.id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
 */
