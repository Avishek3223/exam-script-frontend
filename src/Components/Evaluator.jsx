import React, { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Table } from 'flowbite-react';

const Evaluator = () => {
  const { scripts, logoutUser, evaluators } = useContext(UserContext);
  const EvaluatorId = localStorage.getItem('evaluatorId');
  // eslint-disable-next-line
  const evaluatorIdRetrive = evaluators.filter(
    (evaluator) => evaluator.evalutorId === EvaluatorId
  );
  const scriptWithEvaluatorId = scripts.filter(
    (script) => script.evaluatorId === EvaluatorId
  );
  const count = scriptWithEvaluatorId.length;
  const checked = scriptWithEvaluatorId.filter(
    (script) => script.status === 'checked'
  ).length;
  const unchecked = count - checked;
  const navigate = useNavigate();

  const handleViewClick = (script, evaId) => {
    navigate(
      `/evaluation?pdfUrl=${script.file.data}&scriptId=${script._id}&evaluatorId=${evaId}`
    );
  };
  return (
    <div className="w-screen h-screen bg-[#ffffff]">
      <div className="flex h-[calc(100%-5.6rem)] gap-6">
        <div className="bg-[#f4ffe7] h-screen w-[15rem] flex justify-start flex-col">
          <div className="text-[1.1rem] flex flex-col text-center text-[#000000] p-4 bg-[#979797] w-[15rem] font-bold ">
            Logged In As <span className="text-white">{EvaluatorId}</span>
          </div>
          <div className="flex flex-col h-screen justify-evenly mt-[-20rem]">
            <div className="flex justify-center items-center">
              <p className="text-[1.1rem] font-[500]">Total Checked =</p>
              <p className="text-[1.2rem] font-[600]">{checked}</p>
            </div>
            <div className="flex justify-center items-center mt-[-25rem]">
              <p className="text-[1.1rem] font-[500]">Total Unchecked =</p>
              <p className="text-[1.2rem] font-[600]">{unchecked}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-6 ml-8">
          <div className="m-4 mx-11">
            <main className="w-[70vw] flex flex-col items-center justify-center max-h-[auto] min-h-[43rem] max600:w-[95vw] max600:relative max600:mt-6">
              <section className="w-[95%] rounded-[6px] overflow-auto bg-[#ffffffe0] my-[0.8rem] mx-auto custom-scrollbar">
                <div className="overflow-x-auto">
                  <Table className="w-[100%]">
                    <Table.Head className="border-b-2 text-[1.1rem] font-[600] border-[#8d8d8d]">
                      <Table.HeadCell>Name</Table.HeadCell>
                      <Table.HeadCell>Registration No</Table.HeadCell>
                      <Table.HeadCell>Branch</Table.HeadCell>
                      <Table.HeadCell>Semester</Table.HeadCell>
                      <Table.HeadCell>Subject</Table.HeadCell>
                      <Table.HeadCell>File</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {scriptWithEvaluatorId.map(
                        (script, index) =>
                          script.status === 'unchecked' && (
                            <Table.Row
                              key={index}
                              style={{ paddingBottom: '10px' }}
                            >
                              <Table.Cell>{script.name}</Table.Cell>
                              <Table.Cell>{script.registrationNo}</Table.Cell>
                              <Table.Cell>{script.branch}</Table.Cell>
                              <Table.Cell className="py-6">
                                {script.semester}
                              </Table.Cell>
                              <Table.Cell>{script.subject}</Table.Cell>
                              <Table.Cell>{script.status}</Table.Cell>
                              <Table.Cell>
                                {/* Pass the PDF URL to the handleViewClick function */}
                                <button
                                  onClick={() =>
                                    handleViewClick(script, script.evaluatorId)
                                  }
                                >
                                  View
                                </button>
                              </Table.Cell>
                            </Table.Row>
                          )
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </section>
            </main>
            <button
              className="absolute top-4 right-4 p-2 px-3 border border-black"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluator;
