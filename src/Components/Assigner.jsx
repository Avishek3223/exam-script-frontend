import React, { useContext, useState } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';


const Assigner = () => {
  const { scripts, evaluators, setIsLoggedIn } = useContext(UserContext);
  console.log(scripts);
  const uncheckedScripts = scripts.filter(script => script.status === 'unchecked')
  // eslint-disable-next-line
  const [selectedEvaluatorIds, setSelectedEvaluatorIds] = useState(Array(scripts.length).fill(''));

  const handleEvaluatorChange = (e, index) => {
    const selectedId = e.target.value;
    const newSelectedEvaluatorIds = [...selectedEvaluatorIds];
    newSelectedEvaluatorIds[index] = selectedId;
    setSelectedEvaluatorIds(newSelectedEvaluatorIds);
  };

  const handleDoneClick = async (id,index) => {
    try {
      // Get the selected evaluator ID for the script
      const selectedEvaluatorId = selectedEvaluatorIds[index];

      // Get the script ID
      const scriptId = id;
      console.log(scriptId)
      console.log(selectedEvaluatorId)
      // Make an HTTP request to update the script with the selected evaluator ID
      await axios.put(`https://exam-script-backend-1.onrender.com/api/studentScripts/${scriptId}`, { evaluatorId: selectedEvaluatorId });

      console.log('Script updated successfully');
    } catch (error) {
      console.error('Error updating script:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  };

  return (
    <div className='m-4 mx-11'>
      <main className="w-[90vw] flex flex-col items-center justify-center max-h-[auto] min-h-[43rem] max600:w-[95vw] max600:relative max600:mt-6">
        <section className="w-[95%] rounded-[6px] overflow-auto bg-[#fffb] my-[0.8rem] mx-auto custom-scrollbar">
          <table className="w-[100%]">
            <thead className="border-b-2 text-[1.1rem] font-[600] border-[#8d8d8d]">
              <tr>
                <td>Name</td>
                <td>Registration No</td>
                <td>Branch</td>
                <td>Semester</td>
                <td>Subject</td>
                <td>File</td>
                <td>Evaluator</td>
                <td>Confirmation</td>
              </tr>
            </thead>
            <tbody>
              {uncheckedScripts.map((script, index) => {
                // Check if the script already has an evaluator ID assigned
                const evaluatorIdPresent = !!script.evaluatorId;

                // Only render if the script is unchecked and no evaluator ID is assigned
                if (!evaluatorIdPresent) {
                  const selectedEvaluatorId = selectedEvaluatorIds[index];
                  // Filter evaluators based on department
                  const matchingEvaluators = evaluators.filter(
                    evaluator => evaluator.department === script.branch
                  );
                  return (
                    <tr key={index} style={{ paddingBottom: '10px' }}>
                      <td>{script.name}</td>
                      <td>{script.registrationNo}</td>
                      <td>{script.branch}</td>
                      <td className='py-6'>{script.semester}</td>
                      <td>{script.subject}</td>
                      <td>
                        <a href={script.file.data} target="_blank" rel="noreferrer">View</a>
                      </td>
                      <td> {/* Evaluator dropdown */}
                        <select
                          className='your-dropdown-className'
                          onChange={(e) => handleEvaluatorChange(e, index)}
                          value={selectedEvaluatorId}
                        >
                          <option value=''>Select Evaluator</option>
                          {matchingEvaluators.map(evaluator => (
                            <option key={evaluator.evalutorId} value={evaluator.evalutorId}>
                              {evaluator.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className='bg-[#c9ffc9] border border-black px-4' onClick={() => handleDoneClick(script._id,index)}>Done</button>
                      </td>
                    </tr>
                  );
                } else {
                  return null; // Don't render if an evaluator ID is already present
                }
              })}
            </tbody>
          </table>
        </section>
        {/* <Pagination
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={filteredProducts.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        /> */}
      </main>
      <button className='absolute top-4 right-4 p-2 px-3 border border-black' onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Assigner;
