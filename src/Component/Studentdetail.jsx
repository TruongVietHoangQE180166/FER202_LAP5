import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'https://student-api-nestjs.onrender.com/Students';

function StudentDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.data.success) {
          setStudent(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  }

  if (!student) {
    return <p className="text-center mt-5">Can't find student.</p>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Header className="bg-dark text-white text-center">
              <h4>Student information</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-center mb-4">{student.name}</Card.Title>
              <Card.Text>
                <strong>Student code:</strong> {student.studentCode}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> 
                <span className={`ms-2 badge ${student.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Back to student list
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDetail;
