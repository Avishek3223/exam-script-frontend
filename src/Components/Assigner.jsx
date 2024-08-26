import React, { useContext, useState } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';
import { Table } from 'flowbite-react';

const Assigner = () => {
  const { scripts, evaluators, setIsLoggedIn } = useContext(UserContext);
  console.log(scripts);
  const uncheckedScripts = scripts.filter(
    (script) => script.status === 'unchecked'
  );
  // eslint-disable-next-line
  const [selectedEvaluatorIds, setSelectedEvaluatorIds] = useState(
    Array(scripts.length).fill('')
  );

  const handleEvaluatorChange = (e, index) => {
    const selectedId = e.target.value;
    const newSelectedEvaluatorIds = [...selectedEvaluatorIds];
    newSelectedEvaluatorIds[index] = selectedId;
    setSelectedEvaluatorIds(newSelectedEvaluatorIds);
  };

  const handleDoneClick = async (id, index) => {
    try {
      // Get the selected evaluator ID for the script
      const selectedEvaluatorId = selectedEvaluatorIds[index];

      // Get the script ID
      const scriptId = id;
      console.log(scriptId);
      console.log(selectedEvaluatorId);
      // Make an HTTP request to update the script with the selected evaluator ID
      await axios.put(
        `https://exam-script-backend-1.onrender.com/api/studentScripts/${scriptId}`,
        { evaluatorId: selectedEvaluatorId, status: 'unchecked' }
      );

      console.log('Script updated successfully');
    } catch (error) {
      console.error('Error updating script:', error);
    } finally {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  };

  return (
    <div className="m-4 mx-11">
      <main className="w-[90vw] flex flex-col items-center justify-center max-h-[auto] min-h-[43rem] max600:w-[95vw] max600:relative max600:mt-6">
        <section className="w-[95%] rounded-[6px] overflow-auto bg-[#fffb] my-[0.8rem] mx-auto custom-scrollbar">
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Registration No</Table.HeadCell>
                <Table.HeadCell>Branch</Table.HeadCell>
                <Table.HeadCell>Semester</Table.HeadCell>
                <Table.HeadCell>Subject</Table.HeadCell>
                <Table.HeadCell>File</Table.HeadCell>
                <Table.HeadCell>Evaluator</Table.HeadCell>
                <Table.HeadCell>Confirmation</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {uncheckedScripts.map((script, index) => {
                  // Check if the script already has an evaluator ID assigned
                  const evaluatorIdPresent = !!script.evaluatorId;

                  // Only render if the script is unchecked and no evaluator ID is assigned
                  if (!evaluatorIdPresent) {
                    const selectedEvaluatorId = selectedEvaluatorIds[index];
                    // Filter evaluators based on department
                    const matchingEvaluators = evaluators.filter(
                      (evaluator) => evaluator.department === script.branch
                    );
                    return (
                      <Table.Row key={index} style={{ paddingBottom: '10px' }}>
                        <Table.Cell>{script.name}</Table.Cell>
                        <Table.Cell>{script.registrationNo}</Table.Cell>
                        <Table.Cell>{script.branch}</Table.Cell>
                        <Table.Cell className="py-6">
                          {script.semester}
                        </Table.Cell>
                        <Table.Cell>{script.subject}</Table.Cell>
                        <Table.Cell>
                          <a
                            href={script.file.data}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        </Table.Cell>
                        <Table.Cell>
                          {' '}
                          {/* Evaluator dropdown */}
                          <select
                            className="your-dropdown-className"
                            onChange={(e) => handleEvaluatorChange(e, index)}
                            value={selectedEvaluatorId}
                          >
                            <option value="">Select Evaluator</option>
                            {matchingEvaluators.map((evaluator) => (
                              <option
                                key={evaluator.evalutorId}
                                value={evaluator.evalutorId}
                              >
                                {evaluator.name}
                              </option>
                            ))}
                          </select>
                        </Table.Cell>
                        <Table.Cell>
                          <button
                            className="bg-[#c9ffc9] border border-black px-4"
                            onClick={() => handleDoneClick(script._id, index)}
                          >
                            Done
                          </button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  } else {
                    return null; // Don't render if an evaluator ID is already present
                  }
                })}
              </Table.Body>
            </Table>
          </div>
        </section>
      </main>
      {/* <Pagination
    //       activePage={currentPage}
    //       itemsCountPerPage={productsPerPage}
    //       totalItemsCount={filteredProducts.length}
    //       pageRangeDisplayed={5}
    //       onChange={handlePageChange}
    //       itemClass="page-item"
    //       linkClass="page-link"
    //     /> */}
      <button
        className="absolute top-4 right-4 p-2 px-3 border border-black"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Assigner;
