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

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [birth, setBirth] = useState('');
  const [CCCD, setCCCD] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

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

  // Thay đổi trạng thái Active
  function toggleStatus(id) {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, active: !student.active } : student
    );
    setStudents(updatedStudents);
  }

  // Edit Student
  function handleEditStudent(student) {
    setEditStudent(student);
    setShowModal(true);
  }

  // Update student information
  function handleUpdateStudent() {
    const updatedStudents = students.map(student =>
      student.id === editStudent.id ? editStudent : student
    );
    setStudents(updatedStudents);
    setShowModal(false);
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
   // Đồng bộ trạng thái Select All với danh sách đã chọn
   useEffect(() => {
    if (selectedStudents.length === students.length && students.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStudents, students]);
  return (
    <div className="container mt-5">
      <h3>Total Selected Student: {selectedStudents.length}</h3>
      <Button variant="dark" onClick={() => setStudents([])} className="mb-3">
        Clear
      </Button>

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
            <Form.Control
              type="text"
              placeholder="Student Birth"
              value={birth}
              onChange={e => setBirth(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="CCCD"
              value={CCCD}
              onChange={e => setCCCD(e.target.value)}
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
          <th>
      <Form.Check
        type="checkbox"
        checked={selectAll}
        onChange={e => handleSelectAll(e.target.checked)}
        label="Select All" // Add this line to display "Select All" next to the checkbox
      />
    </th>
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

      {/* Modal for editing student information */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={editStudent?.name || ''}
                onChange={e =>
                  setEditStudent({ ...editStudent, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCode">
              <Form.Label>Student Code</Form.Label>
              <Form.Control
                type="text"
                value={editStudent?.code || ''}
                onChange={e =>
                  setEditStudent({ ...editStudent, code: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBirth">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="text"
                value={editStudent?.birth || ''}
                onChange={e =>
                  setEditStudent({ ...editStudent, birth: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCCCD">
              <Form.Label>CCCD</Form.Label>
              <Form.Control
                type="text"
                value={editStudent?.CCCD || ''}
                onChange={e =>
                  setEditStudent({ ...editStudent, CCCD: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="dark" onClick={handleUpdateStudent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StudentManagement;
