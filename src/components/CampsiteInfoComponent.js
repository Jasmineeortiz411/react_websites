import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Input, Label } from 'reactstrap';
import { Control, Errors, LocalForm } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
    
function RenderCampsite({campsite}) {
        return(
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }

function RenderComments({comments, postComment, campsiteId}) {
        if(comments) {
            return(
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map( comment => {
                        return (
                            <div key={comment.id}>
                                <p>{comment.text}<br />
                                --{comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                </p>
                            </div>
                        );
                    })}
                    <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            );
        }
        return (<div />)
    }

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state= {
            isModalOpen : false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {

        return(
            <React.Fragment>
                <Button onClick={this.toggleModal} color="secondary" outline><i className="fa fg-lg fa-pencil" />Submit Comment</Button>
                
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="form-group">
                                <Label htmlFor="rating" md={2}>Rating</Label>
                                <Control.select model=".rating" id="rating" name="rating"
                                    placeholder="rating"
                                    className="form-control" defaultValue="1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 charactors or less'
                                        }}
                                    />
                                  
                            </div>
                            <div className="form-group">
                                <Label htmlFor="text" md={2}>Comment</Label>
                                <Control.textarea model=".text" id="text" name="text"
                                        className="form-control" />
                            </div>
                            <Button color="primary" type="submit">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    };
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>  
                <div className = "row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }  
    return <div />;
}

export default CampsiteInfo;

// {this.campsite(this.state.selectedCampsite)}