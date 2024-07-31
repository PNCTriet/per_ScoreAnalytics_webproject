import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <p className="text-muted">
              &copy; {new Date().getFullYear()} RCake Studio. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-right">
            <a href="https://www.facebook.com/trietnguyenpham/" className="text-muted mx-2">
              Facebook
            </a>
            <a href="http://github.com/PNCTriet" className="text-muted mx-2">
              Github
            </a>
            <a href="https://www.instagram.com/banhcuonniengrang/" className="text-muted mx-2">
              Instagram
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
