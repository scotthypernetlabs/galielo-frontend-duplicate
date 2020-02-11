// import React from 'react';
// import { connect } from 'react-redux';
// import { closeModal } from '../../actions/ModalActions';
// import { IStore } from '../../business/objects/store';
// import { Dispatch } from 'redux';
//
// const QueryModal = ({ closeModal, query }) => (
//   <div className="coming-soon-modal" onClick={closeModal}>
//     <div className="coming-soon-modal-inner" onClick={e => e.stopPropagation()}>
//       <p> {query.title} </p>
//       <h2> {query.text} </h2>
//       <div className="query-button-container">
//         <button type="button" onClick={query.yesFunction} className="styled-button">
//           Yes
//         </button>
//         <button type="button" onClick={query.noFunction} className="styled-button">
//           No
//         </button>
//       </div>
//     </div>
//   </div>
// )
//
// const mapStateToProps = (state:IStore) => ({
//   query: state.ui.modal.query
// })
//
// const mapDispatchToProps = (dispatch:Dispatch) => ({
//   closeModal: () => dispatch(closeModal())
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(QueryModal);
