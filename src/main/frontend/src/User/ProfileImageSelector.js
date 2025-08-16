import { Modal, Button, Image, Row, Col, Container } from "react-bootstrap";
import { useState } from "react";

function ProfileImageSelector({ show, onClose, onSelect }) {
  const basePath = "/UserProfileImages/";  // 서버에서 제공하는 이미지 경로
  const imageCount = 16;
  const imageList = Array.from({ length: imageCount }, (_, i) => `${basePath}profile${i + 1}.png`);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);  // 부모에게 선택한 이미지 전달
      onClose();  // 모달 닫기
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>프로필 이미지 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            {imageList.map((img, idx) => (
              <Col xs={3} className="mb-3 text-center" key={idx}>
                <Image
                  src={img}
                  onClick={() => setSelectedImage(img)}  // 이미지 클릭 시 선택
                  thumbnail
                  roundedCircle
                  style={{
                    border: selectedImage === img ? "3px solid #007bff" : "2px solid #ddd",
                    cursor: "pointer",
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!selectedImage}>
          결정
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileImageSelector;
