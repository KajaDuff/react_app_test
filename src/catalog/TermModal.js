import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup } from 'reactstrap'
import { Link } from 'react-router-dom'

export default function TermModal(props) {
    const [modal, setModal] = useState(false)

    const toggle = () => {
        setModal(!modal)
    }

    const closeBtn = <button className="close" onClick={toggle}>&times;</button>
  
    return (
        <div>
            <ButtonGroup>
                <Button
                    outline color="secondary"
                    onClick={toggle}
                    style={{ float: "left" }}>Detail
            </Button>

            </ButtonGroup>
            <Modal
                style={{
                    background: 'gray',
                    marginTop: '15%'
                }}
                isOpen={modal} toggle={toggle} className={props.className} >
                <ModalHeader toggle={toggle} close={closeBtn} style={{ textTransform: 'capitalize' }}>{props.title}</ModalHeader>
                <ModalBody>
                    <p>
                        {props.description}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button >
                        <Link to={`/catalog/clusters/${props.cluster_id}/${props.id}`}
                            style={{ color: 'white' }}>Visit Page</Link>
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}