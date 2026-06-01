import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Progress,
  ModalFooter,
  Button
} from 'reactstrap';

export function Loader(props) {
  const { isOpen = false } = props;
  return (
    <Modal isOpen={isOpen}>
      <ModalBody>
        <Progress bar animated color="info" value="100">
          Please wait...
        </Progress>
      </ModalBody>
    </Modal>
  );
}

export function Alert(props) {
  const {
    isOpen = false,
    className = 'modal-primary',
    title = 'Alert',
    message = '',
    hasYesNoBtn = false,
    onYes = () => {},
    onNo = () => {}
  } = props;
  return (
    <Modal isOpen={isOpen} className={className} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>

      {hasYesNoBtn ? (
        <ModalFooter>
          <Button color="primary" onClick={onYes}>
            Yes
          </Button>{' '}
          <Button color="secondary" onClick={onNo}>
            No
          </Button>
        </ModalFooter>
      ) : (
        ''
      )}
    </Modal>
  );
}
