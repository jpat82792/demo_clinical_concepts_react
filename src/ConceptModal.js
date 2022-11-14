import React, {Component} from 'react';
import { isThisTypeNode } from 'typescript';
import './ConceptModal.css';

export class ConceptModal extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: this.props.modalIsOpen,
      alternateNames:[],
      childConcepts:[],
      parentConcepts:[],
      allConcepts:this.props.allConcepts,
      alternateName:"",
      parentConceptIndex:0,
      childConceptIndex:0,
      concept:this.props.concept,
      conceptDetails:null,
      displayName: this.props.concept ? this.props.concept.displayName : "",
      description: this.props.concept ? this.props.concept.description : "",
      update: this.props.update
    };
  }

  componentDidUpdate(prevProps, prevState, snap){
    this.updateToConceptSourceIfNeeded(prevProps)
    this.updateToConceptIfNeeded(prevProps);
    this.updateIfUpdatePropertyIfNeeded(prevProps);
  }

  updateIfUpdatePropertyIfNeeded = (prevProps) =>{
    if(prevProps.update !== this.props.update){
      this.setState({update: this.props.update});
    }
  }

  updateToConceptSourceIfNeeded = (prevProps) =>{
    if(prevProps.allConcepts !== this.props.allConcepts){
      this.setState({allConcepts:this.props.allConcepts});
    } 
  }

  updateToConceptIfNeeded = (prevProps) =>{
    if(prevProps.concept !== this.props.concept){
      if(this.props.concept !== null && this.props.concept !== undefined ){
        this.setState({concept:this.props.concept});
        this.getConceptDetails(this.props.concept.conceptId);
      }
      else{
        this.resetConcept();
      }
    }
  }

  resetConcept = () =>{
    this.setState({
      displayName: "",
      description: "",
      childConcepts:[],
      parentConcepts:[],
      alternateNames:[]
    });
  }

  createUpdateConcept = () =>{
    if(this.state.update){
      this.updateConcept();
    }
    else{
      this.createConcept();
    }
  }

  updateConcept = () =>{
    let body = JSON.stringify(this.createUpdateMessage());
    fetch("http://3.210.77.245:3005/concepts",{method:'PUT', body:body, headers: {"Content-type": "application/json; charset=UTF-8"}})
    .then((response)=>{
      this.props.closeModal();
    })
    .catch((err) =>{
      console.log(err);
    });
  }

  createConcept = () =>{
    let body = JSON.stringify(this.createConceptMessage());
    let addedToList = false;
    fetch("http://3.210.77.245:3005/concepts",{method:'POST', body:body, headers: {"Content-type": "application/json; charset=UTF-8"}})
    .then((response) =>{
      return response.json();
    })
    .then((concept) =>{
      this.props.closeModal();
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  createConceptMessage = () =>{
    let conceptToCreate = {
      displayName:this.state.displayName,
      description:this.state.description,
      childConcepts: this.state.childConcepts,
      parentConcepts: this.state.parentConcepts,
      alternateNames: this.state.alternateNames
    };
    return conceptToCreate;
  }

  createUpdateMessage = () =>{
    let message = this.createConceptMessage();
    message["conceptId"] = this.state.concept.conceptId
    return message;
  }

  onAlternateNameChange=(e)=>{
    this.setState({alternateName: e.target.value});
  }

  addAlternateName=() =>{
    if(this.alternateName !== "" ){
      if(this.state.alternateNames.filter(name => name.alternateName === this.state.alternateName).length ===0){
        let newAlternateNames = this.state.alternateNames;
        newAlternateNames.push({alternateName:this.state.alternateName});
        
        this.setState({alternateName:"", alternateNames:newAlternateNames});
      }
    }
  }

  getConceptDetails = (conceptId) =>{
    fetch("http://3.210.77.245:3005/concept-details/" + conceptId)
    .then((response)=>{
      return response.json();
    })
    .then(conceptDetails =>{
      this.setConceptParametersInModal(conceptDetails.concept);
    })
    .catch((err) =>{
      console.log(err);
      
    });
  }

  setConceptParametersInModal = (concept) =>{
    this.setState({
      displayName:concept.displayName != null ? concept.displayName : "",
      description:concept.description != null ? concept.description : "",
      childConcepts:concept.childConcepts !=null ? concept.childConcepts:[],
      parentConcepts:concept.parentConcepts != null ? concept.parentConcepts :[],
      alternateNames:concept.alternateNames != null ? concept.alternateNames : []
    });
  }

  onSelectedParentConcept= (e) =>{
    this.setState({parentConceptIndex: e.target.value});
  }

  onSelectedChildConcept = (e) =>{
    this.setState({childConceptIndex: e.target.value});
  }

  addParentConcept = () =>{
    let conceptToAdd = this.state.allConcepts[this.state.parentConceptIndex];
    let currentParentConcepts = this.state.parentConcepts;
    if(currentParentConcepts.filter(concept => concept.conceptId === conceptToAdd.conceptId).length === 0){
      currentParentConcepts.push(conceptToAdd);
      this.setState({parentConcepts: currentParentConcepts});
    }
  }

  addChildConcept = () =>{
    let conceptToAdd = this.state.allConcepts[this.state.childConceptIndex];
    let currentChildConcepts = this.state.childConcepts;
    if(currentChildConcepts.filter(concept=>concept.conceptId === conceptToAdd.conceptId).length === 0){
      currentChildConcepts.push(conceptToAdd);
      this.setState({childConcepts: currentChildConcepts});
    }
  }

  removeChildConcept = (index) =>{
    let currentChildConcepts = this.state.childConcepts;
    currentChildConcepts.splice(index,1);
    this.setState({childConcepts: currentChildConcepts});
  }

  removeParentConcept = (index) =>{
    let currentParentConcepts = this.state.parentConcepts;
    currentParentConcepts.splice(index, 1);
    this.setState({parentConcept: currentParentConcepts});
  }

  onChangeDisplayName = (e) =>{
    this.setState({displayName: e.target.value});
  }

  onChangeDescription = (e) =>{
    this.setState({description: e.target.value});
  }

  

  render(){
    let classes = this.props.modalIsOpen ? 'show':'hide'; 
    classes += ' modal';
    this.state.alternateNames.map((name, index) =>{console.log(name);});
    return(
      <div className={classes}>
        <div className='modal-content'>
          <button className="close-button" onClick={this.props.closeModal}>X</button>
          <div className="concept-form">
            <div>
              <label>Concept name:</label>
              <input value={this.state.displayName} onChange={this.onChangeDisplayName} type="text" id="displayName" placeholder="Concept Name" />
            </div>
            <div>
              <label className="concept-description">Concept description</label>
              <textarea value={this.state.description} onChange={this.onChangeDescription} placeholder='content description' type="text"></textarea>
            </div>

            <div className="alternate-names-section">
              <label>Alternate concept names:</label>
              <input value={this.state.alternateName} onChange={this.onAlternateNameChange} type="text" placeholder="Alternate name" id="alternate-name-entry"/>
              <button onClick={()=>{this.addAlternateName()}}>Add</button>
              <ul className=''>
                {
                  this.state.alternateNames.map((name, index) =>(
                    <li key={name.alternateName}>{name.alternateName}</li>
                  ))
                }
              </ul>
            </div>
            <div className="parent-concepts-section">
              <label>Parent Concepts</label>
              <select name='parentConcept' onChange={this.onSelectedParentConcept}>
              {
                this.state.allConcepts.map((concept, index) =>(
                  <option key={concept.displayName} value={index}> {concept.displayName}</option>
                ))
                }
              </select>
              <button onClick={() =>{this.addParentConcept()}}>Add parent concept</button>
              <ul className="parent-concepts">
              {
                this.state.parentConcepts.map((concept, index) =>(
                  <li key={concept.conceptId} value={concept.displayName}> {concept.displayName} <button onClick={()=>{this.removeParentConcept(index)}}>X</button></li>
                ))
                }
              </ul>
            </div>
            <div className="child-concepts-section">
            <label>Child Concepts</label>
              <select name='childConcept' onChange={this.onSelectedChildConcept} defaultValue={this.state.childConceptIndex}>
                {
                this.state.allConcepts.map((concept, index) =>(
                  <option key={concept.conceptId} value={index}> {concept.displayName}</option>
                ))
                }

              </select>
              <button onClick={() =>{ this.addChildConcept()}}>Add child concept</button>
              <ul className="child-concepts">
              {
                this.state.childConcepts.map((concept, index) =>(
                  <li key={concept.conceptId} value={concept.displayName}> {concept.displayName} <button onClick={()=>{this.removeChildConcept(index)}}>X</button></li>
                ))
                }
              </ul>
              <button onClick={this.createUpdateConcept} >Create</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ConceptModal