import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddEditLabelForm from './editLabelForm'


function ModalLabelCorrection(props) {

  const [modal, setModal] = useState(false)

  const toggle = () => {
    setModal(!modal)
  }

  const closeBtn = <button className="close" onClick={toggle}>&times;</button>
  const label = props.buttonLabel


  let title = 'Edit Item'


  //
  return (
    <div>
      <Button
        outline color="secondary"
        onClick={toggle}
        style={{ float: "left", marginRight: "10px", width: "95px" }}>{label}
      </Button>
      <Modal
        style={{
          background: 'gray',
          marginTop: '10%'
        }}
        isOpen={modal} toggle={toggle} className={props.className} >
        <ModalHeader toggle={toggle} close={closeBtn}>{title}</ModalHeader>
        <ModalBody>
          <AddEditLabelForm
            //addItemToState={props.addItemToState}
            updateState={props.updateState}
            toggle={toggle}
            item={props.item}
            page={props.page}
            />
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ModalLabelCorrection