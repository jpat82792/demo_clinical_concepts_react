import React, {Component} from 'react';
import ConceptModal from './ConceptModal.js';
import ConceptTile from './ConceptTile.js';



export class ConceptList extends Component{

  constructor(props){
    super(props);
    this.state = {
      concepts:[],
      modalIsOpen: false,
      searchWasActivated: false,
      selectedConcept:null,
      sourceList:[],
      searchParameter:"",
      update:false
  };
  }

  componentDidMount(){
    fetch("http://3.210.77.245:3005/concepts")
    .then((response) => {
      return response.json();})
    .then(concepts =>{
      this.setState({concepts:concepts, sourceList:concepts});
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  addConcept = (concept, added) =>{
    if(!added){
      let conceptsWithAddition = this.state.concepts;
      conceptsWithAddition.push(concept.concept);
      let sourceConceptsWithAddition = this.state.sourceList;
      sourceConceptsWithAddition.push(concept.concept);
      this.setState({concepts:conceptsWithAddition, sourceList:sourceConceptsWithAddition});
    }

  }

  deleteConcept = (conceptId) =>{
    fetch("http://3.210.77.245:3005/concepts/" + conceptId.conceptId, {method: 'DELETE'})
    .then(()=>{
      let remainingConcepts = this.removeDeletedConceptFromConcepts(conceptId.conceptId);
      let sourceConcepts = this.removeDeletedConceptsFromSourceList(conceptId.conceptId);
      this.setState({concepts:remainingConcepts, sourceList: sourceConcepts });
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  removeDeletedConceptFromConcepts = (conceptId) =>{
    let concepts= this.state.concepts.filter(concept =>{
      return concept.conceptId !== conceptId
    });
    return concepts;
  }

  removeDeletedConceptsFromSourceList = (conceptId) =>{
    let sourceConcepts= this.state.sourceList.filter(concept =>{
      return concept.conceptId !== conceptId
    });
    return sourceConcepts;
  }

  openModal=(concept, update)=>{
      this.setState({selectedConcept:concept,  update:update}, () =>{
        this.setState({modalIsOpen:true});
      });
  }

  closeModal=()=>{
    fetch("http://3.210.77.245:3005/concepts")
    .then((response) => {
      return response.json();})
    .then(concepts =>{
      this.setState({concepts:concepts, sourceList:concepts});
    })
    .catch((err)=>{
      console.log(err);
    });
    this.setState({modalIsOpen: false, selectedConcept: null});
  }

  updateFilter = (e) =>{
    if(e.target.value.length  >2){
      this.removeFilter();
      this.applyFilter(e.target.value);
    }
    else if(this.state.searchWasActivated){
      this.removeFilter();
    }
  }

  applyFilter = (targetValue) =>{
    this.setState({concepts: this.state.sourceList, searchWasActivated: false},() =>{
      let filtered = this.state.concepts.filter(element=>{
        return element.displayName.includes(targetValue);
      });
      this.setState({concepts:filtered, searchWasActivated:true});
    });

  }

  removeFilter = () =>{
    this.setState({concepts: this.state.sourceList, searchWasActivated: false});
  }
  
  render(){
    return(<div>
        <div className='list-tools'>
          <input onChange={this.updateFilter} id="search" type="text"
           placeholder="Type at least 3 characters" />
          <button onClick={() => this.openModal(null,false)}>New Concept</button>
        </div>
        <div>
          {
            this.state.concepts.map((concept, index)=>
              (
                <ConceptTile key={concept.conceptId} 
                concept={concept} 
                openModal={()=>this.openModal(concept, true)} 
                deleteConcept={()=>{this.deleteConcept(concept)}}
                />
              )
            )
          }
        </div>
        <ConceptModal addConcept={this.addConcept} concept={this.state.selectedConcept} update={this.state.update}
        allConcepts={this.state.sourceList} modalIsOpen={this.state.modalIsOpen} 
        closeModal={this.closeModal} />
      </div>);
  }
}

export default ConceptList;