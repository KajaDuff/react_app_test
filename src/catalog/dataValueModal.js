import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody} from 'reactstrap'


export default function DataValueModal(props) {
    const [modal, setModal] = useState(false)

    const toggle = () => {
        setModal(!modal)
    }

    const closeBtn = <button className="close" onClick={toggle}>&times;</button>

    return (
        <div>
                <Button
                    outline color="link"
                    onClick={toggle}
                    style={{  textAlign: 'center', marginBottom: '0', marginLeft: '25%' }}>
                        <p style={{margin: '0'}}>$$$</p>
                </Button>
            <Modal
                style={{
                    background: 'gray',
                    marginTop: '15%'
                }}
                isOpen={modal} toggle={toggle} className={props.className} >
                <ModalHeader toggle={toggle}
                    close={closeBtn}
                    style={{ textTransform: 'capitalize' }}
                >{props.title}</ModalHeader>
                <ModalBody>
                    <p>Random text</p>
                </ModalBody>

            </Modal>
        </div>
    );
}